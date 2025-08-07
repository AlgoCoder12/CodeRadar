"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Typewriter } from "react-simple-typewriter"
import { useAuth } from "../contexts/AuthContext"
import { Trophy, Code, Zap, ArrowRight, Calendar, Target, Sparkles, Rocket, Award } from "lucide-react"

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
          hue: Math.random() * 60 + 280, // Purple to pink range
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
        className="absolute bottom-40 left-20 w-56 h-56 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 right-40 w-40 h-40 bg-gradient-to-r from-purple-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "3s" }}
      ></div>
    </div>
  )
}

const platforms = [
  {
    name: "LeetCode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    color: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-500/20 to-yellow-500/10",
    description: "Technical interviews prep",
    icon: Code,
  },
  {
    name: "CodeForces",
    logo: "https://tinyurl.com/mvywhztr",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/10",
    description: "Competitive programming",
    icon: Trophy,
  },
  {
    name: "CodeChef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
    color: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 to-orange-500/10",
    description: "Monthly challenges",
    icon: Calendar,
  },
  {
    name: "AtCoder",
    logo: "https://img.atcoder.jp/assets/atcoder.png",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/10",
    description: "Japanese contests",
    icon: Zap,
  },
]

function PlatformCard({ platform, index, handle }) {
  return (
    <div
      className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: `fadeInUp 0.8s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <Link
        to={`/contest-info/${platform.name.toLowerCase()}${handle ? `?handle=${handle}` : ""}`}
        className="block p-8 h-full"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10 text-center">
          {/* Logo Container */}
          <div className="relative mb-6">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative bg-slate-800/60 backdrop-blur-md rounded-xl p-6 flex items-center justify-center h-24 group-hover:bg-slate-800/80 transition-all duration-300">
              <img
                src={platform.logo || "/placeholder.svg"}
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                alt={`${platform.name} Logo`}
                className="h-12 w-12 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {platform.name}
            </h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-lg">
              {platform.description}
            </p>

            {/* Action */}
            <div className="flex items-center justify-center space-x-2 text-purple-400 group-hover:text-pink-400 transition-colors duration-300 pt-4">
              <span className="font-medium">View Contests</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
        />
      </Link>
    </div>
  )
}

export default function ContestInfo() {
  const { user } = useAuth()

  const getHandle = (name) => {
    const platform = name.toLowerCase()
    return {
      leetcode: "leetcodeHandle",
      codeforces: "codeforcesHandle",
      codechef: "codechefHandle",
      atcoder: "atcoderHandle",
    }[platform]
  }

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
                <Trophy className="w-4 h-4 mr-2 animate-pulse" />
                Contest Information Hub
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Choose Your
                </span>
                <br />
                <span className="text-3xl lg:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-normal flex items-center justify-center gap-4 mt-4">
                  <Code className="w-12 h-12 text-purple-400 drop-shadow-lg" />
                  Coding Platform
                  <Trophy className="w-12 h-12 text-pink-400 drop-shadow-lg" />
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
                Select your favorite coding platform and explore upcoming contests, challenges, and opportunities to
                sharpen your programming skills.
              </p>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-20"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 0.4s forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-pink-500/30 text-pink-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
                <Award className="w-4 h-4 mr-2" />
                Available Platforms
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-slate-100 mb-6">
                Start Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Journey
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Choose from the most popular competitive programming platforms
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {platforms.map((platform, index) => {
                const handleKey = getHandle(platform.name)
                const handle = user?.[handleKey]
                return <PlatformCard key={platform.name} platform={platform} index={index} handle={handle} />
              })}
            </div>
          </div>
        </section>

        {/* Typewriter Section */}
        <section className="px-4 py-24 bg-slate-800/20 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <div
              className="text-center mb-16"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 0.6s forwards",
              }}
            >
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 mb-8 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Code className="h-8 w-8 text-purple-400" />
                  <Zap className="h-8 w-8 text-pink-400" />
                  <Rocket className="h-8 w-8 text-cyan-400" />
                </div>
                <div className="text-3xl font-mono text-slate-300 min-h-[4rem] flex items-center justify-center">
                  <Typewriter
                    words={[
                      "Fetching upcoming contests...",
                      "Sharpen your problem-solving skills...",
                      "Get ready to compete!",
                      "Practice. Compete. Repeat.",
                      "Master algorithms and data structures...",
                      "Join the coding community...",
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl text-slate-400 mb-8">
                Ready to take your competitive programming to the next level?
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/potd">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Target className="w-5 h-5 mr-2 inline group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">Try Problem of the Day</span>
                  </button>
                </Link>
                <Link to="/timetable">
                  <button className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-purple-500/50 px-8 py-4 rounded-xl font-semibold text-lg bg-slate-800/20 backdrop-blur-md transition-all duration-300 hover:scale-105 group hover:shadow-lg hover:shadow-slate-500/20">
                    <Calendar className="w-5 h-5 mr-2 inline group-hover:text-purple-400 transition-colors duration-300" />
                    View Schedule
                  </button>
                </Link>
              </div>
            </div>
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
