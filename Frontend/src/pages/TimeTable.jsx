"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, Upload, FileText, X, Check, AlertCircle, Sparkles, Award, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"

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

const FileUploader = ({ onFileUpload, onUpload, onCancel, selectedFile, loading }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(files[0])
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️"
      default:
        return "📁"
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
                <Cloud className="w-4 h-4 mr-2 animate-pulse" />
                Timetable Upload
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Upload Your
                </span>
                <br />
                <span className="text-3xl lg:text-5xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-normal flex items-center justify-center gap-4 mt-4">
                  <FileText className="w-12 h-12 text-purple-400 drop-shadow-lg" />
                  Timetable
                  <Upload className="w-12 h-12 text-pink-400 drop-shadow-lg" />
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-sm">
                Seamlessly upload your academic schedule and let us organize your coding journey around your studies.
              </p>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
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
                File Upload
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
                Share Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Schedule
                </span>
              </h2>
            </div>

            {/* Upload Area */}
            <div
              className="mb-8"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 0.6s forwards",
              }}
            >
              <div
                className={`group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 text-center transition-all duration-500 overflow-hidden ${
                  isDragOver
                    ? "border-purple-500/50 bg-purple-500/10 scale-105 shadow-2xl shadow-purple-500/20"
                    : selectedFile
                      ? "border-green-500/50 bg-green-500/5 shadow-xl shadow-green-500/10"
                      : "hover:border-purple-500/30 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2"
                } ${loading ? "pointer-events-none opacity-50" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated Background Effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-500 ${
                      isDragOver
                        ? "from-purple-500/20 to-pink-500/20 opacity-100"
                        : selectedFile
                          ? "from-green-500/10 to-emerald-500/10 opacity-100"
                          : "opacity-0"
                    }`}
                  />
                </div>

                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                  disabled={loading}
                />

                <label
                  htmlFor="file-upload"
                  className={`relative z-10 cursor-pointer block ${loading ? "pointer-events-none" : ""}`}
                >
                  <div className="space-y-8">
                    {/* Icon Section */}
                    <div className="flex justify-center">
                      {loading ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-50"></div>
                          <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-6 border border-purple-500/30">
                            <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
                          </div>
                        </div>
                      ) : selectedFile ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-lg opacity-50"></div>
                          <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-6 border border-green-500/30">
                            <Check className="h-16 w-16 text-green-400" />
                          </div>
                        </div>
                      ) : isDragOver ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-70"></div>
                          <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-6 border border-purple-500/30">
                            <Upload className="h-16 w-16 text-purple-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative group/icon">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300"></div>
                          <div className="relative bg-slate-800/60 backdrop-blur-md rounded-full p-6 border border-slate-600/50 group-hover/icon:border-purple-500/30 transition-all duration-300 group-hover/icon:scale-110">
                            <FileText className="h-16 w-16 text-slate-400 group-hover/icon:text-purple-400 transition-colors duration-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Section */}
                    <div className="space-y-4">
                      {loading ? (
                        <>
                          <p className="text-3xl font-bold text-slate-100">Processing your file...</p>
                          <p className="text-xl text-slate-300">Please wait while we upload your timetable</p>
                        </>
                      ) : selectedFile ? (
                        <>
                          <p className="text-3xl font-bold text-green-400">File Ready to Upload!</p>
                          <p className="text-xl text-slate-300">Click upload to process your timetable</p>
                        </>
                      ) : isDragOver ? (
                        <>
                          <p className="text-3xl font-bold text-purple-400">Drop it like it's hot! 🔥</p>
                          <p className="text-xl text-slate-300">Release to select your timetable file</p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-slate-100">Drop your timetable here</p>
                          <p className="text-xl text-slate-300">or click to browse files</p>
                        </>
                      )}
                    </div>

                    {/* Supported Formats */}
                    <div className="flex justify-center flex-wrap gap-3">
                      {["PDF", "DOC", "DOCX", "Images"].map((format) => (
                        <span
                          key={format}
                          className="px-4 py-2 bg-slate-800/60 backdrop-blur-md border border-slate-600/50 rounded-full text-sm font-medium text-slate-300 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-300"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Selected File Info */}
            {selectedFile && !loading && (
              <div
                className="mb-8"
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  animation: "fadeInUp 0.8s ease-out 0.8s forwards",
                }}
              >
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 p-3 bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-600/50">
                        <span className="text-3xl">{getFileIcon(selectedFile.name)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 text-lg truncate max-w-xs">{selectedFile.name}</p>
                        <p className="text-slate-400">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={onCancel}
                      className="p-3 hover:bg-slate-800/60 rounded-xl transition-all duration-300 text-slate-400 hover:text-slate-100 hover:scale-110"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => onUpload(selectedFile)}
                      className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-3 text-lg relative overflow-hidden group"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Upload className="h-6 w-6 relative z-10" />
                      <span className="relative z-10">Upload Timetable</span>
                    </Button>
                    <Button
                      onClick={onCancel}
                      className="px-8 py-4 bg-slate-800/60 backdrop-blur-md border border-slate-600/50 text-slate-300 hover:bg-slate-800/80 hover:border-slate-500/50 hover:text-slate-100 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div
                className="mb-8"
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  animation: "fadeInUp 0.8s ease-out 0.8s forwards",
                }}
              >
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                    <span className="text-slate-100 font-semibold text-xl">Processing your timetable...</span>
                  </div>
                  <div className="bg-slate-800/60 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div
              className="text-center"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: "fadeInUp 0.8s ease-out 1s forwards",
              }}
            >
              <div className="inline-flex items-center space-x-3 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-4 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="text-slate-300 font-medium">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </span>
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

export default FileUploader
