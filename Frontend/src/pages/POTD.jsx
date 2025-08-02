"use client"

import { useEffect, useState } from "react"
import { fetchPOTDsForPlatforms } from "../lib/potd"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Brain,
  Calendar,
  Zap,
  Star,
  Tag,
  Clock,
  Loader2,
  AlertCircle,
  Code,
  ExternalLink,
  Users,
  Trophy,
  TrendingUp,
} from "lucide-react"

const platforms = ["LeetCode", "CodeForces"]

const platformInfo = {
  LeetCode: {
    color: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-500/20 to-yellow-500/10",
    icon: "🟠",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
  },
  CodeForces: {
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/10",
    icon: "🔵",
    logo: "https://sta.codeforces.com/s/64388/images/codeforces-logo-with-telegram.png",
  },
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-green-400 bg-green-500/20 border-green-500/30"
    case "medium":
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
    case "hard":
      return "text-red-400 bg-red-500/20 border-red-500/30"
    default:
      return "text-gray-400 bg-gray-500/20 border-gray-500/30"
  }
}

const getEstimatedTime = (points) => {
  if (points === 30) return "1 Hour"
  if (points === 20) return "45 mins"
  return "25 mins"
}

const POTDCard = ({ potd, index }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const platform = platformInfo[potd.platform] || {
    color: "from-gray-500 to-gray-600",
    bgGradient: "from-gray-500/20 to-gray-600/10",
    icon: "⚪",
    logo: null,
  }

  const handleSolveClick = () => {
    if (user && user.id) {
      window.open(potd.problemUrl, "_blank")
    } else {
      navigate("/login", { state: { from: location.pathname } })
    }
  }

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group relative"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {potd.logo || platform.logo ? (
              <img
                src={potd.logo || platform.logo}
                alt={`${potd.platform} logo`}
                className="w-7 h-7 object-contain rounded"
              />
            ) : (
              <span className="text-2xl">{platform.icon}</span>
            )}
            <span className="text-sm font-medium text-purple-400">{potd.platform}</span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(potd.difficulty)}`}>
              {potd.difficulty || "Unknown"}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {potd?.title}
          </h2>
        </div>
      </div>

      {potd.tags?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-400">Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {potd.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-gray-300 hover:bg-white/20 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <Clock className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs text-gray-400">Estimated Time</p>
            <p className="text-sm font-semibold text-white">{getEstimatedTime(potd.points)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleSolveClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
        >
          <Code className="h-5 w-5" />
          <span>Solve Problem</span>
          <ExternalLink className="h-4 w-4" />
        </button>

        {!user && (
          <p className="text-xs text-gray-400">
            <span className="text-purple-400">Login required</span> to solve
          </p>
        )}
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
      ></div>
    </div>
  )
}

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105">
    <Icon className={`h-8 w-8 ${color} mx-auto mb-3`} />
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm font-medium">{label}</div>
  </div>
)

export default function POTDPage() {
  const { user } = useAuth()
  const [potds, setPotds] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      const allPotds = await fetchPOTDsForPlatforms(platforms)
      setPotds(allPotds)
    }
    fetchAll()
  }, [])

  const stats = [
    { icon: Brain, label: "Daily Problems", value: potds?.length || "0", color: "text-purple-400" },
    { icon: Users, label: "Platforms", value: platforms.length, color: "text-cyan-400" },
    { icon: Trophy, label: "Difficulty Levels", value: "3", color: "text-yellow-400" },
    { icon: TrendingUp, label: "Success Rate", value: "85%", color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="mb-8" style={{ opacity: 0, transform: "translateY(30px)", animation: "fadeInUp 1s ease-out forwards" }}>
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4 mr-2" />
              Problem of the Day
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">Daily Coding</span>
              <br />
              <span className="text-4xl sm:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center space-x-3">
                <span>Challenge</span>
                <Zap className="h-12 w-12 text-yellow-400" />
              </span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
              One challenge a day keeps the coding fear away. Stay consistent, sharpen your skills, and grow stronger
              with handpicked problems from top platforms.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto" style={{ opacity: 0, transform: "translateY(40px)", animation: "fadeInUp 0.8s ease-out 0.3s forwards" }}>
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Problems Section */}
        <div className="max-w-5xl mx-auto">
          {potds === null ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-300 text-xl font-semibold mb-2">Loading Today's Challenges</p>
                <p className="text-gray-400">Fetching the best problems for you...</p>
              </div>
            </div>
          ) : potds.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-xl font-semibold mb-2">No Problems Available</p>
                <p className="text-gray-400">Check back later for new daily challenges!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center mb-12" style={{ opacity: 0, transform: "translateY(30px)", animation: "fadeInUp 0.8s ease-out 0.5s forwards" }}>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-purple-400" />
                  <h2 className="text-3xl font-black text-white">Today's Challenges</h2>
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                {potds.map((potd, index) => (
                  <POTDCard key={index} potd={potd} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
