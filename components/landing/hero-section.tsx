'use client'

import { motion } from 'framer-motion'
import { Video, Play, ArrowRight, Sparkles, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-neon-pink/20 to-neon-green/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full px-6 py-3 mb-6 glass-dark"
          >
            <Sparkles className="h-5 w-5 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Video Conferencing</span>
            <Zap className="h-5 w-5 text-neon-yellow" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">Dark</span>
            <span className="text-white">Meet</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of video conferencing with{' '}
            <span className="gradient-text-green font-semibold">AI-powered features</span>,{' '}
            stunning dark UI, and seamless collaboration tools that make every meeting extraordinary.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <Link href="/meeting/new" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group">
            <Video className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Start Meeting Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2 group">
            <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-gray-400 mb-8">
            Trusted by professionals worldwide for secure, AI-powered video conferencing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark rounded-2xl p-6 text-center group hover:neon-glow-blue transition-all duration-300">
              <div className="text-2xl font-bold gradient-text mb-2">Enterprise</div>
              <div className="text-gray-400">Grade Security</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-6 text-center group hover:neon-glow-purple transition-all duration-300">
              <div className="text-2xl font-bold gradient-text mb-2">AI-Powered</div>
              <div className="text-gray-400">Smart Features</div>
            </div>
            
            <div className="glass-dark rounded-2xl p-6 text-center group hover:neon-glow-pink transition-all duration-300">
              <div className="text-2xl font-bold gradient-text mb-2">Global</div>
              <div className="text-gray-400">Reliability</div>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 hidden lg:block"
        >
          <div className="glass-dark rounded-full p-4 neon-glow-blue">
            <Users className="h-6 w-6 text-neon-blue" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-10 hidden lg:block"
        >
          <div className="glass-dark rounded-full p-4 neon-glow-purple">
            <Sparkles className="h-6 w-6 text-neon-purple" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-20 hidden lg:block"
        >
          <div className="glass-dark rounded-full p-4 neon-glow-green">
            <Zap className="h-6 w-6 text-neon-green" />
          </div>
        </motion.div>
      </div>
    </section>
  )
} 