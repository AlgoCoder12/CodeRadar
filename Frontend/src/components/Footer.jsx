"use client"
import { Link } from "react-router-dom"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: "Contest Info", href: "/contestinfo" },
      { name: "Problem of the Day", href: "/potd" },
      { name: "Time Table", href: "/timetable" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" },
    ],
  }

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/coderadar" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/coderadar" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/coderadar" },
    { name: "Email", icon: Mail, href: "mailto:hello@coderadar.com" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 border-t border-white/10 overflow-hidden">
      {/* Background floating blur circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-float-slow" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/20 blur-2xl rounded-full animate-pulse-slow" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* BOX STRUCTURE */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/LOGO.png.png" alt="Logo" className="h-10 w-10 rounded-full" />
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text tracking-wide">
                Code Radar
              </h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm font-light">
              One stop for all your coding needs – contests, problem practice, and academic planning.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center md:text-left mb-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-semibold text-lg mb-4 relative">
                  {title}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mt-1" />
                </h4>
                <ul className="space-y-2">
                  {links.map(({ name, href }) => (
                    <li key={name}>
                      <Link
                        to={href}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mb-10">
            {socialLinks.map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label={name}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <span>© {currentYear} CodeRadar. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current mx-1" />
              <span>for coders worldwide.</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-white transition">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-white transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.1);
          }
        }
        .animate-float-slow {
          animation: float-slow 16s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}
