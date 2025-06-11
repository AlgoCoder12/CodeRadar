// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Sidebar({ darkMode, setDarkMode }) {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contest Info", path: "/contestinfo" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
  ];

  return (
    <aside className="h-screen fixed left-0 top-0 bg-gray-100 dark:bg-gray-900 w-60 p-5 hidden md:flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold mb-8">Time To Code 🚀</div>
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-lg font-medium hover:text-blue-500 ${
                  isActive ? "text-blue-600 underline" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
      </div>
    </aside>
  );
}
