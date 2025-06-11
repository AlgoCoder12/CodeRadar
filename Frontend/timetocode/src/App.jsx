// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
// import ContestInfoPage from "./pages/ContestInfoPage"; // optional, if you made it

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage or default false
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  // Sync dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Sync login state and user to localStorage
  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
    if (!loggedIn) localStorage.removeItem("user");
  }, [loggedIn]);

  // On logout reset user
  useEffect(() => {
    if (!loggedIn) setUser(null);
  }, [loggedIn]);

  return (
    <Router>
      <Layout
        user={user}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage setUser={setUser} setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              loggedIn ? <DashboardPage user={user} /> : <Navigate to="/login" replace />
            }
          />
          {/* <Route
            path="/contestinfo"
            element={<ContestInfoPage />}
          /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
