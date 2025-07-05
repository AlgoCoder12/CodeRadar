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
  // Add more contests here...
];

export default function DashboardPage({ user }) {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 4;

  const platforms = ["All", ...new Set(allContests.map((c) => c.platform))];

  // Stats
  const totalAttended = allContests.filter((c) => c.status === "attended").length;
  const totalMissed = allContests.filter((c) => c.status === "missed").length;

  // Chart data
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

  // Filter & search
  const filteredContests = allContests.filter((contest) => {
    const matchPlatform =
      selectedPlatform === "All" || contest.platform === selectedPlatform;
    const matchSearch = contest.name.toLowerCase().includes(searchText.toLowerCase());
    return matchPlatform && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);
  const paginatedContests = filteredContests.slice(
    (currentPage - 1) * contestsPerPage,
    currentPage * contestsPerPage
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-600">
        Welcome back, {user?.name}!
      </h1>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Contests</p>
          <p className="text-2xl font-bold">{allContests.length}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow text-center">
          <p className="text-sm text-green-800 dark:text-green-200">Attended</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {totalAttended}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded shadow text-center">
          <p className="text-sm text-red-800 dark:text-red-200">Missed</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {totalMissed}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Contest Summary</h2>
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

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <select
          value={selectedPlatform}
          onChange={(e) => {
            setSelectedPlatform(e.target.value);
            setCurrentPage(1);
          }}
          className="border dark:bg-gray-800 border-gray-300 rounded px-2 py-1"
        >
          {platforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search contests..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="border dark:bg-gray-800 border-gray-300 rounded px-2 py-1 w-full md:w-1/2"
        />
      </div>

      {/* Contest List */}
      <div className="space-y-4">
        {paginatedContests.length === 0 ? (
          <p className="text-gray-500">No contests found.</p>
        ) : (
          paginatedContests.map((contest, i) => (
            <motion.div
              key={contest.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 border rounded flex justify-between items-center dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{contest.name}</h2>
                <a
                  href={contest.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  View Contest
                </a>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  contest.status === "attended"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
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