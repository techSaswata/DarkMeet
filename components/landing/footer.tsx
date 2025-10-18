'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Mail, MapPin, Phone, Github, Twitter, Linkedin , ArrowRight} from 'lucide-react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'AI Assistant', href: '#ai' },
    { name: 'Security', href: '/security' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Enterprise', href: '/enterprise' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' }
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Compliance', href: '/compliance' }
  ]
}

const socialLinks = [
  { name: 'X', icon: Twitter, href: 'https://x.com/techSaswata' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/techsas' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/techsaswata/darkmeet' }
]

export function Footer() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Test Supabase connection on component mount
  React.useEffect(() => {
    const testSupabaseConnection = async () => {
      const supabase = createSupabaseClient()
      if (supabase) {
        console.log('Supabase client created successfully')
        // Test if we can access the contact_messages table
        const { data, error } = await supabase
          .from('contact_messages')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error('Supabase table access error:', error)
        } else {
          console.log('Supabase table accessible:', data)
        }
      } else {
        console.error('Failed to create Supabase client')
      }
    }
    
    testSupabaseConnection()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const supabase = createSupabaseClient()
      
      if (!supabase) {
        throw new Error('Supabase not configured. Please check your environment variables.')
      }

      console.log('Attempting to save message:', formData)

      // Insert contact message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            message: formData.message,
            status: 'unread'
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Message saved to Supabase:', data)
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      })
      
      // Success notification
      alert('Message sent successfully! We\'ll get back to you soon.')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to send message: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Video className="h-8 w-8 text-neon-blue" />
                <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-lg"></div>
              </div>
              <span className="text-2xl font-bold gradient-text">DarkMeet</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              The future of video conferencing with AI-powered features, 
              stunning dark UI, and seamless collaboration tools.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-neon-blue" />
                <span>hello@darkmeet.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-neon-purple" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-neon-pink" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

        {/* Contact Form Section */}
        <div className='lg:col-span-2'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="glass-dark rounded-2xl p-6 text-center">
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white mb-3'>Get in <span className='gradient-text'>Touch</span></h2>
                <p className="text-gray-300 text-sm max-w-sm mx-auto">
                  We'd love to hear from you. Send us a message.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="group text-left"
                  >
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input 
                      id="firstName"
                      name="firstName" 
                      type="text" 
                      required 
                      autoComplete="off" 
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-dark w-full border border-gray-600"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="group text-left"
                  >
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input 
                      id="lastName"
                      name="lastName" 
                      type="text" 
                      required 
                      autoComplete="off" 
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-dark w-full border border-gray-600"
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="group text-left"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input 
                    id="email"
                    name="email" 
                    type="email" 
                    required 
                    autoComplete="off" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-dark w-full border border-gray-600"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group text-left"
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="input-dark w-full resize-none border border-gray-600"
                  />
                </motion.div>

                <motion.button 
                  type="submit"
                  disabled={isSubmitting}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  viewport={{ once: true }}
                  className={`btn-primary w-full px-6 py-3 flex items-center justify-center space-x-2 group ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />}
                </motion.button>
              </form>
            </div>
          </motion.div>
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