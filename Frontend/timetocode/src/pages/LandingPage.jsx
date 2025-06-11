// src/pages/LandingPage.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="max-w-3xl mx-auto text-center">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Welcome to TimeToCode 🚀</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Register on all known coding platforms from one place.
        Get contest reminders via email & SMS.
        Track your contest attendance monthly with your personal dashboard.
      </p>
      <Link to="/login">
        <Button size="lg" className="px-8 py-4 font-semibold">
          Get Started
        </Button>
      </Link>
    </section>
  );
}
