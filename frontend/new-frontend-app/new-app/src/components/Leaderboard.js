
import { useEffect, useState } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/submissions/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        console.log("Leaderboard:", data);
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "white" }}>
      <h2>🏆 Leaderboard</h2>

      {users.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u, index) => (
            <li
              key={index}
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid white",
                borderRadius: "8px"
              }}
            >
              {index + 1}. {u.username} - Score: {u.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Leaderboard;