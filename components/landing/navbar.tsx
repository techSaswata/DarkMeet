'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Menu, X, Sparkles, Users, Brain } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Video className="h-8 w-8 text-neon-blue group-hover:text-neon-purple transition-colors duration-300" />
              <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-lg group-hover:bg-neon-purple/20 transition-colors duration-300"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">DarkMeet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-neon-purple transition-colors duration-300 flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link href="#ai" className="text-gray-300 hover:text-neon-pink transition-colors duration-300 flex items-center space-x-1">
              <Brain className="h-4 w-4" />
              <span>AI Features</span>
            </Link>
            <Link href="/auth" className="btn-secondary">
              Sign In
            </Link>
            <Link href="/meeting/new" className="btn-primary">
              Start Meeting
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-dark rounded-2xl mt-2 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Features</span>
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-neon-purple transition-colors duration-300 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link href="#ai" className="text-gray-300 hover:text-neon-pink transition-colors duration-300 flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Features</span>
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Link href="/auth" className="btn-secondary text-center">
                  Sign In
                </Link>
                <Link href="/meeting/new" className="btn-primary text-center">
                  Start Meeting
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
} 