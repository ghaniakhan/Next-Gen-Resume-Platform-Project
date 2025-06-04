import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ResumeUpload from "./components/ResumeUpload";
import ResumeGenerator from "./components/ResumeGenerator";
import Dashboard from "./components/Dashboard";
import AuthWrapper from "./components/AuthWrapper";
import AdminProfile from "./components/AdminProfile";
import StudentDashboard from "./components/StudentDashboard";
import Home from "./components/Home";
import StudentNavbar from "./components/StudentNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import History from "./components/History";
import Feedback from "./components/Feedback";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Role-based Routes */}
      <Route path="/upload" element={<ResumeUpload />} />
      <Route path="/generate" element={<ResumeGenerator />} />

      {/* Only accessible for students */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/studentNavbar" element={<StudentNavbar />} />
      <Route path="/history" element={<History />} />
      <Route path="/logout" element={<Login />} />
      <Route path="/feedback" element={<Feedback />} />

      <Route path="/admin-profile" element={<AdminRoute element={<AdminProfile />} />} />
    </Routes>
  );
};

export default App;
