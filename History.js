import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import StudentNavbar from "./StudentNavbar";
import { jsPDF } from "jspdf";
import "chart.js/auto";
import "./History.css";
import { Bar } from "react-chartjs-2";
import { FaMoon, FaSun, FaFilePdf, FaFilter } from "react-icons/fa";

const SuggestionsModal = ({ suggestions, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Full Suggestions</h2>
      <ul>
        {suggestions.map((s, index) => (
          <li key={index}>{s}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const History = () => {
  const [user] = useAuthState(auth);
  const [atsHistory, setATSHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [scoreFilter, setScoreFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedItems, setExpandedItems] = useState({});

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (user) fetchATSHistory();
  }, [user]);

  const fetchATSHistory = async () => {
    try {
      const q = query(collection(db, "resume_results"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        score: doc.data().score,
        suggestions: doc.data().suggestions || [],
        timestamp: doc.data().timestamp,
        fileName: doc.data().fileName || "Unknown file",
      }));
      setATSHistory(data);
      setFilteredHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setScoreFilter(selected);
    setCurrentPage(1);

    let filtered = atsHistory;
    if (selected === "above80") filtered = atsHistory.filter((entry) => entry.score >= 80);
    else if (selected === "above60") filtered = atsHistory.filter((entry) => entry.score >= 60 && entry.score < 80);
    else if (selected === "below60") filtered = atsHistory.filter((entry) => entry.score < 60);

    setFilteredHistory(filtered);
  };

  const handleBarClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const suggestions = filteredHistory[index].suggestions;
      setCurrentSuggestions(suggestions);
      setIsModalOpen(true);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return "Unknown";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);

    filteredHistory.forEach((entry, idx) => {
      const yOffset = 10 + idx * 50;
      if (yOffset > 270) doc.addPage();
      doc.text(`Record #${idx + 1}`, 10, yOffset);
      doc.text(`File: ${entry.fileName}`, 10, yOffset + 10);
      doc.text(`Score: ${entry.score}%`, 10, yOffset + 20);
      doc.text(`Date: ${formatTimestamp(entry.timestamp)}`, 10, yOffset + 30);
    });

    doc.save("ATS_History.pdf");
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedData = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const chartData = {
    labels: filteredHistory.map((entry) =>
      `${entry.fileName} (${formatTimestamp(entry.timestamp).split(",")[0]})`
    ),
    datasets: [
      {
        label: "ATS Score",
        data: filteredHistory.map((entry) => entry.score),
        backgroundColor: "rgba(76, 175, 80, 0.6)",
        borderColor: "rgba(76, 175, 80, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`history-container ${darkMode ? "dark" : ""}`}>
      <StudentNavbar />
      <div className="history-content">
        <div className="header-bar">
          <h1>ATS Resume History</h1>
          <div className="theme-actions">
            <button className="btn-pdf" onClick={() => setDarkMode((prev) => !prev)} title="Toggle Theme">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="btn-pdf" onClick={exportPDF} title="Download PDF">
              <FaFilePdf style={{ marginRight: "5px" }} /> Download PDF
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <label>
            <FaFilter style={{ marginRight: "5px" }} />
            Filter by Score:
            <select value={scoreFilter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="above80">80% and above</option>
              <option value="above60">60%-79%</option>
              <option value="below60">Below 60%</option>
            </select>
          </label>
        </div>

        <div className="chart-section">
          {filteredHistory.length > 0 ? (
            <Bar data={chartData} options={{ onClick: handleBarClick }} />
          ) : (
            <p>No history to display.</p>
          )}
        </div>

        {paginatedData.map((entry) => (
  <div className="record-card" key={entry.id}>
    <p className="file-name"><strong>File:</strong> {entry.fileName}</p>
    <p className="score"><strong>Score:</strong> {entry.score}%</p>
    <p className="timestamp"><strong>Date:</strong> {formatTimestamp(entry.timestamp)}</p>

    <div className="suggestions">
      <ul>
        {(expandedItems[entry.id] ? entry.suggestions : entry.suggestions.slice(0, 2)).map((suggestion, i) => (
          <li key={i}>{suggestion}</li>
        ))}
      </ul>

      {entry.suggestions.length > 2 && (
        <button
          className="btn-pdf"
          onClick={() => toggleExpand(entry.id)}
          style={{ marginTop: "1rem" }}
        >
          {expandedItems[entry.id] ? "View Less" : "View More"}
        </button>
      )}
    </div>
  </div>
))}


        {filteredHistory.length > itemsPerPage && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <SuggestionsModal
            suggestions={currentSuggestions}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default History;
