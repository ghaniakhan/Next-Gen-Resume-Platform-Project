import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CryptoJS from "crypto-js";
import "./ResumeGenerator.css";
import StudentNavbar from "./StudentNavbar";

const ResumeGenerator = () => {
  const [template, setTemplate] = useState("modern");
  const [themeColor, setThemeColor] = useState("#4CAF50");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [darkMode, setDarkMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [user] = useAuthState(auth);

  const [sections, setSections] = useState([
    { id: "Name", content: "" },
    { id: "Email", content: "" },
    { id: "Education", content: "" },
    { id: "Skills", content: "" },
    { id: "Experience", content: "" },
  ]);

  const resumeRef = useRef();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedSections = Array.from(sections);
    const [reorderedItem] = updatedSections.splice(result.source.index, 1);
    updatedSections.splice(result.destination.index, 0, reorderedItem);
    setSections(updatedSections);
  };

  const handleSectionChange = (id, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, content: value } : section
      )
    );
  };

  const addNewSection = () => {
    const newSection = { id: `custom-${Date.now()}`, content: "" };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  const generatePDF = () => {
    const element = resumeRef.current;
    const options = {
      margin: 0,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  const generateDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          children: sections.map((section) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: section.content || "",
                  font: fontFamily,
                  color: "000000",
                }),
              ],
              spacing: { after: 200 },
            })
          ),
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  const encryptionKey = "Ghania"; // <-- MUST keep it secure & SAME for encrypt/decrypt!

const saveToFirebase = async () => {
  if (!user) {
    alert("Please login first!");
    return;
  }
  try {
    // Encrypt the sections data
    const resumeData = {
      userId: user.uid,
      sections,
      template,
      themeColor,
      fontFamily,
      timestamp: new Date(),
    };
    const resumeString = JSON.stringify(resumeData);

    const encryptedData = CryptoJS.AES.encrypt(resumeString, encryptionKey).toString();

    await addDoc(collection(db, "resumes"), {
      userId: user.uid,
      encryptedResume: encryptedData,
      timestamp: new Date(),
    });

    alert("Resume saved securely!");
  } catch (error) {
    console.error(error);
    alert("Failed to save resume.");
  }
};

  return (
<div className="min-h-screen bg-gray-100">
    <StudentNavbar />
    <div className={`resume-container ${darkMode ? "dark" : ""}`}>

      <h1 className="title">🎨 Create Your Resume</h1>
  
      <div className="controls">
        <div className="control-group">
          <label>Template:</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value)}>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimalist">Minimalist</option>
            <option value="elegant">Elegant</option>
          </select>
        </div>
  
        <div className="control-group">
          <label>Theme Color:</label>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
          />
        </div>
  
        <div className="control-group">
          <label>Font:</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Roboto">Roboto</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
  
        <button className="toggle-mode" onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
  
        <div className="control-group">
  {/* <label>Upload Profile Picture:</label>
  <input type="file" accept="image/*" onChange={handleImageUpload} /> */}

<label className="upload-btn">
  Upload Image
  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
</label>

</div>

      </div>
  
      <button className="add-section" onClick={addNewSection}>
        + Add New Section
      </button>
  
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map(({ id, content }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      className="section-card"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{
                        ...provided.draggableProps.style,
                        borderColor: themeColor,
                        fontFamily,
                      }}
                    >
                      <textarea
                        value={content}
                        onChange={(e) => handleSectionChange(id, e.target.value)}
                        placeholder={`Enter ${id}...`}

                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
  
      <div className="preview-heading">🖼️ Preview</div>

{/* Dynamic Resume Preview based on Template */}
<div className={`resume-preview ${template}`} ref={resumeRef} style={{ borderColor: themeColor, fontFamily }}>

  {/* Template specific layouts */}
  {template === "modern" || template === "minimalist" ? (
    <div className="two-column">
      {template === "modern" ? (
        // Modern Template: Profile on left, content on right
        <>
          <div className="left-column">
            {profilePic && (
              <img src={profilePic} alt="Profile" className="profile-pic-large" />
            )}
          </div>
          <div className="right-column">
            {sections.map((section, idx) => (
              <div key={idx} className="section-block">
                <h3 style={{ color: themeColor }}>{section.id}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Minimalist Template: Profile on right, content on left
        <>
          <div className="right-column">
            {sections.map((section, idx) => (
              <div key={idx} className="section-block">
                <h3 style={{ color: themeColor }}>{section.id}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
          <div className="left-column">
            {profilePic && (
              <img src={profilePic} alt="Profile" className="profile-pic-large" />
            )}
          </div>
        </>
      )}
    </div>
  ) : template === "classic" ? (
    // Classic Template - Rows and Sections
    <div className="classic-layout">
      <div className="profile-container">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="profile-pic-large" />
        )}
      </div>
      <div className="row-section">
        {sections.slice(0, 2).map((section, idx) => (
          <div key={idx} className="half-width-section">
            <h3 style={{ color: themeColor }}>{section.id}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
      <div className="row-section">
        {sections.slice(2).map((section, idx) => (
          <div key={idx} className="half-width-section">
            <h3 style={{ color: themeColor }}>{section.id}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    // Elegant Template - Profile Top, Content Stylishly Below
    <div className="elegant-layout">
      <div className="profile-container">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="profile-pic-elegant" />
        )}
      </div>
      <div className="elegant-content">
        {sections.map((section, idx) => (
          <div key={idx} className="elegant-section">
            <h2 style={{ color: themeColor }}>{section.id}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

{/* Button Group */}
  <div className="button-group">
  <button onClick={generatePDF}>📄 Download PDF</button>
  <button onClick={generateDOCX}>📄 Download DOCX</button>
  <button onClick={saveToFirebase}>💾 Save to Firebase</button>
</div>

  
    </div>
    </div>
  );
};

export default ResumeGenerator;



