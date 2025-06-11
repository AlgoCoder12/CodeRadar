// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage({ setUser, setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const userData = { name, email };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loggedIn", true);
    setUser(userData);
    setLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isRegister ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegister && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {isRegister && (
          <Input type="password" placeholder="Confirm Password" required />
        )}
        <Button type="submit" className="w-full" size="lg">
          {isRegister ? "Register" : "Login"}
        </Button>
      </form>
      <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
