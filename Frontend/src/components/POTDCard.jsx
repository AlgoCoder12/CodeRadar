const POTDCard = ({ potd, index }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const platform = platformInfo[potd.platform] || {
    color: "from-gray-500 to-gray-600",
    bgGradient: "from-gray-500/20 to-gray-600/10",
    icon: "⚪",
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
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {potd.logo ? (
              <img
                src={potd.logo}
                alt={`${potd.platform} logo`}
                className="w-7 h-7 object-contain rounded"
              />
            ) : (
              <span className="text-2xl">{platform.icon}</span>
            )}
            <span className="text-sm font-medium text-purple-400">{potd.platform}</span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(potd.difficulty)}`}>
              {potd.difficulty || "Unknown"}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {potd?.title}
          </h2>
        </div>
      </div>

      {/* Tags */}
      {potd.tags && potd.tags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-400">Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {potd.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-gray-300 hover:bg-white/20 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <Clock className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs text-gray-400">Estimated Time</p>
            <p className="text-sm font-semibold text-white">{getEstimatedTime(potd.points)}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleSolveClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
        >
          <Code className="h-5 w-5" />
          <span>Solve Problem</span>
          <ExternalLink className="h-4 w-4" />
        </button>

        {!user && (
          <p className="text-xs text-gray-400">
            <span className="text-purple-400">Login required</span> to solve
          </p>
        )}
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${platform.bgGradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
      ></div>
    </div>
  )
}
