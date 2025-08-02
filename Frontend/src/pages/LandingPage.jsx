"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="mb-4 group"
      style={{
        opacity: 0,
        transform: "translateX(-20px)",
        animation: `fadeInLeft 0.6s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:from-white/10 hover:to-white/5 transition-all duration-300">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-6 py-5 font-medium text-lg focus:outline-none flex justify-between items-center text-white hover:transform hover:translateX-1 transition-all duration-300"
        >
          <span className="pr-4">{question}</span>
          <span
            className="text-purple-400 transition-transform duration-300 flex-shrink-0"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            {open ? "−" : "+"}
          </span>
        </button>
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "200px" : "0" }}>
          <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-white/10 pt-4">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { user } = useAuth()
  const observerRef = useRef(null)

  useEffect(() => {
    // Remove default margins and ensure full screen coverage
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.documentElement.style.margin = "0"
    document.documentElement.style.padding = "0"
    // Remove the overflow hidden that was causing issues

    return () => {
      // Cleanup on unmount - no need to restore overflow
    }
  }, [])

  useEffect(() => {
    // Initialize intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for scroll animations
    const elementsToObserve = document.querySelectorAll(".feature-card, .stat-card")
    elementsToObserve.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observerRef.current.observe(el)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const mainFeatures = [
    {
      emoji: "🏆",
      title: "Contest Information Hub",
      description: "Get real-time updates on contests from all major coding platforms",
      details:
        "Track contests from LeetCode, Codeforces, CodeChef, HackerRank, AtCoder, and 15+ more platforms in one unified dashboard.",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      link:"/contestinfo"
    },
    {
      emoji: "🧠",
      title: "Problem of the Day",
      description: "Daily curated problems to sharpen your algorithmic thinking",
      details:
        "Handpicked DSA problems with varying difficulty levels, complete with editorial solutions and community discussions.",
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
       link:"/potd"
    },
    {
      emoji: "🎓",
      title: "Semester Class Schedule",
      description: "Organize your academic schedule alongside coding practice",
      details:
        "Sync your university timetable, assignment deadlines, and exam schedules with your coding practice routine.",
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
       link:"/timetable"
    },
  ]

  const additionalFeatures = [
    { emoji: "⏰", title: "Smart Notifications", desc: "Never miss important contests " },
    { emoji: "📊", title: "Progress Analytics", desc: "Track your improvement with detailed insights" },
   // { emoji: "👥", title: "Community Features", desc: "Connect with fellow competitive programmers" },
    { emoji: "🎯", title: "Goal Setting", desc: "Set and achieve your coding milestones" },
   // { emoji: "📚", title: "Resource Library", desc: "Access curated learning materials and tutorials" },
   // { emoji: "🏅", title: "Achievement System", desc: "Earn badges and celebrate your progress" },
  ]

  // const stats = [
  //   { number: "20+", label: "Coding Platforms" },
  //   { number: "50K+", label: "Daily Problems" },
  //   { number: "15K+", label: "Active Users" },
  //   { number: "100+", label: "Universities" },
  // ]

  const faqData = [
    {
      q: "What makes CodeRadar different from other coding platforms?",
      a: "CodeRadar is not a coding platform itself, but a comprehensive hub that aggregates information from all major coding platforms. We also integrate academic scheduling to help students balance their studies with competitive programming.",
    },
    {
      q: "How does the contest tracking work?",
      a: "We continuously monitor 20+ coding platforms using their APIs and web scraping to provide real-time contest updates. You'll get notifications before contests start and can filter by your preferred platforms.",
    },
    {
      q: "Can I sync my university schedule?",
      a: "Yes! You can manually add your class schedules, assignment deadlines, and exam dates. Our smart calendar will help you plan your coding practice around your academic commitments.",
    },
    {
      q: "Is the Problem of the Day feature free?",
      a: "Our POTD feature is completely free and includes problems from beginner to advanced levels, with detailed editorial solutions.",
    },
    {
      q: "Do you support mobile notifications?",
      a: "Yes, we offer push notifications for contest reminders, new POTD problems.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
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
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-20"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              animation: "fadeInUp 1s ease-out forwards",
            }}
          >
            <div className="mb-8 inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-6 py-3 rounded-full text-base font-medium backdrop-blur-sm">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Your Complete Coding Companion
            </div>

            <h1 className="text-6xl sm:text-8xl font-black leading-tight tracking-tight mb-8">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                CodeRadar
              </span>
              <br />
              <span className="text-4xl sm:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Everything Coding, Unified
              </span>
            </h1>

            <p className="text-gray-300 max-w-3xl mx-auto text-xl sm:text-2xl mb-12 leading-relaxed">
              The ultimate platform that brings together contest tracking, daily practice problems, and academic
              scheduling. Master competitive programming while staying on top of your studies.
            </p>

            <Link to={user ? "/contestinfo" : "/login"}>
              <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
                Start Your Journey
                <svg
                  className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Stats Section - Horizontal Layout */}
          {/* <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32 max-w-5xl mx-auto"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              animation: "fadeInUp 0.8s ease-out 0.3s forwards",
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card bg-gradient-to-br from-white/10 to-white/5 border-0 backdrop-blur-sm hover:from-white/20 hover:to-white/10 transition-all duration-300 rounded-xl p-8 text-center group hover:scale-105 hover:-translate-y-2"
                style={{
                  opacity: 0,
                  transform: "scale(0.8)",
                  animation: `scaleIn 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Main Features Section - Vertical Layout */}
        <section className="max-w-7xl mx-auto mb-32">
          <div
            className="text-center mb-20"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Three Pillars of Success
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              CodeRadar combines the essential tools every serious programmer needs in one seamless experience
            </p>
          </div>

          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                style={{
                  opacity: 0,
                  transform: index % 2 === 0 ? "translateX(-60px)" : "translateX(60px)",
                  animation: `${index % 2 === 0 ? "fadeInLeft" : "fadeInRight"} 0.8s ease-out ${index * 0.2}s forwards`,
                }}
              >
                <div className="flex-1 space-y-6">
                  <div className="text-6xl mb-4">{feature.emoji}</div>
                  <h3 className="text-4xl font-black text-white">{feature.title}</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">{feature.description}</p>
                  <p className="text-gray-400 leading-relaxed">{feature.details}</p>
                 
                  <Link to={user ? feature.link : "/login"}>
                  <Button 
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 bg-transparent"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Button>
                  </Link>
                </div>
                <div className="flex-1">
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} border-0 backdrop-blur-sm h-80 rounded-xl flex items-center justify-center`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-8xl">{feature.emoji}</div>
                      <div className="text-2xl font-bold text-white">{feature.title}</div>
                      {/* <div className="text-gray-300">Interactive Preview Coming Soon</div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Features - Horizontal Grid */}
        <section className="max-w-7xl mx-auto mb-32">
          <div
            className="text-center mb-16"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to excel in competitive programming 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card h-full bg-white/5 border-0 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 rounded-xl p-8 text-center group hover:-translate-y-3 hover:scale-105"
                style={{
                  opacity: 0,
                  transform: "translateY(40px)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <div className="text-4xl mb-6">{feature.emoji}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section - New Modern Style */}
        <section className="max-w-4xl mx-auto mb-32">
          <div
            className="text-center mb-16"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Got Questions?
            </h2>
            <p className="text-gray-400 text-lg">We've got answers to help you get started</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-5xl mx-auto text-center">
          <div
            className="bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-cyan-900/50 border-0 backdrop-blur-sm overflow-hidden relative rounded-xl"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
            <div className="relative p-16">
              <h3 className="text-4xl sm:text-5xl font-black mb-6 text-white">
                Ready to Transform Your Coding Journey?
              </h3>
              {/* <p className="text-gray-300 mb-10 text-xl max-w-3xl mx-auto leading-relaxed">
                Join thousands of students and professionals who are mastering competitive programming while staying
                organized with their academic commitments.
              </p> */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Link to={user ? "/contestinfo" : "/login"}>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-10 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300">
                    Get Started Free
                  </Button>
                </Link> */}
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-bold rounded-full bg-transparent"
                >
                  Watch Demo
                </Button>
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
