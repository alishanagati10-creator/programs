import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      {/* 🔥 Navbar */}
      <nav className="navbar">
        <h2 className="logo">💻 CodePlatform</h2>

        <div className="nav-links">
          <Link to="/problems">Problems</Link>

          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      {/* 🔥 Page Content */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
