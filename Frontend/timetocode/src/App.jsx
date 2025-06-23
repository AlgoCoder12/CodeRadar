import authservice from "./service/appwrite/auth"; // Ensure this is correctly imported
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContestInfo from "./pages/ContestInfo";
import ContestPlatformPage from "./pages/ContestPlatformPage";
import POTD from "./pages/POTD";
import Signup from "./pages/SignUp";
export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ new

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authservice.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setLoggedIn(true);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        setLoggedIn(false);
      } finally {
        setLoading(false); // ✅ auth is initialized
      }
    };
    loadUser();
  }, []);

  // Sync dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (!loggedIn) {
      localStorage.removeItem("user");
    }
  }, [loggedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

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
          {/* <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage setUser={setUser} setLoggedIn={setLoggedIn} />
              )
            }
          /> */}
          <Route
            path="/dashboard"
            element={
              loggedIn ? <DashboardPage user={user} /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/contestinfo" element={<ContestInfo />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contestinfo/:platform" element={<ContestPlatformPage />} />
          <Route path="/potd" element={<POTD />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
