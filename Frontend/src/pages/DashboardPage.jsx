"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
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
  Sparkles,
  Award,
  BarChart3,
  PieChartIcon,
  Coffee,
} from "lucide-react"

function ParticleSystem() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const particles = particlesRef.current

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const createParticles = () => {
      particles.length = 0
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 260, // Purple to pink range
        })
      }
    }
    createParticles()

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.x -= dx * force * 0.01
          particle.y -= dy * force * 0.01
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 70%, 60%, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}

function GlowingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {/* Large glowing orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-500/15 to-purple-500/15 rounded-full blur-3xl animate-float-slow"></div>
      <div
        className="absolute bottom-40 left-20 w-56 h-56 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 right-40 w-40 h-40 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "3s" }}
      ></div>
    </div>
  )
}

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
      <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
        {/* Interactive Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <ParticleSystem />
          <GlowingOrbs />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20"
            style={{ zIndex: 3 }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div
            className="text-center"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeInUp 1s ease-out forwards",
            }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-50"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-8 border border-purple-500/30">
                <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Loading Your Dashboard</h2>
            <p className="text-slate-300 text-lg">Fetching your contest data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
        {/* Interactive Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <ParticleSystem />
          <GlowingOrbs />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20"
            style={{ zIndex: 3 }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div
            className="text-center"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeInUp 1s ease-out forwards",
            }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-8 border border-red-500/30">
                <AlertCircle className="h-16 w-16 text-red-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Oops! Something went wrong</h2>
            <p className="text-slate-300 text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Interactive Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ParticleSystem />
        <GlowingOrbs />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/20"
          style={{ zIndex: 3 }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className="mb-12"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 1s ease-out forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-purple-500/30 text-purple-300 px-6 py-3 rounded-full text-sm font-medium mb-8 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <Trophy className="w-4 h-4 mr-2 animate-pulse" />
                Your Coding Journey
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Welcome back,
                </span>
                <br />
                <span className="text-3xl lg:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-normal flex items-center justify-center gap-4 mt-4">
                  <Coffee className="w-12 h-12 text-purple-400 drop-shadow-lg" />
                  {user?.name || "Coder"}
                  <Zap className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
                Track your progress, analyze your performance, and continue your journey to coding mastery.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-16"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 0.4s forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <Award className="w-4 h-4 mr-2" />
                Performance Overview
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                Your Coding{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Statistics
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    animation: `fadeInUp 0.6s ease-out forwards`,
                    animationDelay: `${0.6 + index * 0.1}s`,
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex p-4 rounded-2xl bg-slate-800/60 backdrop-blur-md group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <stat.icon
                          className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      <Star className="h-6 w-6 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="text-4xl font-black text-slate-100 mb-3 group-hover:text-white transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 1s forwards",
              }}
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="inline-flex p-3 rounded-xl bg-slate-800/60 backdrop-blur-md">
                  <Filter className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100">Filters</h3>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                {/* Platform Filter */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-slate-300">Platform:</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => {
                      setSelectedPlatform(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="bg-slate-800/60 backdrop-blur-md border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-500/30"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p} className="bg-slate-800 text-slate-100">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Status Filters */}
                <div className="flex items-center space-x-8">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showAttended}
                      onChange={() => setShowAttended(!showAttended)}
                      className="w-5 h-5 text-green-500 bg-slate-800/60 border-slate-600/50 rounded focus:ring-green-500/20 focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-green-400 transition-colors duration-300">
                      Attended
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showMissed}
                      onChange={() => setShowMissed(!showMissed)}
                      className="w-5 h-5 text-red-500 bg-slate-800/60 border-slate-600/50 rounded focus:ring-red-500/20 focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors duration-300">
                      Missed
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-16"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 1.2s forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                Performance{" "}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Analytics
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bar Chart */}
              <div
                className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500"
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  animation: "fadeInUp 0.8s ease-out 1.4s forwards",
                }}
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="inline-flex p-3 rounded-xl bg-slate-800/60 backdrop-blur-md">
                    <BarChart3 className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">Contest Performance</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="platform" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
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
              </div>

              {/* Pie Chart */}
              <div
                className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500"
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  animation: "fadeInUp 0.8s ease-out 1.6s forwards",
                }}
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="inline-flex p-3 rounded-xl bg-slate-800/60 backdrop-blur-md">
                    <PieChartIcon className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Attendance</h3>
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
                <div className="flex justify-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-300 font-medium">Attended</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-slate-300 font-medium">Missed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contest List Section */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 1.8s forwards",
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex p-3 rounded-xl bg-slate-800/60 backdrop-blur-md">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">Recent Contests</h3>
                </div>
                <div className="text-sm text-slate-400 bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-600/50">
                  Showing {paginatedContests.length} of {filteredContests.length} contests
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedContests.map((contest, idx) => (
                  <div
                    key={`${contest.name}-${currentPage}`}
                    className="group bg-slate-800/60 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 hover:bg-slate-800/80 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: `fadeInUp 0.6s ease-out forwards`,
                      animationDelay: `${2 + idx * 0.1}s`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-100 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                          {contest.name}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1">{contest.platform}</p>
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
                        <span className="text-slate-400">Problems Solved:</span>
                        <span className="font-semibold text-purple-400">{contest.solvedProblems}</span>
                      </div>
                      {contest.status === "attended" && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Rank:</span>
                            <span className="font-semibold text-cyan-400">#{contest.rank}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Participants:</span>
                            <span className="font-semibold text-slate-300">{contest.participants}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
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
                  </div>
                ))}
              </div>

              {filteredContests.length === 0 && (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full blur-2xl opacity-20"></div>
                    <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-8 border border-slate-600/50 mx-auto w-fit">
                      <Calendar className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">No contests found</h3>
                  <p className="text-slate-400">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="px-4 py-12">
            <div className="max-w-7xl mx-auto">
              <div
                className="flex items-center justify-center space-x-2"
                style={{
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: "fadeInUp 0.8s ease-out 2.2s forwards",
                }}
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-slate-800/60 backdrop-blur-md border border-slate-600/50 text-slate-100 hover:bg-slate-800/80 hover:border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      currentPage === idx + 1
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                        : "bg-slate-800/60 backdrop-blur-md border border-slate-600/50 text-slate-300 hover:bg-slate-800/80 hover:border-purple-500/30"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-slate-800/60 backdrop-blur-md border border-slate-600/50 text-slate-100 hover:bg-slate-800/80 hover:border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>
        )}
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
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.05);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
