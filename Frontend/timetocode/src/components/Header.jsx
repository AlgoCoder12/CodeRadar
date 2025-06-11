// src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";


export default function Header({ user, loggedIn, setLoggedIn, darkMode, setDarkMode }) {
  return (
    <header className={`flex justify-between items-center px-8 py-4 shadow-md ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
      <Link to="/" className="text-3xl font-extrabold tracking-tight">
        TimeToCode
      </Link>
      <nav className="flex space-x-10 text-lg font-medium">
        {["Home", "Contest Info", "Dashboard", "About"].map((page) => (
          <NavLink
            key={page}
            to={`/${page.toLowerCase().replace(/\s+/g, "")}`}
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-500 transition"
            }
          >
            {page}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center space-x-6">
        {loggedIn ? (
          <>
            <span className="font-semibold">Hi, {user?.name ?? "User"}</span>
            <Button variant="destructive" onClick={() => {
              setLoggedIn(false);
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("user");
            }}>
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
