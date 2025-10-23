'use client'

import { motion } from 'framer-motion'
import { Video, Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react'
import X_Icons from '@/components/footer/x_icons'
import Link from 'next/link'

// Only include links that exist in the `app/` directory or safe anchors.
const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'AI Assistant', href: '#ai' }
  ],
  company: [
    // Keep only the main home and contact anchor (contact is an anchor on landing)
    { name: 'Home', href: '/' }
  ],
  resources: [
    // Keep Documentation as an external placeholder if needed, otherwise remove
  ],
  legal: [
    // Link to privacy and terms removed because pages don't exist in app/
  ]
}

const socialLinks = [
  { name: 'X', icon: X_Icons, href: 'https://x.com/techSaswata' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/techsas' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/techsaswata/darkmeet' }
]

export function Footer() {
  // When the user clicks the Home link while already on the home page,
  // perform a smooth scroll to top instead of navigating.
  const handleHomeClick = (e: any) => {
    if (typeof window === 'undefined') return
    try {
      if (window.location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      // ignore
    }
  }
  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content: brand left, link columns right on md+ */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          {/* Left: Brand + description + contact */}
          <div className="md:w-1/3">
            <Link href="/" onClick={handleHomeClick} className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Video className="h-8 w-8 text-neon-blue" />
                <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-lg" />
              </div>
              <span className="text-2xl font-bold gradient-text">DarkMeet</span>
            </Link>

            <p className="text-gray-300 mb-6 leading-relaxed">
              The future of video conferencing with AI-powered features, stunning dark UI, and seamless collaboration tools.
            </p>

            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-neon-blue" />
                <span>hello@darkmeet.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-neon-purple" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-neon-pink" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Right: three link columns in a single row on md+ */}
          <div className="md:w-2/3 flex flex-row justify-end gap-6">
            <div className="flex-1 px-2">
              <h3 className="text-white font-semibold mb-4">Quick links</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-neon-blue transition-colors duration-300">{link.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/meeting/new" className="text-gray-300 hover:text-neon-purple transition-colors duration-300">Start a meeting</Link>
                </li>
              </ul>
            </div>

            <div className="flex-1 px-2">
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} onClick={link.href === '/' ? handleHomeClick : undefined} className="text-gray-300 hover:text-neon-purple transition-colors duration-300">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 px-2">
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                
                <li>
                  <a href="https://github.com/techsaswata/darkmeet" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-neon-blue transition-colors duration-300">Project on GitHub</a>
                </li>
                <li>
                  <Link href="/meeting/new" className="text-gray-300 hover:text-neon-green transition-colors duration-300">Schedule a meeting</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 DarkMeet. Made with ❤️ by techsas
            </div>

            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 