"use client"

import { useState, useRef, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, BarChart3, LogOut } from "lucide-react"

export default function Header() {
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* Glowing Orb Background */}
      <div className="fixed top-0 left-0 w-full h-24 z-40 overflow-hidden pointer-events-none">
        <div className="absolute left-10 top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute right-10 top-4 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-purple-500/10 px-6 py-4">
        <div className="flex items-center justify-between w-full">

          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative p-1 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30">
              <img src="/LOGO.png.png" alt="Logo" className="h-10 w-10 rounded-full" />
              <div className="absolute inset-0 blur-2xl opacity-40 group-hover:opacity-60 transition" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-mono tracking-wider">
              Code Radar
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-6">
            {routes.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `relative font-medium transition-all duration-300 ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="group">
                    {name}
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <div className="flex items-center space-x-2 text-white bg-slate-800/40 px-3 py-2 rounded-xl border border-purple-500/20">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=random`
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-purple-500 shadow-md"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={logoutHandler}
                  className="text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Toggle */}
      <header className="md:hidden fixed top-0 right-0 z-50 p-6">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </header>

      {/* Mobile Side Panel */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Mobile Branding */}
          <div className="flex items-center space-x-3 mb-8">
            <img src="/LOGO.png.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono">
              Code Radar
            </span>
          </div>

          <nav className="space-y-4 mb-6">
            {routes.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-purple-500/20 text-white border border-purple-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
            {loggedIn ? (
              <>
                <div className="flex items-center space-x-3 bg-white/5 px-4 py-3 rounded-lg">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=random`
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-purple-500"
                  />
                  <div className="text-sm">
                    <p className="text-white font-medium">{user.fullName}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-300 hover:bg-purple-500/10"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
