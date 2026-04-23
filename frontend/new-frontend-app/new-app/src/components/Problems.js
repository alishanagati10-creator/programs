import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔐 Check login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
    }
  }, [navigate]);

  // 🔹 Fetch problems
  useEffect(() => {
    fetch("http://localhost:8080/problems")
      .then((res) => res.json())
      .then((data) => {
        console.log("Problems:", data);

        // 🔥 If backend empty → fallback problems
        if (data.length === 0) {
          setProblems([
            { id: 1, title: "Two Sum", difficulty: "Easy" },
            { id: 2, title: "Reverse String", difficulty: "Easy" },
            { id: 3, title: "Longest Substring", difficulty: "Medium" },
            { id: 4, title: "Binary Search", difficulty: "Easy" },
            { id: 5, title: "Palindrome", difficulty: "Easy" },
            { id: 6, title: "Merge Intervals", difficulty: "Medium" },
            { id: 7, title: "Valid Parentheses", difficulty: "Medium" },
            { id: 8, title: "Climbing Stairs", difficulty: "Easy" },
          ]);
        } else {
          setProblems(data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load problems ❌");
        setLoading(false);
      });
  }, []);

  // 🔹 Solve button
  const handleSolve = (problemId) => {
    navigate("/submit", { state: { problemId } });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Problem List</h2>

      {/* 🔄 Loading */}
      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {problems.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <h3>{p.title}</h3>

              {p.description && <p>{p.description}</p>}

              <p>
                <b>Difficulty:</b> {p.difficulty}
              </p>

              <button onClick={() => handleSolve(p.id)}>Solve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Problems;
