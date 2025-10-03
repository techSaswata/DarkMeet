'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Globe, Zap } from 'lucide-react'

interface Stat {
  icon: any
  value: string
  label: string
  description: string
}

export function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real stats from Supabase
    // For now, set default values
    setStats([
      {
        icon: Users,
        value: '100+',
        label: 'Active Users',
        description: 'Growing community'
      },
      {
        icon: Clock,
        value: '500+',
        label: 'Meeting Minutes',
        description: 'Hours of collaboration'
      },
      {
        icon: Globe,
        value: '180+',
        label: 'Countries',
        description: 'Global reach and availability'
      },
      {
        icon: Zap,
        value: '99.9%',
        label: 'Uptime',
        description: 'Enterprise-grade reliability'
      }
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-400">Loading statistics...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Join the</span>{' '}
            <span className="gradient-text">Future</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Be part of the next generation of video conferencing with AI-powered collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-dark rounded-2xl p-8 text-center transition-all duration-300 hover:neon-glow-blue hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                
                <div className="text-xl font-semibold text-white mb-3">
                  {stat.label}
                </div>
                
                <div className="text-gray-400">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 