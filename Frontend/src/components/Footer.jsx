"use client"
import { Link } from "react-router-dom"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Contest Info", href: "/contestinfo" },
      { name: "Problem of the Day", href: "/potd" },
      { name: "Time Table", href: "/timetable" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
    resources: [
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
    <footer className="relative z-10 border-t border-white/10 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/LOGO.png.png" alt="CodeRadar Logo" className="h-10 w-auto" />
              <span className="tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono font-bold text-xl">
                Code Radar
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Your complete coding companion. Track contests, solve daily problems, and manage your academic schedule
              all in one place. Master competitive programming while staying organized.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Get the latest contest updates and coding tips delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-r-lg transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>© {currentYear} CodeRadar. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for developers worldwide.</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
