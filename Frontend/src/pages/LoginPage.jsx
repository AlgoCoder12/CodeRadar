"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"

// Custom Input Component
function Input({ label, error, icon: Icon, type = "text", showPasswordToggle, onTogglePassword, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-white">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          type={type}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} ${showPasswordToggle ? "pr-8" : "pr-3"} py-2 text-sm bg-white/10 border ${
            error ? "border-red-500" : "border-white/20"
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {type === "password" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// Custom Button Component
function Button({ children, variant = "primary", disabled, ...props }) {
  const baseClasses =
    "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]",
    outline: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm",
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const [error, setError] = useState("")

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background - Same as Home Page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Login Card - Compact Size */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
            {/* Logo Section - Compact */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2.5 border border-white/20">
                    <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-8 w-auto" />
                  </div>
                </div>
              </div>

              {/* Brand Name - Compact */}
              <div className="flex items-center justify-center space-x-1.5 mb-3">
                <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  CodeRadar
                </span>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>

              <h2 className="text-lg font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-300 text-sm">Sign in to continue</p>
            </div>

            {/* Error Alert - Compact */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-300 text-xs text-center">{error}</p>
              </div>
            )}

            {/* Login Form - Compact */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Forgot Password Link - Compact */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
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

              {/* Divider - Compact */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-r from-slate-900/80 to-purple-900/80 px-3 text-gray-400 backdrop-blur-sm">
                    Or 
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button type="button" onClick={handleGoogleLogin} variant="outline">
                <div className="flex items-center justify-center space-x-2">
                  <FcGoogle className="w-4 h-4" />
                  <span>Continue with Google</span>
                </div>
              </Button>
            </form>

            {/* Sign Up Link - Compact */}
            <div className="mt-4 text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-xs">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Features - Compact */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs mb-3">Join thousands of developers</p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>✨ Contests</span>
              <span>🧠 Problems</span>
              <span>📚 Planning</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage
