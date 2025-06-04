// === Modified ResumeUpload.jsx (Frontend) ===

// import React, { useCallback, useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import axios from "axios";
// import "./Upload.css";
// import { db, auth } from "../firebaseConfig";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import jsPDF from "jspdf";
// import StudentNavbar from "./StudentNavbar";

// function ResumeUpload() {
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [atsScore, setATSScore] = useState(null);
//   const [recommendations, setRecommendations] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [user, setUser] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [feedback, setFeedback] = useState("");
//   const [rating, setRating] = useState(0);

//   useEffect(() => {
//     onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) fetchUserHistory(currentUser.uid);
//     });
//   }, []);

//   const fetchUserHistory = async (uid) => {
//     const q = query(collection(db, "resume_results"), where("uid", "==", uid));
//     const querySnapshot = await getDocs(q);
//     const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setHistory(data);
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("ATS Resume Analysis Report", 10, 10);
//     doc.text(`Score: ${atsScore}%`, 10, 20);
//     doc.text("Suggestions:", 10, 30);
//     recommendations.forEach((r, i) => doc.text(`- ${r}`, 10, 40 + i * 10));
//     doc.save("resume_report.pdf");
//   };

//   const encryptText = async (text) => {
//     const enc = new TextEncoder();
//     const data = enc.encode(text);
//     const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
//     const iv = crypto.getRandomValues(new Uint8Array(12));
//     const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);

//     const rawKey = await crypto.subtle.exportKey("raw", key);

//     return {
//       encryptedText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
//       key: btoa(String.fromCharCode(...new Uint8Array(rawKey))),
//       iv: btoa(String.fromCharCode(...iv)),
//     };
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const fileName = file.name; // 👈 Get file name
//     const formData = new FormData();
//     formData.append("resume", file);
  
//     axios.post("http://localhost:5000/upload", formData)
//       .then(async (res) => {
//         const { score, suggestions, encryptedText, key, iv } = res.data;
  
//         setUploadStatus("Resume analyzed successfully.");
//         setATSScore(score);
//         setRecommendations(suggestions);
  
