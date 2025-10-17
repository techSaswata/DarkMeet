'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createSupabaseClient()
      
      if (!supabase) {
        toast.error('Authentication service not configured')
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(error.message)
      } else {
        setEmailSent(true)
        toast.success('Password reset email sent!')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
              <Video className="h-8 w-8 text-neon-blue group-hover:text-neon-purple transition-colors duration-300" />
              <span className="text-2xl font-bold gradient-text">DarkMeet</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </h1>
            <p className="text-gray-400">
              {emailSent 
                ? 'We\'ve sent a password reset link to your email address'
                : 'Enter your email address and we\'ll send you a link to reset your password'
              }
            </p>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-dark rounded-2xl p-8"
          >
            {emailSent ? (
              /* Success State */
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <CheckCircle className="h-16 w-16 text-neon-blue" />
                </motion.div>
                
                <div className="space-y-4">
                  <p className="text-white">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-neon-blue font-medium break-all">
                    {email}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click the link in the email to reset your password. 
                    If you don't see it, check your spam folder.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/auth"
                    className="btn-primary w-full flex items-center justify-center space-x-2 group"
                  >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Sign In</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setEmailSent(false)
                      setEmail('')
                    }}
                    className="btn-secondary w-full"
                  >
                    Try Different Email
                  </button>
                </div>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-dark pl-10 w-full"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            {!emailSent && (
              <div className="mt-6 text-center">
                <Link 
                  href="/auth"
                  className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}