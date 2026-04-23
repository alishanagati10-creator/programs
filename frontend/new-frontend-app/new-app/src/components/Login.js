import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // make sure styles are loaded

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/users");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();

      const user = data.find(
        (u) => u.username === username && u.password === password,
      );

      if (user) {
        alert("Login successful ✅");
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/problems");
      } else {
        alert("Invalid credentials ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Backend not running ❌");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="left">
          <h1>💻 CodePlatform</h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h2>Welcome Back 👋</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button onClick={handleLogin}>Login</button>

          <p className="register-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
