import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import StudentNavbar from "./StudentNavbar";
import Home from "./Home";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData.role);

          if (userData.role !== "student") {
            navigate("/admin-profile"); // Redirect admin to their profile
          }
        }
      }
    };

    checkRole();
  }, [navigate]);

  if (role === "student") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Home />
        {/* <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-indigo-700">Student Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Welcome! Choose an option to begin your resume journey.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button
              onClick={() => navigate("/upload")}
              className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Upload Resume (ATS Score)
            </button>
            <button
              onClick={() => navigate("/generate")}
              className="bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition shadow-md"
            >
              Generate Resume
            </button>
          </div>
        </div> */}
      </div>
    );
  }

  return <div className="text-center p-8 text-gray-500">Loading...</div>;
};

export default Dashboard;
