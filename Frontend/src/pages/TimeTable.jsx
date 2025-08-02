"use client"

import { useState } from "react"
import { Loader2, Upload, FileText, X, Check, AlertCircle } from "lucide-react"
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 backdrop-blur-xl ${
          isDragOver
            ? "border-purple-500 bg-purple-500/10 scale-105"
            : selectedFile
              ? "border-green-500/50 bg-green-500/5"
              : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
        } ${loading ? "pointer-events-none opacity-50" : "hover:scale-[1.02]"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated Background Effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
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
          <div className="space-y-6">
            {/* Icon Section */}
            <div className="flex justify-center">
              {loading ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                    <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-md opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-green-500/30">
                    <Check className="h-12 w-12 text-green-400" />
                  </div>
                </div>
              ) : isDragOver ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-purple-500/30">
                    <Upload className="h-12 w-12 text-purple-400" />
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20 group-hover:border-purple-500/30 transition-all duration-300">
                    <FileText className="h-12 w-12 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Text Section */}
            <div className="space-y-2">
              {loading ? (
                <>
                  <p className="text-xl font-bold text-white">Processing your file...</p>
                  <p className="text-gray-300">Please wait while we upload your timetable</p>
                </>
              ) : selectedFile ? (
                <>
                  <p className="text-xl font-bold text-green-400">File Ready to Upload!</p>
                  <p className="text-gray-300">Click upload to process your timetable</p>
                </>
              ) : isDragOver ? (
                <>
                  <p className="text-xl font-bold text-purple-400">Drop it like it's hot! 🔥</p>
                  <p className="text-gray-300">Release to select your timetable file</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-white">Drop your timetable here</p>
                  <p className="text-gray-300">or click to browse files</p>
                </>
              )}
            </div>

            {/* Supported Formats */}
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">PDF</span>
              <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">DOC</span>
              <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">DOCX</span>
              <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20">Images</span>
            </div>
          </div>
        </label>
      </div>

      {/* Selected File Info */}
      {selectedFile && !loading && (
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              <div>
                <p className="font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onUpload(selectedFile)}
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Timetable</span>
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-semibold rounded-lg transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="text-white font-medium">Processing your timetable...</span>
          </div>
          <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
          <AlertCircle className="h-4 w-4" />
          <span>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</span>
        </div>
      </div>
    </div>
  )
}

export default FileUploader
