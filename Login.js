// import React, { useState } from "react";
// import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import "./AuthStyles.css";
// import { FcGoogle } from "react-icons/fc";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
  
//       const docRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(docRef);
  
//       // Create user doc if it doesn't exist
//       if (!docSnap.exists()) {
//         await setDoc(docRef, {
//           email: user.email,
//           role: user.email === ADMIN_EMAIL ? "admin" : "student",
//         });
//       }
  
//       await navigateBasedOnRole(user.uid);
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };
  
//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       const docRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(docRef);

//       if (!docSnap.exists()) {
//         await setDoc(docRef, {
//           email: user.email,
//           role: "student",
//         });
//       }

//       await navigateBasedOnRole(user.uid);
//     } catch (err) {
//       setError(err.message);
//     }
//     setLoading(false);
//   };

//   const ADMIN_EMAIL = "admin123@gmail.com"; // Replace with your real admin email

//   const navigateBasedOnRole = async (uid) => {
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);
  
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       const role = data.role;
  
//       if (data.email === ADMIN_EMAIL) {
//         // Force role to admin if the email matches
//         await setDoc(docRef, { ...data, role: "admin" }, { merge: true });
//         navigate("/admin-profile");
//       } else if (role === "student") {
//         navigate("/dashboard");
//       } else {
//         console.error("Unauthorized role or unknown role");
//         throw new Error("Unauthorized Role");
//       }
//     } else {
//       throw new Error("User role not found.");
//     }
//   };
  


//   return (
//     <div className="container">
//       <div className="auth-card">
//         <h1>🔐 Login</h1>
//         {error && <p className="error-text">{error}</p>}
//         <form onSubmit={handleLogin}>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="📧 Email" required />
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="🔒 Password" minLength="6" required />
//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="separator">or</div>
//         <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
//           <FcGoogle className="icon" />
//           {loading ? "Please wait..." : "Sign in with Google"}
//         </button>

//         <p>Don’t have an account? <a href="/signup">Signup here</a></p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import { FcGoogle } from "react-icons/fc";
import { ADMIN_EMAIL } from "../config";

// const ADMIN_EMAIL = "admin123@gmail.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getFriendlyError = (code) => {
    const map = {
      "auth/user-not-found": "User not found.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-email": "Invalid email format.",
    };
    return map[code] || "Login failed.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          role: user.email === ADMIN_EMAIL ? "admin" : "student",
        });
      }

      await navigateBasedOnRole(user.uid);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === ADMIN_EMAIL) {
        return setError("Admin cannot login via Google.");
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          role: "student",
        });
      }

      await navigateBasedOnRole(user.uid);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
    setLoading(false);
  };

  const navigateBasedOnRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.email === ADMIN_EMAIL) {
        await setDoc(docRef, { ...data, role: "admin" }, { merge: true });
        navigate("/admin-profile");
      } else if (data.role === "student") {
        navigate("/dashboard");
      } else {
        throw new Error("Unauthorized role");
      }
    } else {
      throw new Error("User role not found.");
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h1>🔐 Login</h1>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="📧 Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="🔒 Password" required />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="separator">or</div>
        <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
          <FcGoogle className="icon" />
          {loading ? "Please wait..." : "Sign in with Google"}
        </button>

        <p>Don’t have an account? <a href="/signup">Signup here</a></p>
      </div>
    </div>
  );
};

export default Login;
