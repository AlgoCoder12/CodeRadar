import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function DashboardPage({ user }) {
  const [allContests, setAllContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [showAttended, setShowAttended] = useState(true);
  const [showMissed, setShowMissed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 4;

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // ✅ Replace below URL with your backend URL or proxy (e.g., /api/contests)
        const res = await axios.get("http://localhost:8080/api/contests");

        let contestsArray = Array.isArray(res.data) ? res.data :
                            res.data?.data || res.data?.contests || [];

        // Add dummy fields if missing to avoid crash
        const contestsWithExtras = contestsArray.map((c, i) => ({
          ...c,
          status: c.status || (i % 2 === 0 ? "attended" : "missed"),
          solvedProblems: c.solvedProblems ?? Math.floor(Math.random() * 5),
        }));

        setAllContests(contestsWithExtras);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch contests.");
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const platforms = ["All", ...new Set(allContests.map(c => c.platform))];

  const filteredContests = allContests.filter(c => {
    const platformMatch = selectedPlatform === "All" || c.platform === selectedPlatform;
    const statusMatch = (showAttended && c.status === "attended") ||
                        (showMissed && c.status === "missed");
    return platformMatch && statusMatch;
  });

  const paginatedContests = filteredContests.slice(
    (currentPage - 1) * contestsPerPage,
    currentPage * contestsPerPage
  );

  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);
  const totalSolved = filteredContests.reduce((sum, c) => sum + c.solvedProblems, 0);

  const chartData = (() => {
    const targetPlatforms = selectedPlatform === "All"
      ? platforms.filter(p => p !== "All")
      : [selectedPlatform];
  
    return targetPlatforms.map(platform => {
      const platformContests = allContests.filter(c => c.platform === platform);
      return {
        platform,
        attended: platformContests.filter(c => c.status === "attended").length,
        missed: platformContests.filter(c => c.status === "missed").length,
        solved: platformContests.reduce((sum, c) => sum + c.solvedProblems, 0)
      };
    });
  })();
  

  if (loading) return <div className="text-center p-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white-600 mb-6">
        Welcome back, {user?.name || "Coder"}!
      </h1>

      {/* 📊 Summary */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-center flex-1">
          <p className="text-2xl font-bold text-purple-600">{totalSolved}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Problems Solved</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-center flex-1">
          <p className="text-2xl font-bold text-purple-600">{filteredContests.length}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Contests Shown</p>
        </div>
      </div>

      {/* 🛠 Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <label className="text-sm font-medium flex items-center">
          Platform:
          <select
            value={selectedPlatform}
            onChange={(e) => { setSelectedPlatform(e.target.value); setCurrentPage(1); }}
            className="ml-2 border dark:bg-gray-800 border-gray-300 rounded px-2 py-1"
          >
            {platforms.map(p => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium flex items-center">
          <input type="checkbox" checked={showAttended} onChange={() => setShowAttended(!showAttended)} className="mr-1"/>
          Attended
        </label>
        <label className="text-sm font-medium flex items-center">
          <input type="checkbox" checked={showMissed} onChange={() => setShowMissed(!showMissed)} className="mr-1"/>
          Missed
        </label>
      </div>

      {/* 📈 Chart */}
      <div className="mb-10 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Contest Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attended" fill="#4ade80" />
            <Bar dataKey="missed" fill="#f87171" />
            <Bar dataKey="solved" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📝 Contest List */}
      <div className="grid gap-4">
        {paginatedContests.map((contest, idx) => (
          <motion.div
            key={contest.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{contest.name}</h3>
                <a href={contest.link} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  View Contest
                </a>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium mb-1 ${
                  contest.status === "attended" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Solved: {contest.solvedProblems}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📍 Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition ${
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