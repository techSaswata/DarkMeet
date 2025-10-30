'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah',
    role: 'Product Manager at TechCorp',
    avatar: '👩‍💼',
    rating: 5,
    content: 'DarkMeet has revolutionized our remote meetings. The AI features are incredible - it actually understands context and provides meaningful insights. The dark UI is easy on the eyes during long sessions.'
  },
  {
    name: 'Ravi',
    role: 'CEO at StartupXYZ',
    avatar: '👨‍💼',
    rating: 4,
    content: 'The AI meeting summaries save us hours every week. No more manual note-taking! The voice commands feature is a game-changer for presentations. Highly recommend for any serious business.'
  },
  {
    name: 'Emily',
    role: 'Research Director',
    avatar: '👩‍🔬',
    rating: 5,
    content: 'As someone who conducts international research collaborations, the real-time translation feature is phenomenal. The quality is better than any other platform I\'ve used.'
  },
  {
    name: 'Raj',
    role: 'Design Lead at CreativeStudio',
    avatar: '👨‍🎨',
    rating: 4.3,
    content: 'The AI whiteboard is absolutely mind-blowing. I can sketch rough ideas and it converts them into professional diagrams instantly. It\'s like having a design assistant in every meeting.'
  },
  {
    name: 'Aadrita',
    role: 'HR Director',
    avatar: '👩‍💻',
    rating: 4.9,
    content: 'The emotion analytics help us understand team dynamics better. We can see engagement levels and adjust our meeting styles accordingly. It\'s made our team more connected.'
  },
  {
    name: 'Vikram',
    role: 'CTO at DataFlow',
    avatar: '👨‍💻',
    rating: 5,
    content: 'Security and performance are top-notch. The platform handles our 500+ person all-hands meetings flawlessly. The enterprise features give us complete control and peace of mind.'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">What Our</span>{' '}
            <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders and professionals 
            are saying about their DarkMeet experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-dark rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:neon-glow-purple hover:scale-105">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: Math.max(0, Math.min(5, Math.floor(Number(testimonial?.rating) ?? 0))) }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-neon-yellow fill-current" />
                  ))}
                </div>

                <div className="relative mb-6 flex-1 ">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-neon-blue/30" />
                  <p className="text-gray-300 leading-relaxed pl-6">
                    {testimonial.content}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:gradient-text transition-all duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 