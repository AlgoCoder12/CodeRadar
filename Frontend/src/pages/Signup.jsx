"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle } from "lucide-react"

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
    secondary:
      "bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 hover:border-purple-400/50",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const [error, setError] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [emailForOtp, setEmailForOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [formData, setFormData] = useState(null)

  const url = "http://localhost:8080"

  const create = async (data) => {
    setError("")
    setOtpError("")
    setOtpSuccess(false)
    setFormData(data)
    setEmailForOtp(data.email)

    try {
      await axios.post(`${url}/api/auth/request-otp`, { email: data.email })
      setShowOtp(true)
    } catch {
      setError("Failed to send OTP. Please try again.")
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setOtpError("")
    setOtpLoading(true)

    try {
      const res = await axios.post(`${url}/api/auth/validate-otp`, { email: emailForOtp, otp })
      if (res.data.valid) {
        setOtpSuccess(true)
        try {
          await signup(formData)
          setTimeout(() => navigate("/"), 1000)
        } catch {
          setOtpError("Account creation failed after OTP validation.")
        }
      } else {
        setOtpError("Invalid OTP")
      }
    } catch {
      setOtpError("OTP validation failed.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setOtpError("")
    try {
      await axios.post(`${url}/api/auth/request-otp`, { email: emailForOtp })
    } catch {
      setOtpError("Failed to resend OTP")
    } finally {
      setResendLoading(false)
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

      {/* Signup Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Signup Card - Compact Size */}
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

              <h2 className="text-lg font-bold text-white mb-1">{showOtp ? "Verify Your Email" : "Create Account"}</h2>
              <p className="text-gray-300 text-sm">
                {showOtp ? `Enter the OTP sent to ${emailForOtp}` : "Join thousands of developers"}
              </p>
            </div>

            {/* Error Alert - Compact */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-300 text-xs text-center">{error}</p>
              </div>
            )}

            {!showOtp ? (
              /* Signup Form */
              <form onSubmit={handleSubmit(create)} className="space-y-4">
                {/* Full Name Field */}
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={User}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                  })}
                  error={errors.fullName?.message}
                />

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
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  error={errors.password?.message}
                />

                {/* Send OTP Button */}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              /* OTP Verification Form */
              <div className="space-y-4">
                {/* OTP Success Message */}
                {otpSuccess && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-green-300 text-xs">
                      <CheckCircle className="h-4 w-4" />
                      <span>OTP Verified! Creating account...</span>
                    </div>
                  </div>
                )}

                {/* OTP Error */}
                {otpError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-xs text-center">{otpError}</p>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {/* OTP Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-white">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="w-full py-2 px-3 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300 text-center tracking-widest font-mono"
                    />
                  </div>

                  {/* Verify Button */}
                  <Button type="submit" disabled={otpLoading || otp.length !== 6}>
                    {otpLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify OTP & Create Account"
                    )}
                  </Button>
                </form>

                {/* Resend OTP */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-purple-400 hover:text-purple-300 text-xs transition-colors hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="text-gray-400 hover:text-white text-xs transition-colors hover:underline"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            )}

            {/* Sign In Link - Compact */}
            <div className="mt-4 text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-xs">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Features - Compact */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs mb-3">Start your coding journey today</p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>✨ Free Forever</span>
              <span>🚀 Instant Setup</span>
              <span>🔒 Secure</span>
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

export default Signup
