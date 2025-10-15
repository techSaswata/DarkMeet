'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  BarChart3, 
  FileText,
  Search,
  Filter,
  Play,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Meeting {
  id: string
  title: string
  participants: number
  duration?: string
  date: string
  time: string
  status: 'completed' | 'scheduled'
  room_id?: string
}

interface Recording {
  id: string
  title: string
  duration: string
  date: string
  size: string
  transcription: boolean
}

interface UserStats {
  totalMeetings: number
  totalHours: number
  totalParticipants: number
  satisfaction: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'scheduled' | 'recordings'>('recent')
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([])
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([])
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalMeetings: 0,
    totalHours: 0,
    totalParticipants: 0,
    satisfaction: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const supabase = createSupabaseClient()
      if (!supabase) {
        setLoading(false)
        return
      }

      // TODO: Implement real data fetching from Supabase
      // For now, show empty state
      setRecentMeetings([])
      setScheduledMeetings([])
      setRecordings([])
      setUserStats({
        totalMeetings: 0,
        totalHours: 0,
        totalParticipants: 0,
        satisfaction: 0
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="spinner mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Loading Dashboard</h2>
          <p className="text-gray-400">Preparing your meeting data...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-neon-blue" />
              <span className="text-xl font-bold gradient-text">DarkMeet</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className='flex items-center justify-center'>
                <Link href="/meeting/new" className="btn-primary flex items-center">
                <Plus className=" h-4 w-4 mr-2" />
                New Meeting
              </Link>
              </div>
              
              <button className="toolbar-button">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Manage your meetings and explore AI-powered insights.</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-dark rounded-2xl p-6 text-center hover:neon-glow-blue transition-all duration-300">
            <Video className="h-8 w-8 text-neon-blue mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalMeetings}</div>
            <div className="text-sm text-gray-400">Total Meetings</div>
          </div>

          <div className="glass-dark rounded-2xl p-6 text-center hover:neon-glow-purple transition-all duration-300">
            <Clock className="h-8 w-8 text-neon-purple mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalHours}h</div>
            <div className="text-sm text-gray-400">Meeting Time</div>
          </div>

          <div className="glass-dark rounded-2xl p-6 text-center hover:neon-glow-pink transition-all duration-300">
            <Users className="h-8 w-8 text-neon-pink mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalParticipants}</div>
            <div className="text-sm text-gray-400">Participants</div>
          </div>

          <div className="glass-dark rounded-2xl p-6 text-center hover:neon-glow-green transition-all duration-300">
            <BarChart3 className="h-8 w-8 text-neon-green mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{userStats.satisfaction}%</div>
            <div className="text-sm text-gray-400">Satisfaction</div>
          </div>
        </motion.div>

        {/* Meetings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-6"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'recent'
                    ? 'bg-neon-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'scheduled'
                    ? 'bg-neon-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setActiveTab('recordings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'recordings'
                    ? 'bg-neon-pink text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Recordings
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  className="input-dark pl-10 w-64"
                />
              </div>
              <button className="toolbar-button">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Recent Meetings */}
            {activeTab === 'recent' && (
              <>
                {recentMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No recent meetings</h3>
                    <p className="text-gray-500 mb-6">Start your first meeting to see it here</p>
                    <div className='inline-block'>
                      <Link href="/meeting/new" className="btn-primary flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Link>
                    </div>
                  </div>
                ) : (
                  recentMeetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{meeting.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{meeting.date} at {meeting.time}</span>
                              <span>{meeting.participants} participants</span>
                              <span>{meeting.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="btn-secondary">View Details</button>
                          <button className="toolbar-button">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {/* Scheduled Meetings */}
            {activeTab === 'scheduled' && (
              <>
                {scheduledMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No scheduled meetings</h3>
                    <p className="text-gray-500 mb-6">Schedule a meeting to see it here</p>
                    <div className='inline-block'>
                      <Link href="/meeting/new" className="btn-primary flex justify-center items-center btn-primary">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Link>
                    </div>
                  </div>
                ) : (
                  scheduledMeetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{meeting.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{meeting.date} at {meeting.time}</span>
                              <span>{meeting.participants} participants</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/meeting/${meeting.room_id}`)}
                            className="btn-primary"
                          >
                            Join Meeting
                          </button>
                          <button className="btn-secondary">Edit</button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {/* Recordings */}
            {activeTab === 'recordings' && (
              <>
                {recordings.length === 0 ? (
                  <div className="text-center py-12">
                    <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No recordings</h3>
                    <p className="text-gray-500 mb-6">Enable recording in your meetings to see them here</p>
                    <div className='inline-block'>
                      <Link href="/meeting/new" className="flex justify-center items-center btn-primary">
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </Link>
                    </div>
                  </div>
                ) : (
                  recordings.map((recording, index) => (
                    <motion.div
                      key={recording.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-pink to-neon-green flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{recording.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{recording.date}</span>
                              <span>{recording.duration}</span>
                              <span>{recording.size}</span>
                              {recording.transcription && (
                                <span className="text-neon-green">● Transcribed</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="btn-secondary">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </button>
                          <button className="toolbar-button">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
} 