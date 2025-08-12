"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, Upload, FileText, X, Check, AlertCircle, Sparkles, Award, Cloud, Clock, MapPin, User, Calendar, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useUser } from "../contexts/UserContext"
import FileUploader from "../components/FileUploader"
import ParticleSystem from "../components/ParticleSystem"
import GlowingOrbs from "../components/GlowingOrbs"


export default function TimeTablePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [table, setTable] = useState()
  const [subjectMap, setSubjectMap] = useState({})
  const [loading, setLoading] = useState(false)

  const { token } = useAuth()
  const { getTimeTable, uploadTimeTable } = useUser()

  const handleFileUpload = (file) => {
    setSelectedFile(file)
  }

  const handleCancel = () => {
    setSelectedFile(null)
  }

  const upload = async (file) => {
    setLoading(true)
    try {
      const res = await uploadTimeTable(file)
      if (res) {
        await getTT()
      }
    } finally {
      setLoading(false)
      setSelectedFile(null);
    }
  }

  const processTableData = (data) => {
    // Separate mapping entries (lecturer is null)
    const mappingEntries = data.filter(item => item.lecturer === null)
    const actualClasses = data.filter(item => item.lecturer !== null)

    // Build subject code-to-name map
    const map = {}
    mappingEntries.forEach(item => {
      // Example: "CS32102 = Object Oriented Programming (3L)"
      const [code, name] = item.classTitle.split(" = ")
      if (code && name) {
        map[code.trim()] = name.trim()
      }
    })

    // Replace subject code with name in actual classes
    const processedClasses = actualClasses.map(item => {
      // Extract code from classTitle (e.g., "CS32102(L)" -> "CS32102")
      const codeMatch = item.classTitle.match(/^([A-Z0-9]+)\b/)
      const code = codeMatch ? codeMatch[1] : item.classTitle
      const mappedName = map[code]
      if (mappedName) {
        // Preserve type suffix (e.g., "(L)", "(T)", "(P)")
        const typeSuffixMatch = item.classTitle.match(/(\([LTP]\))/)
        const typeSuffix = typeSuffixMatch ? typeSuffixMatch[1] : ""
        return {
          ...item,
          classTitle: `${mappedName} ${typeSuffix}`.trim()
        }
      }
      return item
    })

    setSubjectMap(map)
    setTable(processedClasses)
  }

  const getTT = async () => {
    setLoading(true)
    try {
      const data = await getTimeTable()
      processTableData(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTT()
    // eslint-disable-next-line
  }, [token])

  const getClassType = (classTitle) => {
    if (classTitle.includes('(L)')) return { type: 'Lecture', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
    if (classTitle.includes('(T)')) return { type: 'Tutorial', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
    if (classTitle.includes('(P)')) return { type: 'Practical', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
    return { type: 'Class', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' }
  }

  const groupByDay = (schedule) => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const grouped = {}
    days.forEach(day => {
      grouped[day] = schedule.filter(item => item.day === day)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
    })
    return grouped
  }

  const groupedSchedule = table ? groupByDay(table) : {}

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
            <FileUploader
              onFileUpload={handleFileUpload}
              onUpload={upload}
              onCancel={handleCancel}
              selectedFile={selectedFile}
              loading={loading}
            />
          </div>
        </section>

        {/* Timetable Display */}
        {table && table.length > 0 && (
          <section className="px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                📅 Weekly Schedule
              </h2>
              <div className="grid gap-6">
                {Object.entries(groupedSchedule).map(([day, classes]) => (
                  classes.length > 0 && (
                    <div key={day} className="bg-slate-800/60 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white">{day}</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-4">
                          {classes.map((classItem) => {
                            const classType = getClassType(classItem.classTitle)
                            return (
                              <div key={classItem._id} className="border border-slate-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="text-lg font-semibold text-white">
                                        {classItem.classTitle}
                                      </h4>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classType.color}`}>
                                        {classType.type}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                      <div className="flex items-center text-slate-300">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>{classItem.start} - {classItem.end}</span>
                                      </div>
                                      <div className="flex items-center text-slate-300">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>{classItem.venue}</span>
                                      </div>
                                      <div className="flex items-center text-slate-300">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{classItem.lecturer}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Summary */}
        {table && table.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-slate-800/60 rounded-lg p-4 text-center shadow-md border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-400">{table.length}</div>
              <div className="text-sm text-slate-300">Total Classes</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-4 text-center shadow-md border border-slate-700/50">
              <div className="text-2xl font-bold text-blue-400">
                {table.filter(c => c.classTitle.includes('(L)')).length}
              </div>
              <div className="text-sm text-slate-300">Lectures</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-4 text-center shadow-md border border-slate-700/50">
              <div className="text-2xl font-bold text-green-400">
                {table.filter(c => c.classTitle.includes('(T)')).length}
              </div>
              <div className="text-sm text-slate-300">Tutorials</div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-4 text-center shadow-md border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-400">
                {table.filter(c => c.classTitle.includes('(P)')).length}
              </div>
              <div className="text-sm text-slate-300">Practicals</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Get Smart Notifications 🔔
          </Button>
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
