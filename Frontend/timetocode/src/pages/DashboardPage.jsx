// src/pages/DashboardPage.jsx
import React from "react";

export default function DashboardPage({ user }) {
  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.name}!</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Here's your contest attendance overview:
      </p>

      {/* TODO: Add contests list with attend/skipped labels and links */}
      <div className="space-y-4">
        {/* Example item */}
        <div className="p-4 border rounded flex justify-between items-center dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">Codeforces Round #1234</h2>
            <a
              href="https://codeforces.com/contest/1234"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Contest Link
            </a>
          </div>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Attended
          </span>
        </div>

        {/* Add more contests similarly */}
      </div>
    </section>
  );
}
