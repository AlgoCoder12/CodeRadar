"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import {
  Trophy,
  User,
  Calendar,
  Clock,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Target,
  Award,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react"

const platforms = [
  {
    name: "leetcode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    displayName: "LeetCode",
    color: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-500/20 to-yellow-500/10",
  },
  {
    name: "codeforces",
    logo: "https://tinyurl.com/mvywhztr",
    displayName: "CodeForces",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    name: "codechef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
    displayName: "CodeChef",
    color: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    name: "atcoder",
    logo: "https://img.atcoder.jp/assets/atcoder.png",
    displayName: "AtCoder",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/10",
  },
  {
    name: "hackerrank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
    displayName: "HackerRank",
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    name: "hackerearth",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxTmatQgSjbS7EcoYLY1dPCjPwqOBmSvEwHg&s",
    displayName: "HackerEarth",
    color: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/20 to-purple-500/10",
  },
  {
    name: "geeksforgeeks",
    logo: "https://media.geeksforgeeks.org/wp-content/uploads/20210224040010/gg-logo.png",
    displayName: "GeeksforGeeks",
    color: "from-green-600 to-teal-500",
    bgGradient: "from-green-600/20 to-teal-500/10",
  },
  {
    name: "topcoder",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8zAQWiyyKXkXygCCWUz_01xvVCxWOCpTsjQ&s",
    displayName: "TopCoder",
    color: "from-red-500 to-pink-500",
    bgGradient: "from-red-500/20 to-pink-500/10",
  },
  {
    name: "csacademy",
    logo: "https://csacademy.com/app/static/round/favicon.png",
    displayName: "CS Academy",
    color: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/20 to-purple-500/10",
  },
]

const getPlatformInfo = (platformName) => {
  return (
    platforms.find((p) => p.name.toLowerCase() === platformName.toLowerCase()) || {
      name: platformName,
      logo: "",
      displayName: platformName,
      color: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-500/20 to-gray-600/10",
    }
  )
}

const ContestCard = ({ contest, platformColor }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "ended":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
          {contest.name}
        </h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(contest.status)}`}>
          {contest.status}
        </span>
      </div>

      <div className="space-y-3 text-sm text-gray-300 mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-purple-400" />
          <span className="font-medium text-gray-400">Start:</span>
          <span>{new Date(contest.startTime).toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span className="font-medium text-gray-400">Duration:</span>
          <span>{contest.duration} minutes</span>
        </div>
        <div className="flex items-center space-x-3">
          <Target className="h-4 w-4 text-pink-400" />
          <span className="font-medium text-gray-400">Time:</span>
          <span className="font-medium text-blue-400">{contest.timeUntilStart}</span>
        </div>
        {contest.hasParticipatedBefore && (
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400">Previously participated</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-cyan-400 font-medium transition-colors duration-300 group-hover:scale-105"
        >
          <span>View Contest</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

const UserStats = ({ stats, platformColor }) => {
  const statItems = [
    { icon: Trophy, label: "Total Contests", value: stats.totalContestsParticipated, color: "text-yellow-400" },
    {
      icon: TrendingUp,
      label: "Avg Rank",
      value: stats.averageRank ? Math.round(stats.averageRank) : "N/A",
      color: "text-green-400",
    },
    {
      icon: Target,
      label: "Avg Score",
      value: stats.averageScorePercentage ? `${Math.round(stats.averageScorePercentage)}%` : "N/A",
      color: "text-purple-400",
    },
    { icon: Award, label: "Latest Rank", value: stats.latestRank || "N/A", color: "text-cyan-400" },
  ]

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Your Performance Stats</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} />
            <div className="text-2xl font-black text-white mb-1">{item.value}</div>
            <div className="text-sm text-gray-400 font-medium">{item.label}</div>
          </div>
        ))}
      </div>

      {stats.latestContest && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm text-gray-300">
            <span className="font-medium text-purple-400">Latest Contest:</span> {stats.latestContest}
          </p>
        </div>
      )}
    </div>
  )
}

export default function ContestPlatformPage() {
  const { platform } = useParams()
  const navigate = useNavigate()
  const { user, token, url, loading: authLoading } = useAuth()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [contests, setContests] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const platformInfo = getPlatformInfo(platform)

  useEffect(() => {
    if (!authLoading && !user) {
      setError("⚠️ Please login first to continue.")
    }
  }, [authLoading, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setShowResults(false)

    if (!user) {
      setError("⚠️ Please login first to continue.")
      setLoading(false)
      return
    }

    if (!username.trim()) {
      setError("❌ Please enter a username.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${url}/dashboard/platform-contests/${username}/${platform}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVerificationResult(response.data)
      setContests(response.data.contests || [])
      setUserStats(response.data.userStats || null)
      setShowResults(true)
    } catch (err) {
      setError("❌ Error fetching contest data. Please try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUsername("")
    setVerificationResult(null)
    setContests([])
    setUserStats(null)
    setShowResults(false)
    setError("")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
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
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {platformInfo.logo && (
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${platformInfo.color} rounded-full blur-lg opacity-30`}
                ></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <img
                    src={platformInfo.logo || "/placeholder.svg"}
                    alt={`${platformInfo.displayName} logo`}
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {platformInfo.displayName}
              </h1>
              <p className="text-xl text-purple-400 font-semibold">Contest Tracker</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Enter your {platformInfo.displayName} username to verify your account and view upcoming contests with
            personalized insights.
          </p>
        </div>

        {/* Username Input Form */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Your {platformInfo.displayName} Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`Enter your ${platformInfo.displayName} username`}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verify & Get Contests</span>
                    </>
                  )}
                </button>
                {showResults && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {showResults && verificationResult && (
          <div className="max-w-6xl mx-auto">
            {/* Verification Status */}
            <div className="mb-8">
              <div
                className={`rounded-2xl p-6 border backdrop-blur-xl ${
                  verificationResult.isValidHandle
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {verificationResult.isValidHandle ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                  <p
                    className={`font-medium text-lg ${
                      verificationResult.isValidHandle ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {verificationResult.message}
                  </p>
                </div>
              </div>
            </div>

            {verificationResult.isValidHandle && (
              <>
                {/* User Stats */}
                {userStats && <UserStats stats={userStats} platformColor={platformInfo.color} />}

                {/* Contests Section */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      <h2 className="text-3xl font-black text-white">Upcoming Contests</h2>
                    </div>
                    <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
                      {contests.length} contest{contests.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {contests.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {contests.map((contest, index) => (
                        <ContestCard key={index} contest={contest} platformColor={platformInfo.color} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 text-xl font-semibold mb-2">No upcoming contests found</p>
                        <p className="text-gray-400">
                          Check back later for new contests on {platformInfo.displayName}!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/contestinfo")}
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-cyan-400 font-medium transition-colors duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Platform Selection</span>
          </button>
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
