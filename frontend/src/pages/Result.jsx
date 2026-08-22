import { useNavigate, useLocation } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.attempt;
  const question = location.state?.question;

  if (!attempt || !question) {
    navigate("/practice");
    return null;
  }

  const strengths = JSON.parse(attempt.strengths || "[]");
  const improvements = JSON.parse(attempt.improvements || "[]");

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#ff4d4d";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Great Answer!";
    if (score >= 60) return "Good Effort!";
    return "Keep Practicing!";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Score */}
        <div style={styles.scoreSection}>
          <div style={{
            ...styles.scoreCircle,
            borderColor: getScoreColor(attempt.score)
          }}>
            <span style={{
              ...styles.scoreNumber,
              color: getScoreColor(attempt.score)
            }}>
              {attempt.score}
            </span>
            <span style={styles.scoreMax}>/100</span>
          </div>
          <p style={{
            ...styles.scoreLabel,
            color: getScoreColor(attempt.score)
          }}>
            {getScoreLabel(attempt.score)}
          </p>
        </div>

        {/* Question */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Question</p>
          <p style={styles.questionText}>{question.question_text}</p>
        </div>

        {/* Feedback */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>Feedback</p>
          <p style={styles.feedbackText}>{attempt.feedback}</p>
        </div>

        {/* Strengths */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>✅ Strengths</p>
          {strengths.map((s, i) => (
            <div key={i} style={styles.listItem}>
              <span style={styles.dot}>•</span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Improvements */}
        <div style={styles.section}>
          <p style={styles.sectionTitle}>📈 Areas to Improve</p>
          {improvements.map((imp, i) => (
            <div key={i} style={styles.listItem}>
              <span style={styles.dot}>•</span>
              <span>{imp}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/practice")}
          >
            Practice Again
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>

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
  scoreSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "20px 0",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  scoreNumber: {
    fontSize: "40px",
    fontWeight: "700",
    lineHeight: "1",
  },
  scoreMax: {
    fontSize: "14px",
    color: "#888",
  },
  scoreLabel: {
    fontSize: "18px",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#0f0f0f",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6c63ff",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  questionText: {
    fontSize: "15px",
    color: "#ccc",
    lineHeight: "1.6",
  },
  feedbackText: {
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.7",
  },
  listItem: {
    display: "flex",
    gap: "8px",
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.6",
  },
  dot: {
    color: "#6c63ff",
    flexShrink: 0,
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c63ff",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "transparent",
    color: "#888",
    fontSize: "15px",
    cursor: "pointer",
  },
};
