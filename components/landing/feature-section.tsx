'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  MessageSquare, 
  Share2, 
  Shield, 
  Zap, 
  Users, 
  Camera, 
  Mic,
  Globe,
  Sparkles,
  Bot,
  Palette,
  Clock,
  Heart
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Meeting Assistant',
    description: 'Gemini-powered AI that takes notes, generates summaries, and answers questions in real-time.',
    color: 'neon-blue',
    gradient: 'from-neon-blue to-neon-purple'
  },
  {
    icon: MessageSquare,
    title: 'Live Translation',
    description: 'Real-time translation and subtitles in 100+ languages powered by advanced AI.',
    color: 'neon-purple',
    gradient: 'from-neon-purple to-neon-pink'
  },
  {
    icon: Palette,
    title: 'AI Whiteboard',
    description: 'Sketch ideas and watch AI convert them into professional diagrams and flowcharts.',
    color: 'neon-pink',
    gradient: 'from-neon-pink to-neon-green'
  },
  {
    icon: Bot,
    title: 'Voice Commands',
    description: 'Control your meeting with natural voice commands - "Start recording", "Mute everyone".',
    color: 'neon-green',
    gradient: 'from-neon-green to-neon-cyan'
  },
  {
    icon: Heart,
    title: 'Emotion Analytics',
    description: 'AI-powered sentiment analysis and engagement tracking for better meeting insights.',
    color: 'neon-cyan',
    gradient: 'from-neon-cyan to-neon-blue'
  },
  {
    icon: Clock,
    title: 'Time Capsule',
    description: 'AI highlights key moments in recordings for quick navigation and review.',
    color: 'neon-yellow',
    gradient: 'from-neon-yellow to-neon-orange'
  }
]

const standardFeatures = [
  {
    icon: Camera,
    title: 'HD Video Quality',
    description: '4K video with advanced noise suppression and virtual backgrounds.'
  },
  {
    icon: Share2,
    title: 'Screen Sharing',
    description: 'Share your screen, specific windows, or applications with crystal clarity.'
  },
  {
    icon: Users,
    title: 'Breakout Rooms',
    description: 'Create and manage breakout rooms with AI-powered participant matching.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, waiting rooms, and advanced security controls.'
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Lightning-fast connections worldwide with 99.9% uptime guarantee.'
  },
  {
    icon: Zap,
    title: 'Instant Join',
    description: 'One-click meeting join with no downloads or installations required.'
  }
]

export function FeatureSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full px-6 py-3 mb-6 glass-dark">
            <Sparkles className="h-5 w-5 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Features</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Revolutionary</span>{' '}
            <span className="text-white">AI Features</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of video conferencing with cutting-edge AI capabilities 
            that make every meeting smarter, more productive, and engaging.
          </p>
        </motion.div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-dark rounded-2xl p-8 h-full transition-all duration-300 hover:scale-105 hover:neon-glow-blue">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Standard Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">All the</span>{' '}
            <span className="gradient-text">Essentials</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every feature you expect from a world-class video conferencing platform, 
            enhanced with our signature dark aesthetic and performance optimizations.
          </p>
        </motion.div>

        {/* Standard Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standardFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-dark rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-neon-blue group-hover:to-neon-purple transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 