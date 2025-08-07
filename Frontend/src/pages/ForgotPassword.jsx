"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Mail, Lock, Sparkles, KeyRound } from "lucide-react"

function Input({ label, error, icon: Icon, type = "text", ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-white">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          type={type}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2 text-sm bg-white/10 border ${
            error ? "border-red-500" : "border-white/20"
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function Button({ children, variant = "primary", disabled, ...props }) {
  const base =
    "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]",
    outline: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm",
  }

  return (
    <button className={`${base} ${variants[variant]}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [serverMessage, setServerMessage] = useState("")
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const handleRequestOTP = async (data) => {
    setError("")
    setServerMessage("")
    try {
      // Step 1: Send OTP to user's email
      setEmail(data.email)

      // TODO: Replace with your actual API call
      console.log("Sending OTP to:", data.email)

      setServerMessage("OTP has been sent to your email.")
      setStep(2)
      reset()
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    }
  }

  const handleResetPassword = async (data) => {
    setError("")
    setServerMessage("")
    try {
      // Step 2: Verify OTP and reset password
      const payload = {
        email,
        otp: data.otp,
        newPassword: data.password,
      }

      // TODO: Replace with actual API call
      console.log("Resetting password with OTP:", payload)

      setServerMessage("Password has been successfully reset.")
      reset()
      setStep(1)
    } catch (err) {
      setError("Invalid OTP or something went wrong.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
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

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2.5 border border-white/20">
                    <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-8 w-auto" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-1.5 mb-3">
                <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  CodeRadar
                </span>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Forgot Password</h2>
              <p className="text-gray-300 text-sm">
                {step === 1 ? "We’ll send you an OTP to reset your password." : "Enter the OTP and your new password."}
              </p>
            </div>

            {serverMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-300 text-xs text-center">{serverMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-300 text-xs text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(step === 1 ? handleRequestOTP : handleResetPassword)} className="space-y-4">
              {step === 1 ? (
                <>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your registered email"
                    icon={Mail}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: "Enter a valid email",
                      },
                    })}
                    error={errors.email?.message}
                  />
                </>
              ) : (
                <>
                  <Input
                    label="OTP"
                    type="text"
                    placeholder="Enter OTP"
                    icon={KeyRound}
                    {...register("otp", { required: "OTP is required" })}
                    error={errors.otp?.message}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    icon={Lock}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={errors.password?.message}
                  />
                </>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{step === 1 ? "Sending OTP..." : "Resetting..."}</span>
                  </div>
                ) : step === 1 ? (
                  "Send OTP"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-xs">
                Back to{" "}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                >
                  Sign In
                </Link>
              </p>
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

export default ForgotPassword
