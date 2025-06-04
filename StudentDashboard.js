// // StudentDashboard.js
// import React, { useEffect, useState } from "react";
// import { auth, db } from "../firebaseConfig";
// import "./StudentDashboard";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import "./StudentDashboard.css";

// const StudentDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [education, setEducation] = useState("");
//   const [profilePic, setProfilePic] = useState("");
//   const [editingProfile, setEditingProfile] = useState(false);
//   const [history, setHistory] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       navigate("/");
//       return;
//     }
//     setUser(currentUser);
//     loadProfile(currentUser.uid);
//     fetchResumeHistory(currentUser.uid);
//   }, [navigate]);

//   const loadProfile = async (uid) => {
//     const userRef = doc(db, "users", uid);
//     const snap = await getDoc(userRef);
//     if (snap.exists()) {
//       const data = snap.data();
//       setName(data.name || "");
//       setEducation(data.education || "");
//       setProfilePic(data.profilePic || "");
//     }
//   };

//   const saveProfile = async () => {
//     if (!name.trim()) return;
//     await setDoc(
//       doc(db, "users", user.uid),
//       { name, education, profilePic },
//       { merge: true }
//     );
//     setEditingProfile(false);
//   };

//   const deleteProfile = async () => {
//     if (!window.confirm("Are you sure you want to delete your profile?")) return;
//     await deleteDoc(doc(db, "users", user.uid));
//     setName("");
//     setEducation("");
//     setProfilePic("");
//     setEditingProfile(true);
//   };

//   const fetchResumeHistory = async (uid) => {
//     const q = query(collection(db, "resume_results"), where("uid", "==", uid));
//     const snap = await getDocs(q);
//     const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setHistory(results);
//   };

//   const logout = () => {
//     auth.signOut();
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <aside className="sidebar">
//         <h2>Student Dashboard</h2>
//         <ul>
//           <li onClick={() => setEditingProfile(false)}>📄 View Resume History</li>
//           <li onClick={() => setEditingProfile(true)}>⚙️ Profile Settings</li>
//           <li onClick={logout}>🚪 Logout</li>
//         </ul>
//       </aside>

//       <main className="dashboard-content">
//         {editingProfile ? (
//           <div className="profile-form">
//             <h3>Update Your Profile</h3>
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Education"
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Profile Picture URL"
//               value={profilePic}
//               onChange={(e) => setProfilePic(e.target.value)}
//             />
//             <div className="form-actions">
//               <button onClick={saveProfile}>💾 Save</button>
//               <button onClick={deleteProfile}>🗑️ Delete</button>
//             </div>
//           </div>
//         ) : (
//           <div className="history-view">
//             <h3>📝 Resume History</h3>
//             {history.length === 0 ? (
//               <p>No resume history found.</p>
//             ) : (
//               <ul>
//                 {history.map((item) => (
//                   <li key={item.id}>
//                     Score: {item.score}% – {" "}
//                     {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default StudentDashboard;
