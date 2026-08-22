import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>AI Interview Prep</h1>
        <div style={styles.headerRight}>
          <Link to="/practice" style={styles.practiceBtn}>
            Start Practice
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Attempts</p>
          <p style={styles.statValue}>{stats.total_attempts}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Average Score</p>
          <p style={styles.statValue}>{stats.average_score}%</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Highest Score</p>
          <p style={styles.statValue}>{stats.highest_score}%</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Current Streak</p>
          <p style={styles.statValue}>{stats.current_streak} 🔥</p>
        </div>
      </div>

      {/* Topics */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Strongest Topics</h2>
        {stats.strongest_topics.length === 0 ? (
          <p style={styles.empty}>No data yet — start practicing!</p>
        ) : (
          stats.strongest_topics.map((topic, i) => (
            <div key={i} style={styles.topicRow}>
              <span>{topic.topic_name}</span>
              <span style={styles.topicScore}>{topic.average_score}%</span>
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Weakest Topics</h2>
        {stats.weakest_topics.length === 0 ? (
          <p style={styles.empty}>No data yet — start practicing!</p>
        ) : (
          stats.weakest_topics.map((topic, i) => (
            <div key={i} style={styles.topicRow}>
              <span>{topic.topic_name}</span>
              <span style={{ color: "#ff4d4d" }}>{topic.average_score}%</span>
            </div>
          ))
        )}
      </div>

      {/* Recent Attempts */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Attempts</h2>
        {stats.recent_attempts.length === 0 ? (
          <p style={styles.empty}>No attempts yet — start practicing!</p>
        ) : (
          stats.recent_attempts.map((attempt, i) => (
            <div key={i} style={styles.attemptRow}>
              <p style={styles.attemptQuestion}>{attempt.question_text}</p>
              <div style={styles.attemptMeta}>
                <span style={styles.attemptScore}>{attempt.score}%</span>
                <span style={styles.attemptDate}>{attempt.created_at}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "#888",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
  },
  headerRight: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  practiceBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c63ff",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#888",
    border: "1px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#6c63ff",
  },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#ffffff",
  },
  empty: {
    color: "#888",
    fontSize: "14px",
  },
  topicRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #222",
    fontSize: "14px",
  },
  topicScore: {
    color: "#4caf50",
    fontWeight: "600",
  },
  attemptRow: {
    padding: "12px 0",
    borderBottom: "1px solid #222",
  },
  attemptQuestion: {
    fontSize: "14px",
    marginBottom: "6px",
  },
  attemptMeta: {
    display: "flex",
    justifyContent: "space-between",
  },
  attemptScore: {
    color: "#6c63ff",
    fontWeight: "600",
    fontSize: "14px",
  },
  attemptDate: {
    color: "#888",
    fontSize: "12px",
  },
};