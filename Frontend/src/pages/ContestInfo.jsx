"use client"

import { Link } from "react-router-dom"
import { Typewriter } from "react-simple-typewriter"
import { useAuth } from "../contexts/AuthContext"
import { Trophy, Code, Zap, ArrowRight, Users, Calendar, Target } from "lucide-react"

const platforms = [
  {
    name: "LeetCode",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    color: "from-orange-500 to-yellow-500",
    bgGradient: "from-orange-500/20 to-yellow-500/10",
    description: "Technical interviews prep",
  },
  {
    name: "CodeForces",
    logo: "https://tinyurl.com/mvywhztr",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/10",
    description: "Competitive programming",
  },
  {
    name: "CodeChef",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcv_WJfqB-tC3ZFADRoUMMMTtOA6ZzyAA6g&s",
    color: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 to-orange-500/10",
    description: "Monthly challenges",
  },
  {
    name: "AtCoder",
    logo: "https://img.atcoder.jp/assets/atcoder.png",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/10",
    description: "Japanese contests",
  },
]

// const stats = [
//   { icon: Trophy, label: "Active Contests", value: "50+", color: "text-yellow-400" },
//   { icon: Users, label: "Participants", value: "100K+", color: "text-blue-400" },
//   { icon: Calendar, label: "Weekly Events", value: "25+", color: "text-green-400" },
//   { icon: Target, label: "Success Rate", value: "95%", color: "text-purple-400" },
// ]

export default function ContestInfo() {
  const { user } = useAuth()

  const getHandle = (name) => {
    let handle
    const platform = name.toLowerCase()
    if (platform === "codeforces") handle = "codeforcesHandle"
    if (platform === "leetcode") handle = "leetcodeHandle"
    if (platform === "codechef") handle = "codechefHandle"
    if (platform === "atcoder") handle = "atcoderHandle"
    if (platform === "hackerrank") handle = "hackerrankHandle"
    if (platform === "hackerearth") handle = "hackerearthHandle"
    return handle
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
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Trophy className="w-4 h-4 mr-2" />
              Contest Information Hub
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="text-4xl sm:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Coding Platform
              </span>
            </h1>

            <p className="text-gray-300 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
              Select your favorite coding platform and explore upcoming contests, challenges, and opportunities to
              sharpen your programming skills.
            </p>
          </div>

          {/* Stats Section */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                style={{
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Platform Selection */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <Link
                key={platform.name}
                to={`/contest-info/${platform.name}`}
                className="group relative"
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1 + 0.3}s forwards`,
                }}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group-hover:border-white/20">
                  {/* Platform Logo */}
                  <div className="relative mb-6">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>
                    <div className="relative bg-white/10 rounded-xl p-4 flex items-center justify-center h-20">
                      <img
                        src={platform.logo || "/placeholder.svg"}
                        alt={`${platform.name} Logo`}
                        className="h-12 w-12 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Platform Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {platform.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {platform.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-center space-x-2 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
                      <span className="text-sm font-medium">View Contests</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Typewriter Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="h-6 w-6 text-purple-400" />
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>

            <div className="text-2xl font-mono text-gray-300 min-h-[3rem] flex items-center justify-center">
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

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-400 mb-6">Ready to take your competitive programming to the next level?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/potd"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Target className="h-5 w-5 mr-2" />
                Try Problem of the Day
              </Link>
              <Link
                to="/timetable"
                className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Link>
            </div>
          </div>
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
