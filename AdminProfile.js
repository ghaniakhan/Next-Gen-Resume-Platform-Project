import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { updateProfile } from "firebase/auth";
import CryptoJS from "crypto-js";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaPencilAlt, FaTrash, FaBars } from "react-icons/fa";
import { onSnapshot } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSun, FaMoon } from "react-icons/fa";
import "./AdminDashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



const encryptionKey = "Ghania";

const encrypt = (text) => CryptoJS.AES.encrypt(text, encryptionKey).toString();
const decrypt = (cipher) =>
  CryptoJS.AES.decrypt(cipher, encryptionKey).toString(CryptoJS.enc.Utf8);

const AdminProfile = () => {
  const [user] = useAuthState(auth);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeSection, setActiveSection] = useState("profile");
  const [feedbackFilter, setFeedbackFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, activeToday: 0 });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    photoURL: "",
    phoneNumber: "",
    
  });
  const [editField, setEditField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        const decryptedInfo = {
          name: data.name ? decrypt(data.name) : user.displayName || "",
          email: data.email ? decrypt(data.email) : user.email || "",
          photoURL: data.photoURL
            ? decrypt(data.photoURL)
            : user.photoURL || "https://via.placeholder.com/100",
          phoneNumber: data.phoneNumber ? decrypt(data.phoneNumber) : "",
         
        };
  
        setAdminInfo(decryptedInfo);
  
        // Fetch feedbacks
        const feedbackSnapshot = await getDocs(collection(db, "resume_feedback"));
        const feedbackData = [];
        feedbackSnapshot.forEach((doc) => feedbackData.push(doc.data()));
        setFeedbacks(feedbackData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
   
    fetchAdminData();
   
  }, [user]);
  

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);
  
  
  const handleFieldEdit = (field) => setEditField(field);

  const handleFieldDelete = (field) => {
    setAdminInfo((prev) => ({ ...prev, [field]: "" }));
  };

  

  const feedbackCounts = {
    positive: feedbacks.filter(fb => fb.rating >= 4).length,
    neutral: feedbacks.filter(fb => fb.rating === 3).length,
    negative: feedbacks.filter(fb => fb.rating <= 2).length,
  };
  
  const feedbackData = [
    { name: "Positive", value: feedbackCounts.positive },
    { name: "Neutral", value: feedbackCounts.neutral },
    { name: "Negative", value: feedbackCounts.negative },
  ];
  
  const COLORS = ["#4CAF50", "#FFC107", "#F44336"]; // Green, Yellow, Red
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      setAdminInfo((prev) => ({ ...prev, photoURL: imageURL }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const encryptedData = {
      name: encrypt(adminInfo.name),
      email: encrypt(adminInfo.email),
      photoURL: encrypt(adminInfo.photoURL),
      phoneNumber: encrypt(adminInfo.phoneNumber),
    };
    try {
      await setDoc(doc(db, "users", user.uid), encryptedData, { merge: true });
      await updateProfile(user, {
        displayName: adminInfo.name,
        photoURL: adminInfo.photoURL,
      });
      alert("Profile updated successfully!");
      setEditField(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      alert("Profile deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile.");
    }
  };


useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
    const allUsers = [];
    let activeTodayCount = 0;
    const today = new Date();

    snapshot.forEach((doc) => {
      const data = doc.data();
      allUsers.push(data);

      const lastLogin = data.lastLogin?.seconds
        ? new Date(data.lastLogin.seconds * 1000)
        : null;

      if (lastLogin && lastLogin.toDateString() === today.toDateString()) {
        activeTodayCount++;
      }
    });

    setUsers(allUsers);
    setUserStats({
      total: allUsers.length,
      activeToday: activeTodayCount,
    });
  });

  return () => unsubscribe(); // Cleanup
}, []);
  const ActualContent = () => (
    <>
      {activeSection === "profile" && (
        <div className="profile-section">
          <h1>👩‍💼 Admin Profile</h1>
          <img src={adminInfo.photoURL} alt="Admin" className="admin-photo" />
          <div className="profile-form">
            {Object.entries(adminInfo).map(([key, value]) => (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                <input
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  disabled={editField !== key}
                />
                <FaPencilAlt
                  onClick={() => handleFieldEdit(key)}
                  style={{ cursor: "pointer", marginLeft: 10 }}
                />
                <FaTrash
                  onClick={() => handleFieldDelete(key)}
                  style={{ cursor: "pointer", marginLeft: 10, color: "red" }}
                />
              </label>
            ))}
            {/* <label>
              Upload Profile Picture:
              <input type="file" onChange={handleImageChange} accept="image/*" />
            </label> */}

<label htmlFor="upload-photo">
  Upload Profile Picture:
  <button type="button" onClick={() => document.getElementById('upload-photo').click()}>
    Choose File
  </button>
  <input
    type="file"
    id="upload-photo"
    style={{ display: 'none' }}
    onChange={handleImageChange}
    accept="image/*"
  />
</label>

            <div className="profile-actions">
              <button onClick={handleSave}>💾 Save</button>
              <button onClick={handleDelete} style={{ backgroundColor: "red" }}>
                ❌ Delete
              </button>
            </div>
          </div>
        </div>
      )}
{activeSection === "statistics" && (
  <div className="statistics-section">
    <h1>📈 User Statistics</h1>
    <div className="stat-cards">
      <div className="stat-card">👥 Total Users: {userStats.total}</div>
      <div className="stat-card">🟢 Active Today: {userStats.activeToday}</div>
    </div>
    <div className="user-comparison-chart">
  <h3>📊 Users: Total vs Active Today</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={[
        { label: "Total Users", value: userStats.total },
        { label: "Active Today", value: userStats.activeToday },
      ]}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#4CAF50" />
    </BarChart>
  </ResponsiveContainer>
</div>

  </div>
)}
{activeSection === "feedbacks" && (
  <div className="feedback-section">
    <h1>🗣️ Feedbacks</h1>

    {/* Stylish Toggle Filter */}
    <div className="filter-toggle">
      <button
        className={feedbackFilter === "All" ? "active" : ""}
        onClick={() => setFeedbackFilter("All")}
      >
        🌐 All
      </button>
      <button
        className={feedbackFilter === "Positive" ? "active" : ""}
        onClick={() => setFeedbackFilter("Positive")}
      >
        😊 Positive
      </button>
      <button
        className={feedbackFilter === "Negative" ? "active" : ""}
        onClick={() => setFeedbackFilter("Negative")}
      >
        😠 Negative
      </button>
    </div>

 
    <button
  className="dark-mode-toggle"
  onClick={() => setIsDarkMode(prev => !prev)}
  title="Toggle Dark Mode"
>
  {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
</button>

    {/* Feedback Chart */}
    <div className="feedback-graph">
      <h3>📊 Feedback Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={feedbackData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {feedbackData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Feedback Table */}
    <div className="feedback-table-container">
      {feedbacks.length > 0 ? (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks
              .filter((fb) => {
                if (feedbackFilter === "Positive") return fb.rating >= 4;
                if (feedbackFilter === "Negative") return fb.rating <= 2;
                return true;
              })
              .map((fb, idx) => {
                let feedbackClass = "";
                if (fb.rating >= 4) feedbackClass = "positive-row";
                else if (fb.rating <= 2) feedbackClass = "negative-row";
                else feedbackClass = "neutral-row";

                return (
                  <tr key={idx} className={feedbackClass}>
                    <td>{fb.email}</td>
                    <td>{fb.rating}</td>
                    <td>{fb.feedback}</td>
                    <td>{new Date(fb.timestamp?.seconds * 1000).toLocaleString()}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <p>No feedback submitted yet.</p>
      )}
    </div>
  </div>
)}
    </>
  );

  return (
    <div className="dashboard-container">
      <FaBars
        className="hamburger-icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <button
          onClick={() => {
            setActiveSection("profile");
            setSidebarOpen(false);
          }}
        >
          👤 Admin Profile
        </button>
       
        <button
          onClick={() => {
            setActiveSection("feedbacks");
            setSidebarOpen(false);
          }}
        >
          🗣️ View Feedback
        </button>

        <button
  onClick={() => {
    setActiveSection("statistics");
    setSidebarOpen(false);
  }}
>
  📊 User Statistics
</button>

      </aside>

      <main className="main-content">
        {loading ? <ClipLoader size={50} color="#3282b8" /> : <ActualContent />}
      </main>
    </div>
  );
};

export default AdminProfile



