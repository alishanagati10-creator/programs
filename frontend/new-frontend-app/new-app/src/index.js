import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Problems from "./components/Problems";
import Submit from "./components/Submit";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import Register from "./components/Register";

const root = ReactDOM.createRoot(document.getElementById("root"));

// 🔐 Simple Auth Check
const isLoggedIn = () => {
  return localStorage.getItem("user") !== null;
};

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

root.render(
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        <Route path="/problems" element={<Problems />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
