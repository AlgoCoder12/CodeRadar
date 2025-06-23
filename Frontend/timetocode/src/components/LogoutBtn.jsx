import React from "react";
import authservice from "../service/appwrite/auth"; // adjust if path differs
import { useNavigate } from "react-router-dom";

const LogoutBtn = ({ className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authservice.deleteSessions("current");
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err.message || err);
    } finally {
      navigate("/login"); // Redirect no matter what
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
};

export default LogoutBtn;
