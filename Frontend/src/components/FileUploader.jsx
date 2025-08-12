import { Loader2, Upload, FileText, X, Check, AlertCircle, Sparkles, Award, Cloud, Clock, MapPin, User, Calendar, Bell } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

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
    <div>
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
  )
}

export default FileUploader