import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const navigate = useNavigate();

  // 🔐 Protect admin page
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
    }
  }, [navigate]);

  const handleAddProblem = async () => {
    // 🔴 Validation
    if (!title || !description || !difficulty) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
        }),
      });

      if (res.ok) {
        alert("Problem added successfully ✅");

        // clear fields
        setTitle("");
        setDescription("");
        setDifficulty("Easy");
      } else {
        alert("Failed to add problem ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Backend error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Admin Panel</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Problem Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      {/* Description */}
      <textarea
        placeholder="Problem Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      {/* Difficulty Dropdown */}
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <br /><br />

      <button onClick={handleAddProblem}>
        Add Problem
      </button>
    </div>
  );
}

export default Admin;