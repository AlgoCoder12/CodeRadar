// src/components/Header.jsx
import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import authservice from "../service/appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/authSlice";

export default function Header({ darkMode, setDarkMode }) {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth) || {};
const { user, loggedIn } = authState;

  const routes = [
    { name: "Home", to: "/" },
    { name: "Contest Info", to: "/contestinfo" },
    { name: "POTD", to: "/potd" },
    { name: "Dashboard", to: "/dashboard" },
  ];

  // Sync Appwrite session with redux on mount
  useEffect(() => {
    const syncUser = async () => {
      const currentUser = await authservice.getCurrentUser();
      if (currentUser) {
        dispatch(login(currentUser));
      } else {
        dispatch(logout());
      }
    };
    syncUser();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      await authservice.logout();
    } catch (error) {
      // Ignored as handled in service
      console.error("Logout error:", error.message || error);
    } finally {
      dispatch(logout());
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex justify-between items-center px-6 sm:px-12 py-3 shadow-md ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/LOGO.png.png"
          alt="CodeRadar Logo"
          className="h-12 w-auto scale-110"
        />
<span className="tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 font-mono font-extrabold">
  Code Radar
</span>








      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-3">
        {routes.map(({ name, to }) => (
          <NavLink key={name} to={to} className="group">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`transition ${
                  darkMode
                    ? isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {name}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center space-x-3">
        {loggedIn && user ? (
          <>
            <span className="hidden sm:block font-medium">Hi, {user.name}</span>
            <button
              className="inline-block px-6 py-2 duration-200 bg-blue-500 hover:bg-blue-700 rounded-full text-white"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}

        {/* Dark Mode Toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
