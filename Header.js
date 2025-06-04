import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "./DashboardStyles.css";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login"); // Redirect to login if user is not authenticated
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserRole(userData.role);
          setLoading(false);
        } else {
          throw new Error("User role not found.");
        }
      } catch (err) {
        console.error(err.message);
        setLoading(false);
        navigate("/login"); // Redirect to login if error occurs
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {userRole === "admin" ? (
        <>
          <h1>Admin Dashboard</h1>
          <div>
            <h2>Admin Profile</h2>
            {/* Admin Profile Information */}
            <p>Welcome Admin. Here you can manage users, settings, etc.</p>
          </div>
          <div>
            <h2>Other Admin Features</h2>
            {/* Admin-specific content */}
            <p>Admin-specific content goes here...</p>
          </div>
        </>
      ) : userRole === "student" ? (
        <>
          <h1>Student Dashboard</h1>
          <div>
            <h2>Student Profile</h2>
            {/* Student Profile Information */}
            <p>Welcome Student. Here you can upload and analyze resumes.</p>
          </div>
          <div>
            <h2>Analyze Resume</h2>
            {/* Student-specific content */}
            <p>Analyze and manage your resume here.</p>
            <button onClick={() => navigate("/generate")}>Analyze Resume</button>
          </div>
        </>
      ) : (
        <div>You do not have access to this page.</div>
      )}
    </div>
  );
};

export default Dashboard;
