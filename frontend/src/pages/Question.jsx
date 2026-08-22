import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Question() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const question = location.state?.question;

  if (!question) {
    navigate("/practice");
    return null;
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/attempts/", {
        question_id: question.id,
        user_answer: answer,
      });
      navigate("/result", { state: { attempt: response.data, question } });
    } catch (err) {
      setError("Failed to submit answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const hints = question.hints ? JSON.parse(question.hints) : [];

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>
            {question.difficulty.toUpperCase()}
          </span>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/practice")}
          >
            ← Back
          </button>
        </div>

        {/* Question */}
        <div style={styles.questionBox}>
          <h2 style={styles.questionText}>{question.question_text}</h2>
        </div>

        {/* Hints */}
        {hints.length > 0 && (
          <div style={styles.hintsBox}>
            <p style={styles.hintsTitle}>💡 Hints</p>
            {hints.map((hint, i) => (
              <p key={i} style={styles.hint}>• {hint}</p>
            ))}
          </div>
        )}

        {/* Answer */}
        <div style={styles.field}>
          <label style={styles.label}>Your Answer</label>
          <textarea
            style={styles.textarea}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Scoring your answer..." : "Submit Answer"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "700px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    backgroundColor: "#6c63ff22",
    color: "#6c63ff",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: "14px",
  },
  questionBox: {
    backgroundColor: "#0f0f0f",
    padding: "24px",
    borderRadius: "8px",
    borderLeft: "4px solid #6c63ff",
  },
  questionText: {
    fontSize: "18px",
    fontWeight: "500",
    lineHeight: "1.6",
    color: "#ffffff",
  },
  hintsBox: {
    backgroundColor: "#1f1f2e",
    padding: "16px 20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  hintsTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6c63ff",
    marginBottom: "4px",
  },
  hint: {
    fontSize: "13px",
    color: "#aaa",
    lineHeight: "1.5",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#888",
  },
  textarea: {
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#0f0f0f",
    color: "#ffffff",
    fontSize: "14px",
    lineHeight: "1.6",
    outline: "none",
    resize: "vertical",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "14px",
  },
  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c63ff",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

