"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code,
  Zap,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

export default function DashboardPage({ user }) {
  const [allContests, setAllContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [showAttended, setShowAttended] = useState(true)
  const [showMissed, setShowMissed] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const contestsPerPage = 6

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/contests")
        const contestsArray = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.contests || []

        const contestsWithExtras = contestsArray.map((c, i) => ({
          ...c,
          status: c.status || (i % 2 === 0 ? "attended" : "missed"),
          solvedProblems: c.solvedProblems ?? Math.floor(Math.random() * 5),
          rank: c.rank ?? Math.floor(Math.random() * 1000) + 1,
          participants: c.participants ?? Math.floor(Math.random() * 5000) + 100,
        }))

        setAllContests(contestsWithExtras)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to fetch contests.")
      } finally {
        setLoading(false)
      }
    }
    fetchContests()
  }, [])

  const platforms = ["All", ...new Set(allContests.map((c) => c.platform))]

  const filteredContests = allContests.filter((c) => {
    const platformMatch = selectedPlatform === "All" || c.platform === selectedPlatform
    const statusMatch = (showAttended && c.status === "attended") || (showMissed && c.status === "missed")
    return platformMatch && statusMatch
  })

  const paginatedContests = filteredContests.slice((currentPage - 1) * contestsPerPage, currentPage * contestsPerPage)
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage)

  const totalSolved = filteredContests.reduce((sum, c) => sum + c.solvedProblems, 0)
  const attendedContests = filteredContests.filter((c) => c.status === "attended").length
  const missedContests = filteredContests.filter((c) => c.status === "missed").length
  const averageRank =
    attendedContests > 0
      ? Math.round(
          filteredContests.filter((c) => c.status === "attended").reduce((sum, c) => sum + c.rank, 0) /
            attendedContests,
        )
      : 0

  const chartData = (() => {
    const targetPlatforms = selectedPlatform === "All" ? platforms.filter((p) => p !== "All") : [selectedPlatform]
    return targetPlatforms.map((platform) => {
      const platformContests = allContests.filter((c) => c.platform === platform)
      return {
        platform,
        attended: platformContests.filter((c) => c.status === "attended").length,
        missed: platformContests.filter((c) => c.status === "missed").length,
        solved: platformContests.reduce((sum, c) => sum + c.solvedProblems, 0),
      }
    })
  })()

  const pieData = [
    { name: "Attended", value: attendedContests, color: "#10b981" },
    { name: "Missed", value: missedContests, color: "#ef4444" },
  ]

  const stats = [
    { icon: Code, label: "Problems Solved", value: totalSolved, color: "text-purple-400", bg: "from-purple-500/20" },
    {
      icon: Trophy,
      label: "Contests Attended",
      value: attendedContests,
      color: "text-yellow-400",
      bg: "from-yellow-500/20",
    },
    {
      icon: Target,
      label: "Average Rank",
      value: averageRank || "N/A",
      color: "text-cyan-400",
      bg: "from-cyan-500/20",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value:
        attendedContests > 0 ? `${Math.round((attendedContests / (attendedContests + missedContests)) * 100)}%` : "0%",
      color: "text-green-400",
      bg: "from-green-500/20",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div
              className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 border border-white/20">
                <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Your Dashboard</h2>
            <p className="text-gray-300">Fetching your contest data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div
              className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 border border-red-500/30">
                <AlertCircle className="h-16 w-16 text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Your Coding Journey
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Welcome back,
              </span>
              <br />
              <span className="text-4xl sm:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center space-x-3">
                <span>{user?.name || "Coder"}</span>
                <Zap className="h-12 w-12 text-yellow-400" />
              </span>
            </h1>

            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Track your progress, analyze your performance, and continue your journey to coding mastery.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div
                  className={`bg-gradient-to-br ${stat.bg} to-transparent backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon
                      className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <Star className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Filters</h3>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Platform Filter */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-300">Platform:</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => {
                    setSelectedPlatform(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p} className="bg-slate-800 text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAttended}
                    onChange={() => setShowAttended(!showAttended)}
                    className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-300">Attended</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMissed}
                    onChange={() => setShowMissed(!showMissed)}
                    className="w-4 h-4 text-red-500 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-300">Missed</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <BarChart className="h-6 w-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Contest Performance</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="platform" tick={{ fill: "#d1d5db", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#d1d5db", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(20px)",
                      color: "#ffffff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="attended" fill="#10b981" name="Attended" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="solved" fill="#8b5cf6" name="Problems Solved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="h-6 w-6 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Attendance</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(20px)",
                      color: "#ffffff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Attended</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Missed</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contest List */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Recent Contests</h3>
              </div>
              <div className="text-sm text-gray-400">
                Showing {paginatedContests.length} of {filteredContests.length} contests
              </div>
            </div>

            <AnimatePresence mode="wait">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedContests.map((contest, idx) => (
                  <motion.div
                    key={`${contest.name}-${currentPage}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                          {contest.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">{contest.platform}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contest.status === "attended" ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Problems Solved:</span>
                        <span className="font-semibold text-purple-400">{contest.solvedProblems}</span>
                      </div>
                      {contest.status === "attended" && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Rank:</span>
                            <span className="font-semibold text-cyan-400">#{contest.rank}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Participants:</span>
                            <span className="font-semibold text-gray-300">{contest.participants}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contest.status === "attended"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                      </span>
                      {contest.link && (
                        <a
                          href={contest.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-purple-400 hover:text-cyan-400 transition-colors duration-300 group-hover:scale-105"
                        >
                          <span className="text-sm font-medium">View</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {filteredContests.length === 0 && (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-2xl opacity-20"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-full p-8 border border-white/20 mx-auto w-fit">
                    <Calendar className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No contests found</h3>
                <p className="text-gray-400">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center justify-center space-x-2"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    currentPage === idx + 1
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
