"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"

// Input Component
function Input({ label, error, icon: Icon, type = "text", showPasswordToggle, onTogglePassword, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-white">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          type={type}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} ${showPasswordToggle ? "pr-9" : "pr-3"} py-2 text-sm bg-white/10 border ${
            error ? "border-red-500" : "border-white/20"
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 backdrop-blur-sm transition-all`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {type === "password" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// Button Component
function Button({ children, variant = "primary", disabled, ...props }) {
  const baseClasses =
    "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:scale-105 text-white shadow-lg hover:shadow-purple-500/25",
    outline:
      "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  const onSubmit = async (data) => {
    setError("")
    try {
      await login(data)
      if (user) {
        navigate("/")
      } else {
        setError("Failed to retrieve user data after login.")
      }
    } catch (err) {
      setError(err.message || "Login failed.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/20 animate-glow pointer-events-none" />
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10 space-y-6 animate-fade-in">
            {/* Logo */}
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-30" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2.5 border border-white/20">
                    <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-8 w-auto" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-1.5">
                <h2 className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  CodeRadar
                </h2>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-sm text-gray-300 mt-1">Welcome Back. Sign in to continue.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email address must be valid",
                  },
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={Lock}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#1a1a2e] px-3 text-gray-400">or</span>
                </div>
              </div>

              <Button type="button" onClick={handleGoogleLogin} variant="outline">
                <div className="flex items-center justify-center space-x-2">
                  <FcGoogle className="w-4 h-4" />
                  <span>Continue with Google</span>
                </div>
              </Button>
            </form>

            <div className="pt-4 text-center border-t border-white/10">
              <p className="text-xs text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6 space-x-4">
            <span>✨ Contests</span>
            <span>🧠 Problems</span>
            <span>📚 Planning</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 0px rgba(165, 105, 189, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(165, 105, 189, 0.5);
          }
        }
        .animate-glow {
          animation: glow 3s infinite ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default LoginPage
