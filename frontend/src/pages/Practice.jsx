import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Practice() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("/topics/");
        setTopics(response.data);
        if (response.data.length > 0) {
          setSelectedTopic(response.data[0].id);
        }
      } catch (err) {
        setError("Failed to load topics.");
      }
    };
    fetchTopics();
  }, []);

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/questions/generate-question", {
        topic_id: parseInt(selectedTopic),
        difficulty: difficulty,
      });
      navigate("/question", { state: { question: response.data } });
    } catch (err) {
      setError("Failed to generate question. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Start Practice</h1>
        <p style={styles.subtitle}>Pick a topic and difficulty</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.field}>
          <label style={styles.label}>Topic</label>
          <select
            style={styles.select}
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Difficulty</label>
          <div style={styles.difficultyRow}>
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                style={{
                  ...styles.difficultyBtn,
                  ...(difficulty === level ? styles.difficultyActive : {}),
                }}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          style={styles.button}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating question..." : "Generate Question"}
        </button>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    marginTop: "-16px",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "14px",
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
  select: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#0f0f0f",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },
  difficultyRow: {
    display: "flex",
    gap: "12px",
  },
  difficultyBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "transparent",
    color: "#888",
    cursor: "pointer",
    fontSize: "14px",
  },
  difficultyActive: {
    backgroundColor: "#6c63ff",
    color: "#ffffff",
    border: "1px solid #6c63ff",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c63ff",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  backBtn: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "transparent",
    color: "#888",
    cursor: "pointer",
    fontSize: "14px",
  },
};