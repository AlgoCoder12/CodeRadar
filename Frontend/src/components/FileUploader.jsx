"use client"

import { useState } from "react"
import { Loader2, Upload, FileText, X, Check, AlertCircle, CloudUpload, File, ImageIcon, FileType } from "lucide-react"
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
        return <FileType className="h-8 w-8 text-red-400" />
      case "doc":
      case "docx":
        return <File className="h-8 w-8 text-blue-400" />
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-8 w-8 text-green-400" />
      default:
        return <FileText className="h-8 w-8 text-gray-400" />
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Upload Area */}
      <div
        className={`relative group border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 backdrop-blur-2xl ${
          isDragOver
            ? "border-purple-400 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-cyan-500/20 scale-[1.02] shadow-2xl shadow-purple-500/25"
            : selectedFile
              ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 shadow-xl shadow-emerald-500/20"
              : "border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:border-purple-400/50 hover:bg-gradient-to-br hover:from-purple-500/10 hover:via-pink-500/5 hover:to-cyan-500/10"
        } ${loading ? "pointer-events-none opacity-60" : "hover:scale-[1.01] cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${isDragOver ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div
              className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-cyan-500/20 rounded-full blur-md animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
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
            {/* Main Icon */}
            <div className="flex justify-center">
              {loading ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-full p-8 border border-white/30 shadow-2xl">
                    <Loader2 className="h-16 w-16 text-white animate-spin" />
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-full p-8 border border-emerald-400/40 shadow-2xl">
                    <Check className="h-16 w-16 text-emerald-400" />
                  </div>
                </div>
              ) : isDragOver ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full p-8 border border-purple-400/50 shadow-2xl animate-bounce">
                    <CloudUpload className="h-16 w-16 text-purple-300" />
                  </div>
                </div>
              ) : (
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-full p-8 border border-white/30 group-hover:border-purple-400/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <Upload className="h-16 w-16 text-gray-300 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Main Text */}
            <div className="space-y-4">
              {loading ? (
                <>
                  <h3 className="text-3xl font-black text-white">Processing Magic ✨</h3>
                  <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                    We're analyzing your timetable and preparing something amazing...
                  </p>
                </>
              ) : selectedFile ? (
                <>
                  <h3 className="text-3xl font-black text-emerald-400">Ready to Launch! 🚀</h3>
                  <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                    Your file is locked and loaded. Hit upload to process your timetable!
                  </p>
                </>
              ) : isDragOver ? (
                <>
                  <h3 className="text-3xl font-black text-purple-300 animate-pulse">Drop it Now! 🎯</h3>
                  <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                    Release to select your awesome timetable file
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    Drop Your Timetable Here
                  </h3>
                  <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                    Drag & drop your file or <span className="text-purple-400 font-semibold">click to browse</span>
                  </p>
                </>
              )}
            </div>

            {/* Supported Formats */}
            <div className="flex flex-wrap justify-center gap-3">
              {["PDF", "DOC", "DOCX", "JPG", "PNG"].map((format) => (
                <span
                  key={format}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium text-gray-300 hover:bg-white/20 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-300"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </label>
      </div>

      {/* Selected File Display */}
      {selectedFile && !loading && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">{getFileIcon(selectedFile.name)}</div>
              <div>
                <h4 className="text-xl font-bold text-white truncate max-w-sm">{selectedFile.name}</h4>
                <p className="text-sm text-gray-400 font-medium">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 group"
            >
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => onUpload(selectedFile)}
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-3 text-lg"
              disabled={loading}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Timetable</span>
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-8 py-4 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-bold rounded-xl transition-all duration-300 hover:scale-105 text-lg"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Loading State */}
      {loading && (
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 backdrop-blur-2xl border border-purple-400/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              <span className="text-xl font-bold text-white">Processing your timetable...</span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
            </div>

            <p className="text-gray-300 text-sm">This usually takes just a few seconds...</p>
          </div>
        </div>
      )}

      {/* Enhanced Help Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/20">
          <AlertCircle className="h-5 w-5 text-cyan-400" />
          <span className="text-sm text-gray-300 font-medium">
            Maximum file size: <span className="text-purple-400 font-bold">10MB</span>
          </span>
        </div>

        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Upload your class schedule in any supported format. We'll automatically extract and organize your timetable
          data.
        </p>
      </div>
    </div>
  )
}

export default FileUploader
