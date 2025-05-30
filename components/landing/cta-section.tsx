'use client'

import { motion } from 'framer-motion'
import { Video, ArrowRight, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full px-6 py-3 mb-8 glass-dark">
            <Sparkles className="h-5 w-5 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">Ready to Transform Your Meetings?</span>
            <Zap className="h-5 w-5 text-neon-yellow" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Start Your</span>{' '}
            <span className="gradient-text">DarkMeet</span>{' '}
            <span className="text-white">Journey</span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join millions of professionals who have already discovered the future of video conferencing. 
            Experience AI-powered meetings, stunning visuals, and seamless collaboration today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link href="/meeting/new" className="btn-primary text-lg px-10 py-5 flex items-center space-x-3 group">
              <Video className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Start Free Meeting</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link href="/auth" className="btn-secondary text-lg px-10 py-5 flex items-center space-x-3 group">
              <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Create Account</span>
            </Link>
          </div>

          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text mb-2">Free Forever</div>
                <div className="text-gray-400">No credit card required</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text mb-2">Instant Setup</div>
                <div className="text-gray-400">Ready in 30 seconds</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text mb-2">24/7 Support</div>
                <div className="text-gray-400">We're here to help</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 