//         if (user) {
//           await addDoc(collection(db, "resume_results"), {
//             score,
//             suggestions,
//             uid: user.uid,
//             email: user.email,
//             fileName, // 👈 Store file name in Firestore
//             encryptedText,
//             key,
//             iv,
//             timestamp: serverTimestamp(),
//           });
//           fetchUserHistory(user.uid);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setUploadStatus("Error uploading resume.");
//       });
//   }, [user]);
  

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   const getScoreColor = (score) => {
//     if (score >= 75) return "#4caf50";
//     if (score >= 50) return "#ff9800";
//     return "#f44336";
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//         <StudentNavbar />
//     <div className={`upload-container ${darkMode ? "dark" : ""}`}
//     >
//       {/* <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
//         {darkMode ? "Light Mode" : "Dark Mode"}
//       </button> */}

// <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle-icon">
//   <i className="fas fa-star"></i>
// </button>

//       {/* <div {...getRootProps()} className="dropzone">
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop your resume here, or click to select file</p>
//       </div> */}

// <div {...getRootProps()} className="dropzone">
//   <input {...getInputProps()} />
//   <i className="fas fa-cloud-upload-alt"></i>
//   <p>Drag & drop your resume or click to upload</p>
// </div>

//       {uploadStatus && <p className="status-msg">{uploadStatus}</p>}
//       {atsScore !== null && (
//         <div className="score-container">
//           <div className="progress-ring">
//             <svg width="120" height="120">
//               <circle className="bg" cx="60" cy="60" r="50" strokeWidth="12" />
//               <circle
//                 className="progress"
//                 cx="60"
//                 cy="60"
//                 r="50"
//                 strokeWidth="12"
//                 stroke={getScoreColor(atsScore)}
//                 strokeDasharray="314"
//                 strokeDashoffset={314 - (atsScore / 100) * 314}
//               />
//             </svg>
//             <div className="score-text">{atsScore}%</div>
//           </div>
//           {/* <button onClick={downloadPDF} className="pdf-btn">Download PDF</button> */}

//           <button onClick={downloadPDF} className="pdf-btn">
//   <i className="fas fa-download"></i> Download PDF
// </button>

//         </div>
//       )}
//       {recommendations && (
//         <div className="suggestions">
//           <h3>Suggestions:</h3>
//           <ul>
//             {recommendations.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       )}
     
//     </div>
//     </div>
//   );
// }

// export default ResumeUpload;






import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./r.css";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import StudentNavbar from "./StudentNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResumeUpload() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [atsScore, setATSScore] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const maxFileSize = 2 * 1024 * 1024; // 2MB

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchUserHistory(currentUser.uid);
    });
  }, []);

  const fetchUserHistory = async (uid) => {
    const q = query(collection(db, "resume_results"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHistory(data);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("ATS Resume Analysis Report", 10, 10);
    doc.text(`Score: ${atsScore}%`, 10, 20);
    doc.text("Suggestions:", 10, 30);
    recommendations.forEach((r, i) => doc.text(`- ${r}`, 10, 40 + i * 10));
    doc.save("resume_report.pdf");
  };

  const encryptText = async (text) => {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
    const rawKey = await crypto.subtle.exportKey("raw", key);

    return {
      encryptedText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      key: btoa(String.fromCharCode(...new Uint8Array(rawKey))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 1. Type Validation
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    // 2. Size Validation
    if (file.size > maxFileSize) {
      toast.error("File size should be less than 2MB.");
      return;
    }

    const fileName = file.name;

    // 3. Duplicate File Name Check
    const existingFile = history.find((h) => h.fileName === fileName);
    if (existingFile) {
      toast.warning("A file with the same name has already been uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setIsUploading(true);
    setUploadStatus("Analyzing Resume...");

    axios.post("http://localhost:5000/upload", formData)
      .then(async (res) => {
        const { score, suggestions, encryptedText, key, iv } = res.data;

        setUploadStatus("Resume analyzed successfully.");
        setATSScore(score);
        setRecommendations(suggestions);

        if (user) {
          await addDoc(collection(db, "resume_results"), {
            score,
            suggestions,
            uid: user.uid,
            email: user.email,
            fileName,
            encryptedText,
            key,
            iv,
            timestamp: serverTimestamp(),
          });
          fetchUserHistory(user.uid);
        }

        toast.success("Resume uploaded and analyzed successfully.");
      })
      .catch((err) => {
        console.error(err);
        setUploadStatus("Error uploading resume.");
        toast.error("Failed to upload resume.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, [user, history]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const getScoreColor = (score) => {
    if (score >= 75) return "#4caf50";
    if (score >= 50) return "#ff9800";
    return "#f44336";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <StudentNavbar />
      <div className={`upload-container ${darkMode ? "dark" : ""}`}>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle-icon">
          <i className="fas fa-star"></i>
        </button>

        <div {...getRootProps()} className="dropzone" aria-label="Upload your resume">
          <input {...getInputProps()} />
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag & drop your resume or click to upload</p>
        </div>

        {isUploading && <p className="status-msg">Analyzing Resume...</p>}
        {uploadStatus && !isUploading && <p className="status-msg">{uploadStatus}</p>}

        {atsScore !== null && (
          <div className="score-container">
            <div className="progress-ring">
              <svg width="120" height="120">
                <circle className="bg" cx="60" cy="60" r="50" strokeWidth="12" />
                <circle
                  className="progress"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeWidth="12"
                  stroke={getScoreColor(atsScore)}
                  strokeDasharray="314"
                  strokeDashoffset={314 - (atsScore / 100) * 314}
                />
              </svg>
              <div className="score-text">{atsScore}%</div>
            </div>

            <button onClick={downloadPDF} className="pdf-btn">
              <i className="fas fa-download"></i> Download PDF
            </button>
          </div>
        )}

        {recommendations && (
          <div className="suggestions">
            <h3>Suggestions:</h3>
            <ul>
              {recommendations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ResumeUpload;
