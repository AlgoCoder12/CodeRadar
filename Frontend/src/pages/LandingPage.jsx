"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  Code2,
  Trophy,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Users,
  TrendingUp,
  Clock,
  Star,
  Github,
  Sparkles,
  Play,
  CheckCircle,
  Rocket,
  Brain,
  Shield,
  Globe,
  Award,
  BookOpen,
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
          hue: Math.random() * 60 + 200, // Blue to purple range
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
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float-slow"></div>
      <div
        className="absolute bottom-40 left-20 w-56 h-56 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 right-40 w-40 h-40 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "3s" }}
      ></div>
    </div>
  )
}

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center text-slate-200 hover:bg-slate-800/40 transition-all duration-200 focus:bg-slate-800/60 group-hover:text-white"
      >
        <span className="font-medium pr-4 text-lg">{question}</span>
        <div className="flex-shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: open ? "300px" : "0" }}>
        <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-slate-700/30 pt-4 bg-slate-800/20">
          {answer}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, details, link, index }) {
  const { user } = useAuth()

  return (
    <div
      className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: `fadeInUp 0.8s ease-out forwards`,
        animationDelay: `${index * 0.2}s`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110">
            <Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4 text-lg">{description}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{details}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link to={user ? link : "/login"}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <span className="mr-2">Explore</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default function LandingPage() {
  const { user } = useAuth()

  const mainFeatures = [
    {
      icon: Trophy,
      title: "Contest Information Hub",
      description: "Real-time updates from 20+ coding platforms",
      details:
        "Track contests from LeetCode, Codeforces, CodeChef, HackerRank, AtCoder, and more. Get notifications, filter by platform, and never miss an important contest.",
      link: "/contestinfo",
    },
    {
      icon: Code2,
      title: "Problem of the Day",
      description: "Daily curated problems to build consistency",
      details:
        "Handpicked DSA problems with varying difficulty levels. Build a daily coding habit with problems that match your skill level and learning goals.",
      link: "/potd",
    },
    {
      icon: Calendar,
      title: "Academic Schedule Manager",
      description: "Balance coding practice with your studies",
      details:
        "Organize your university timetable, assignment deadlines, and exam schedules. Plan your coding practice around your academic commitments.",
      link: "/timetable",
    },
  ]

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Smart Notifications",
      description: "Never miss important contests or deadlines",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track your improvement with detailed insights",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and achieve your coding milestones",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ]

  const stats = [
    {
      icon: Code2,
      label: "Platforms",
      value: "20+",
      description: "Coding platforms integrated",
      color: "from-blue-500/20 to-purple-500/20",
      delay: 0.1,
    },
    {
      icon: Users,
      label: "Active Users",
      value: "15K+",
      description: "Developers using CodeRadar",
      color: "from-purple-500/20 to-pink-500/20",
      delay: 0.2,
    },
    {
      icon: Trophy,
      label: "Contests",
      value: "500+",
      description: "Contests tracked monthly",
      color: "from-green-500/20 to-emerald-500/20",
      delay: 0.3,
    },
    {
      icon: Star,
      label: "Success Rate",
      value: "95%",
      description: "User satisfaction rating",
      color: "from-yellow-500/20 to-orange-500/20",
      delay: 0.4,
    },
  ]

  const faqData = [
    {
      q: "What makes CodeRadar different from other coding platforms?",
      a: "CodeRadar is a comprehensive hub that aggregates information from all major coding platforms while integrating academic scheduling to help students balance studies with competitive programming.",
    },
    {
      q: "How does the contest tracking work?",
      a: "We continuously monitor 20+ coding platforms using APIs and web scraping to provide real-time contest updates. You'll get notifications before contests start and can filter by your preferred platforms.",
    },
    {
      q: "Can I sync my university schedule?",
      a: "Yes! You can manually add your class schedules, assignment deadlines, and exam dates. Our smart calendar helps you plan coding practice around academic commitments.",
    },
    {
      q: "Is the Problem of the Day feature free?",
      a: "Our POTD feature is completely free and includes problems from beginner to advanced levels, with detailed editorial solutions.",
    },
    {
      q: "Do you support mobile notifications?",
      a: "Yes, we offer push notifications for contest reminders and new POTD problems through our web app.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* New Interactive Particle System Background */}
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
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-blue-500/30 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Your Complete Coding Companion
                <Zap className="w-4 h-4 ml-2" />
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                  CodeRadar
                </span>
                <br />
                <span className="text-3xl lg:text-5xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-normal flex items-center justify-center gap-4 mt-4">
                  <Coffee className="w-12 h-12 text-blue-400 drop-shadow-lg" />
                  Everything Coding, Unified
                  <Rocket className="w-12 h-12 text-purple-400 drop-shadow-lg" />
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
                The ultimate platform that brings together contest tracking, daily practice problems, and academic
                scheduling. Master competitive programming while staying organized.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to={user ? "/contestinfo" : "/login"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-blue-500/50 px-10 py-4 rounded-xl font-semibold text-lg bg-slate-800/20 backdrop-blur-md transition-all duration-300 hover:scale-105 group hover:shadow-lg hover:shadow-slate-500/20"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors duration-300" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Main Features Section */}
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
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <Award className="w-4 h-4 mr-2" />
                Core Features
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold text-slate-100 mb-6">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Excel
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Comprehensive tools designed specifically for competitive programmers and computer science students
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-1 max-w-5xl mx-auto">
              {mainFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="px-4 py-24 bg-slate-800/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-16"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 0.6s forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Additional Features
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                More Tools to{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Enhance
                </span>{" "}
                Your Journey
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Advanced features that make CodeRadar the ultimate coding companion
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{
                    opacity: 0,
                    transform: "translateY(30px)",
                    animation: `fadeInUp 0.6s ease-out ${0.8 + index * 0.1}s forwards`,
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div
              className="text-center mb-16"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 1s forwards",
              }}
            >
              <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-md border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                <BookOpen className="w-4 h-4 mr-2" />
                FAQ
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-lg text-slate-400">Everything you need to know about CodeRadar</p>
            </div>

            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
              ))}
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