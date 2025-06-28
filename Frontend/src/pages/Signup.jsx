import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Simple Input and Button components for demo (replace with your UI components)
function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className={`w-full rounded-md border px-3 py-2 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Signup() {
  const navigate = useNavigate();

  const {signup} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const url = "http://localhost:8080";

  const create = async (data) => {
    setError("");
    setOtpError("");
    setOtpSuccess(false);
    setFormData(data);
    setEmailForOtp(data.email);
    
    try {
      // First, request OTP
      await axios.post(`${url}/api/auth/request-otp`, { email: data.email });
      setShowOtp(true);
    } catch {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);
    try {
      const res = await axios.post(`${url}/api/auth/validate-otp`, { email: emailForOtp, otp });
      if (res.data.valid) {
        setOtpSuccess(true);
        // Now create the account after OTP validation
        try {
          await signup(formData);
          setTimeout(() => navigate("/"), 1000);
        } catch {
          setOtpError("Account creation failed after OTP validation.");
        }
      } else {
        setOtpError("Invalid OTP");
      }
    } catch {
      setOtpError("OTP validation failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");
    try {
      await axios.post(`${url}/api/auth/request-otp`, { email: emailForOtp });
    } catch {
      setOtpError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-gray-700 shadow-md">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            {/* Replace with your actual Logo component or img */}
            <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-12 w-auto scale-110" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {error && <p className="text-red-600 mt-6 text-center font-medium">{error}</p>}

        {!showOtp ? (
          <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
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
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              error={errors.password?.message}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                label="Enter OTP sent to your email"
                placeholder="6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                error={otpError}
              />
              <Button type="submit" disabled={otpLoading || otp.length !== 6} className="w-full">
                {otpLoading ? "Verifying..." : "Verify OTP & Create Account"}
              </Button>
            </form>
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
              {otpSuccess && <span className="text-green-600 text-sm">OTP Verified! Creating account...</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
