

const GlowingOrbs = () => {
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

export default GlowingOrbs;