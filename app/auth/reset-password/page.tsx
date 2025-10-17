'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const [validSession, setValidSession] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseClient()
      if (!supabase) return

      // Check if we have a valid session from the reset link
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setValidSession(true)
      } else {
        // Try to get session from URL hash (for email confirmation)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (!error) {
            setValidSession(true)
          } else {
            toast.error('Invalid or expired reset link')
            router.push('/auth/forgot-password')
          }
        } else {
          toast.error('Invalid reset link')
          router.push('/auth/forgot-password')
        }
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const supabase = createSupabaseClient()
      
      if (!supabase) {
        toast.error('Authentication service not configured')
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(error.message)
      } else {
        setResetComplete(true)
        toast.success('Password updated successfully!')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
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
              {resetComplete ? 'Password Updated!' : 'Reset Your Password'}
            </h1>
            <p className="text-gray-400">
              {resetComplete 
                ? 'Your password has been successfully updated'
                : 'Enter your new password below'
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
            {resetComplete ? (
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
                    Your password has been successfully updated!
                  </p>
                  <p className="text-gray-400 text-sm">
                    You will be redirected to your dashboard shortly.
                  </p>
                </div>

                <Link 
                  href="/dashboard"
                  className="btn-primary w-full flex items-center justify-center space-x-2 group"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-dark pl-10 pr-10 w-full"
                      placeholder="Enter your new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-dark pl-10 w-full"
                      placeholder="Confirm your new password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li className={password.length >= 6 ? 'text-neon-blue' : ''}>
                      At least 6 characters long
                    </li>
                    <li className={password === confirmPassword && password.length > 0 ? 'text-neon-blue' : ''}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading || password !== confirmPassword || password.length < 6}
                  className="btn-primary w-full flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}