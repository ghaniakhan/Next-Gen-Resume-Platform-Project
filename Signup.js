import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import { FcGoogle } from "react-icons/fc";

const ADMIN_EMAIL = "admin123@gmail.com";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password);

  const getFriendlyError = (code) => {
    const map = {
      "auth/email-already-in-use": "Email is already registered.",
      "auth/invalid-email": "Invalid email format.",
      "auth/weak-password": "Password is too weak.",
    };
    return map[code] || "An unexpected error occurred.";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!isStrongPassword(password)) {
      return setError("Password must include at least 1 uppercase letter, 1 number, and 1 special character.");
    }

    if (!agree) {
      return setError("You must agree to the Terms & Conditions.");
    }

    if (email === ADMIN_EMAIL) {
      return setError("Admin accounts cannot be created via signup.");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "student",
      });

      navigate("/login");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        setError("Admin cannot sign up using Google.");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          role: "student",
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h1>👋 Create Account</h1>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSignup}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="📧 Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="🔒 Password" minLength="6" required />
          <label className="checkbox">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I agree to the Terms & Conditions
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="separator">or</div>
        <button onClick={handleGoogleSignup} className="google-btn" disabled={loading}>
          <FcGoogle className="icon" />
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Signup;
