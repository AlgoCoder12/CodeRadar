"use client"

import { useState, useRef, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, Sun, Moon, User, LogOut , BarChart3 } from "lucide-react"

export default function Header({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const loggedIn = !!user

  const routes = [
    { name: "Home", to: "/" },
    { name: "Contest Info", to: "/contestinfo" },
    { name: "POTD", to: "/potd" },
    { name: "Time Table", to: "/timetable" },
  ]

  const logoutHandler = async () => {
    try {
      await logout()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error("Logout error:", error.message || error)
    }
  }

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* Fixed Header - Minimal Design */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <div className="flex items-center justify-end">
          {/* Burger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-60 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Menu Header with better spacing */}
          <div className="mb-8 pt-4">
            <div className="flex items-center space-x-3 mb-3">
              <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-10 w-auto" />
              <span className="tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono font-bold text-lg">
                Code Radar
              </span>
            </div>
            <p className="text-gray-400 text-sm ml-1">Your Complete Coding Companion</p>
          </div>

          {/* Navigation Links with improved spacing */}
          <nav className="flex-1 space-y-1">
            {routes.map(({ name, to }, index) => (
              <NavLink
                key={name}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="group block"
                style={{
                  opacity: 0,
                  transform: "translateX(20px)",
                  animation: mobileMenuOpen ? `slideInRight 0.4s ease-out ${index * 0.1}s forwards` : "none",
                }}
              >
                {({ isActive }) => (
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive ? "bg-purple-400" : "bg-gray-600 group-hover:bg-purple-400"
                      }`}
                    />
                    <span className="font-medium">{name}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section with better spacing */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            {/* Dark Mode Toggle */}
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button> */}

            {loggedIn ? (
              <>
                {/* User Profile with better spacing */}
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/5 my-3">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName) || "/placeholder.svg"}&background=random`
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{user.fullName}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>

                {/* Profile & Logout with better spacing */}
                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">DashBoard</span>
                </button>

                <button
                  onClick={logoutHandler}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 bg-transparent font-medium py-3 rounded-lg"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop with proper z-index and removal */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            opacity: mobileMenuOpen ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
