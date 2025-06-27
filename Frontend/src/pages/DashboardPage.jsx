import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const allContests = [
  {
    name: "Codeforces Round #1234",
    platform: "Codeforces",
    link: "https://codeforces.com/contest/1234",
    status: "attended",
  },
  {
    name: "LeetCode Weekly Contest 321",
    platform: "LeetCode",
    link: "https://leetcode.com/contest/weekly-contest-321",
    status: "missed",
  },
  {
    name: "CodeChef Starters 105",
    platform: "CodeChef",
    link: "https://www.codechef.com/START105",
    status: "attended",
  },
  // Add more contest entries here...
];

export default function DashboardPage({ user }) {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [showAttended, setShowAttended] = useState(true);
  const [showMissed, setShowMissed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 4;

  const platforms = ["All", ...new Set(allContests.map((c) => c.platform))];

  const filteredContests = allContests.filter((contest) => {
    const matchPlatform =
      selectedPlatform === "All" || contest.platform === selectedPlatform;
    const matchStatus =
      (showAttended && contest.status === "attended") ||
      (showMissed && contest.status === "missed");
    return matchPlatform && matchStatus;
  });

  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);
  const paginatedContests = filteredContests.slice(
    (currentPage - 1) * contestsPerPage,
    currentPage * contestsPerPage
  );

  const chartData = platforms
    .filter((p) => p !== "All")
    .map((platform) => {
      const attended = allContests.filter(
        (c) => c.platform === platform && c.status === "attended"
      ).length;
      const missed = allContests.filter(
        (c) => c.platform === platform && c.status === "missed"
      ).length;
      return { platform, attended, missed };
    });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        Welcome back, {user?.name}!
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="text-sm font-medium">
          Platform:{" "}
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setCurrentPage(1);
            }}
            className="ml-2 border dark:bg-gray-800 border-gray-300 rounded px-2 py-1"
          >
            {platforms.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          <input
            type="checkbox"
            checked={showAttended}
            onChange={() => setShowAttended(!showAttended)}
            className="mr-1"
          />
          Attended
        </label>

        <label className="text-sm font-medium">
          <input
            type="checkbox"
            checked={showMissed}
            onChange={() => setShowMissed(!showMissed)}
            className="mr-1"
          />
          Missed
        </label>
      </div>

      {/* Chart */}
      <div className="mb-10 bg-white dark:bg-gray-900 p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Contest Summary
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attended" fill="#4ade80" />
            <Bar dataKey="missed" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Contest List */}
      <div className="space-y-4">
        {paginatedContests.map((contest, i) => (
          <motion.div
            key={contest.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 border rounded flex justify-between items-center dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{contest.name}</h2>
              <a
                href={contest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contest Link
              </a>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                contest.status === "attended"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {contest.status.charAt(0).toUpperCase() +
                contest.status.slice(1)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                currentPage === idx + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
