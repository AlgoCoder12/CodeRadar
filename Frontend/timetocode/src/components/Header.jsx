import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header({
  user,
  loggedIn,
  setLoggedIn,
  darkMode,
  setDarkMode,
}) {
  return (
    <header
      className={`sticky top-0 z-50 flex justify-between items-center px-6 sm:px-12 py-3 ${
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
        <span className="text-xl font-bold tracking-tight hidden sm:inline">
          CodeRadar
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6 text-base font-medium">
        {["Home", "Contest Info", "Dashboard", "About"].map((page) => (
          <NavLink
            key={page}
            to={`/${page.toLowerCase().replace(/\s+/g, "")}`}
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                : "hover:text-purple-500 transition"
            }
          >
            {page}
          </NavLink>
        ))}
      </nav>

      {/* Right section: User + Dark mode */}
      <div className="flex items-center space-x-4">
        {loggedIn ? (
          <>
            <span className="hidden sm:block font-medium">
              Hi, {user?.name ?? "User"}
            </span>
            <Button
              variant="destructive"
              className="px-4 py-1 text-sm"
              onClick={() => {
                setLoggedIn(false);
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("user");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button className="px-4 py-1 text-sm">Login</Button>
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
