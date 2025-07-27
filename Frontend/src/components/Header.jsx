import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loggedIn = !!user;

  const routes = [
    { name: "Home", to: "/" },
    { name: "Contest Info", to: "/contestinfo" },
    { name: "POTD", to: "/potd" },
    //{ name: "Dashboard", to: "/dashboard" },
    { name: "Time Table", to: "/timetable" },
  ];

  const logoutHandler = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error.message || error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex justify-between items-center px-4 sm:px-8 py-3 shadow-md ${
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

      {/* Desktop Nav */}
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
      <div className="hidden md:flex items-center space-x-4 relative">
        {/* Dark Mode Toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {loggedIn ? (
          <div ref={profileRef} className="relative">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
              alt="Profile"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-10 w-10 rounded-full cursor-pointer object-cover border-2 border-blue-500"
            />
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
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
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl p-2 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`absolute top-full left-0 w-full px-6 py-4 flex flex-col gap-3 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          } md:hidden`}
        >
          {routes.map(({ name, to }) => (
            <NavLink
              key={name}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="ghost" className="w-full text-left">
                {name}
              </Button>
            </NavLink>
          ))}

          {loggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-green-500">Profile</Button>
              </Link>
              <button
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-full text-white"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutHandler();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 text-white">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
