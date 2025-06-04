import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import StudentNavbar from "./StudentNavbar";
import "./Feedback.css";

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!user || !feedback || rating <= 0) return;

    await addDoc(collection(db, "resume_feedback"), {
      uid: user.uid,
      email: user.email,
      feedback,
      rating,
      timestamp: serverTimestamp(),
    });

    setFeedback("");
    setRating(0);
    alert("Feedback submitted successfully.");
  };

  return (
    <div className="feedback-page">
      <StudentNavbar />
      <div className="feedback-container">
        <h2>Student Feedback</h2>
        <textarea
          className="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience"
        />
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={rating >= num ? "filled-star" : "empty-star"}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>
        <button className="submit-feedback-btn" onClick={handleFeedbackSubmit}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

export default Feedback;
