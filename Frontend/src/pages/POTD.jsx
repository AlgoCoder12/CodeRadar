"use client"

import { useEffect, useState, useRef } from "react"
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
  Sparkles,
  Award,
  Target,
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
      className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: `fadeInUp 0.8s ease-out forwards`,
        animationDelay: `${index * 0.2}s`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 p-2 bg-slate-800/60 backdrop-blur-md rounded-lg group-hover:bg-slate-800/80 transition-all duration-300">
                {potd.logo || platform.logo ? (
                  <img
                    src={potd.logo || platform.logo}
                    alt={`${potd.platform} logo`}
                    className="w-6 h-6 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                  />
                ) : (
                  <span className="text-xl">{platform.icon}</span>
                )}
              </div>
              <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                {potd.platform}
              </span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getDifficultyColor(
                  potd.difficulty,
                )}`}
              >
                {potd.difficulty || "Unknown"}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 leading-tight mb-4">
              {potd?.title}
            </h2>
          </div>
        </div>

        {potd.tags?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-400">Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {potd.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800/60 backdrop-blur-md border border-slate-600/50 rounded-full text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:border-purple-500/30 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/50 group-hover:border-purple-500/30 transition-all duration-300">
            <Clock className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-xs text-slate-400">Estimated Time</p>
              <p className="text-sm font-semibold text-slate-100">{getEstimatedTime(potd.points)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSolveClick}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <Code className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Solve Problem</span>
            <ExternalLink className="h-4 w-4 relative z-10" />
          </button>
          {!user && (
            <p className="text-xs text-slate-400">
              <span className="text-purple-400">Login required</span> to solve
            </p>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
      ></div>
    </div>
  )
}

const StatsCard = ({ icon: Icon, label, value, color, index }) => (
  <div
    className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
    style={{
      opacity: 0,
      transform: "translateY(30px)",
      animation: `fadeInUp 0.6s ease-out forwards`,
      animationDelay: `${0.8 + index * 0.1}s`,
    }}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="inline-flex p-4 rounded-2xl bg-slate-800/60 backdrop-blur-md mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
        <Icon className={`h-8 w-8 ${color} group-hover:scale-110 transition-transform duration-300`} />
      </div>
      <div className="text-3xl font-black text-slate-100 mb-2 group-hover:text-white transition-colors duration-300">
        {value}
      </div>
      <div className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">
        {label}
      </div>
    </div>
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
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Interactive Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Particle system canvas */}
        <ParticleSystem />
        {/* Glowing orbs */}
        <GlowingOrbs />
        {/* Subtle gradient overlay */}
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
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Problem of the Day
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Daily Coding
                </span>
                <br />
                <span className="text-3xl lg:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-normal flex items-center justify-center gap-4 mt-4">
                  <Coffee className="w-12 h-12 text-purple-400 drop-shadow-lg" />
                  Challenge
                  <Zap className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
                One challenge a day keeps the coding fear away. Stay consistent, sharpen your skills, and grow stronger
                with handpicked problems from top platforms.
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
                Statistics
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                Your Coding{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Journey
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            {potds === null ? (
              <div className="text-center py-16">
                <div
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 max-w-2xl mx-auto"
                  style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    animation: "fadeInUp 0.8s ease-out 0.6s forwards",
                  }}
                >
                  <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
                  <p className="text-slate-100 text-2xl font-bold mb-3">Loading Today's Challenges</p>
                  <p className="text-slate-400 text-lg">Fetching the best problems for you...</p>
                </div>
              </div>
            ) : potds.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 max-w-2xl mx-auto"
                  style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    animation: "fadeInUp 0.8s ease-out 0.6s forwards",
                  }}
                >
                  <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                  <p className="text-slate-100 text-2xl font-bold mb-3">No Problems Available</p>
                  <p className="text-slate-400 text-lg">Check back later for new daily challenges!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div
                  className="text-center mb-12"
                  style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    animation: "fadeInUp 0.8s ease-out 0.6s forwards",
                  }}
                >
                  <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                    <Target className="w-4 h-4 mr-2" />
                    Today's Challenges
                  </div>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Calendar className="h-8 w-8 text-purple-400" />
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-100">Today's Problems</h2>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-slate-400 text-lg">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
                  {potds.map((potd, index) => (
                    <POTDCard key={index} potd={potd} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
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
