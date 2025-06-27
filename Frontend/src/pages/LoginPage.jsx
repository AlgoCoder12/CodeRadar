import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

// Replace Input and Button below with your UI components or basic HTML inputs/buttons
// For example purpose, I'll use simple inputs and buttons here:

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

function LoginPage() {
  const navigate = useNavigate();
  
  const {user, login} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      // Call login on authService, passing { email, password }
      await login(data);
      // After successful login, get current user info
      if (user) {
        navigate("/");
      } else {
        setError("Failed to retrieve user data after login.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-gray-700 shadow-md">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <img
              src="/LOGO.png.png"
              alt="CodeRadar Logo"
              className="h-12 w-auto scale-110"
            />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-6 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
