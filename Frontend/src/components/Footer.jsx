// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 text-center py-6 text-sm text-gray-500 dark:text-gray-400">
      &copy; {new Date().getFullYear()} CodeRadar. All rights reserved.
    </footer>
  );
}
