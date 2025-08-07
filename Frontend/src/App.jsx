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
import { useAuth } from "./contexts/AuthContext";
import UserIdCheckPage from "./pages/UserIdCheckPage";
import TimeTable from "./pages/TimeTable"
import ForgotPassword from "./pages/ForgotPassword";


export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });

  const {user, loading} = useAuth();
  // console.log(user, loading)

  // Load user on mount
  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const currentUser = await authservice.getCurrentUser();
  //       if (currentUser) {
  //         setUser(currentUser);
  //         setLoggedIn(true);
  //         localStorage.setItem("loggedIn", "true");
  //         localStorage.setItem("user", JSON.stringify(currentUser));
  //       } else {
  //         setLoggedIn(false);
  //       }
  //     } catch (err) {
  //       setLoggedIn(false);
  //     } finally {
  //       setLoading(false); // ✅ auth is initialized
  //     }
  //   };
  //   loadUser();
  // }, []);

  // Sync dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("user");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Layout
        user={user}
        loggedIn={!!user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route
            path="/dashboard"
            element={
              user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />
            }
          /> */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Signup />
            }
          />
          <Route path="/contestinfo" element={<ContestInfo />} />
          <Route path="/contest-info/:platform" element={<ContestPlatformPage />} />
          <Route path="/contest-check/:platform" element={<UserIdCheckPage />} />
          <Route path="/potd" element={<POTD />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/timetable" element={<TimeTable/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
        </Routes>
      </Layout>
    </div>
  );
}
