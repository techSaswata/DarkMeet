'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { MeetingRoom } from '@/components/meeting/meeting-room'
import { MeetingControls } from '@/components/meeting/meeting-controls'
import { ChatPanel } from '@/components/meeting/chat-panel'
import { ParticipantsPanel } from '@/components/meeting/participants-panel'
import { AIAssistant } from '@/components/meeting/ai-assistant'
import { Whiteboard } from '@/components/meeting/whiteboard'
import { ScreenShare } from '@/components/meeting/screen-share'
import { createSupabaseClient } from '@/lib/supabase'
import { Video, User, ArrowRight, Mic, MicOff, VideoOff } from 'lucide-react'

interface Participant {
  id: string
  name: string
  isHost: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  avatar?: string
}

export default function MeetingRoomPage() {
  const params = useParams()
  const roomId = params.roomId as string
  
  // Pre-meeting states
  const [hasJoined, setHasJoined] = useState(false)
  const [userName, setUserName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  
  // Meeting states
  const [isConnected, setIsConnected] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentUserId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  const handleJoinMeeting = async () => {
    if (!userName.trim()) {
      alert('Please enter your name')
      return
    }

    setIsJoining(true)

    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasJoined(true)
    } catch (error) {
      console.error('Error joining meeting:', error)
      setIsJoining(false)
    }
  }

  useEffect(() => {
    // Only initialize meeting after user has joined
    if (!hasJoined || !userName.trim()) {
      return
    }

    const fetchParticipants = async (supabase: any) => {
      const { data, error } = await supabase
        .from('meeting_participants')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true })

      if (error) {
        console.error('Error fetching participants:', error)
      } else {
        const formattedParticipants = data.map((p: any) => ({
          id: p.user_id,
          name: p.user_id === currentUserId ? 'You' : p.display_name,
          isHost: p.is_host,
          isMuted: p.is_muted,
          isVideoEnabled: p.is_video_enabled
        }))
        setParticipants(formattedParticipants)
      }
    }

    const initializeMeeting = async () => {
      console.log('Initializing meeting for room:', roomId)
      console.log('Current user:', userName)
      
      try {
        const supabase = createSupabaseClient()
        if (!supabase) {
          console.log('Supabase not available, using mock data only')
          // When offline, check if this user might be the creator based on URL patterns or other logic
          // For now, default to non-host when offline since we can't verify
          const currentUser = {
            id: currentUserId,
            name: 'You',
            isHost: false, // Default to non-host when offline
            isMuted: false,
            isVideoEnabled: true
          }
          setParticipants([currentUser])
          setIsConnected(true)
          return
        }

        console.log('Adding user to database:', userName)
        
        // Check if this meeting was created by the current user
        // We'll need to check if there's a meeting record with this room_id and creator
        const { data: meetingData, error: meetingError } = await supabase
          .from('meetings')
          .select('*')
          .eq('room_id', roomId)
          .single()

        let isHost = false
        
        if (meetingError) {
          console.log('No meeting record found, checking participants for host determination')
          // Fallback: if no meeting record exists, check if there are any existing participants
          // This handles cases where meetings are created directly via URL
          const { data: existingParticipants, error: fetchError } = await supabase
            .from('meeting_participants')
            .select('*')
            .eq('room_id', roomId)

          if (fetchError) {
            console.log('Error checking existing participants:', fetchError.message)
          }

          // If no participants exist, this could be the creator joining their own meeting
          isHost = !existingParticipants || existingParticipants.length === 0
        } else {
          // Check if current user is the meeting creator
          const creatorId = localStorage.getItem(`meeting-creator-${roomId}`)
          isHost = meetingData.created_by === creatorId
          console.log('Meeting found. Creator:', meetingData.created_by, 'Stored creator ID:', creatorId, 'Is host:', isHost)
        }

        console.log('Host status determined:', isHost)

        // Immediately add current user to UI for instant feedback
        const currentUser = {
          id: currentUserId,
          name: 'You',
          isHost: isHost,
          isMuted: false,
          isVideoEnabled: true
        }
        setParticipants([currentUser])
        setIsConnected(true) // Connect immediately for better UX
        
        // Add current user to participants
        const { error: insertError } = await supabase
          .from('meeting_participants')
          .insert({
            room_id: roomId,
            user_id: currentUserId,
            display_name: userName,
            is_host: isHost, // Based on meeting creator, not join order
            is_muted: false, // Start with default values
            is_video_enabled: true,
            joined_at: new Date().toISOString()
          })

        if (insertError) {
          console.log('Insert error:', insertError.message)
          // UI already shows current user, so no need to update
        } else {
          console.log('Successfully added to database as', isHost ? 'host (meeting creator)' : 'participant')
          
          // Subscribe to real-time changes with optimized settings
          const subscription = supabase
            .channel(`meeting-${roomId}`, {
              config: {
                broadcast: { self: false }, // Don't receive own events
                presence: { key: currentUserId }
              }
            })
            .on('postgres_changes', 
              { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'meeting_participants',
                filter: `room_id=eq.${roomId}`
              }, 
              (payload) => {
                console.log('New participant joined:', payload.new)
                // Immediately add to UI without waiting for fetch
                const newParticipant = {
                  id: payload.new.user_id,
                  name: payload.new.user_id === currentUserId ? 'You' : payload.new.display_name,
                  isHost: payload.new.is_host,
                  isMuted: payload.new.is_muted,
                  isVideoEnabled: payload.new.is_video_enabled
                }
                setParticipants(prev => {
                  // Check if participant already exists
                  const exists = prev.find(p => p.id === newParticipant.id)
                  if (exists) return prev
                  return [...prev, newParticipant]
                })
              }
            )
            .on('postgres_changes', 
              { 
                event: 'DELETE', 
                schema: 'public', 
                table: 'meeting_participants',
                filter: `room_id=eq.${roomId}`
              }, 
              (payload) => {
                console.log('Participant left:', payload.old)
                // Immediately remove from UI
                setParticipants(prev => prev.filter(p => p.id !== payload.old.user_id))
              }
            )
            .on('postgres_changes', 
              { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'meeting_participants',
                filter: `room_id=eq.${roomId}`
              }, 
              (payload) => {
                console.log('Participant updated:', payload.new)
                // Update participant status immediately
                setParticipants(prev => prev.map(p => 
                  p.id === payload.new.user_id 
                    ? {
                        ...p,
                        isMuted: payload.new.is_muted,
                        isVideoEnabled: payload.new.is_video_enabled
                      }
                    : p
                ))
              }
            )
            .subscribe((status) => {
              console.log('Subscription status:', status)
            })

          // Fetch existing participants
          await fetchParticipants(supabase)

          // Cleanup function
          return () => {
            console.log('Cleaning up participant subscription')
            supabase
              .from('meeting_participants')
              .delete()
              .eq('room_id', roomId)
              .eq('user_id', currentUserId)
              .then(() => console.log('User removed from meeting'))
            
            subscription.unsubscribe()
          }
        }

      } catch (error) {
        console.error('Error initializing meeting:', error)
        // UI already shows current user, so we're good
      }
    }

    const timeoutId = setTimeout(() => {
      console.log('Meeting initialization timeout - connecting anyway')
      if (!isConnected) {
        setParticipants([
          { 
            id: currentUserId, 
            name: 'You', 
            isHost: true, 
            isMuted: false, 
            isVideoEnabled: true 
          }
        ])
        setIsConnected(true)
      }
    }, 3000) // Reduced to 3 seconds

    initializeMeeting().then((cleanup) => {
      clearTimeout(timeoutId)
    })

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId)
      const supabase = createSupabaseClient()
      if (supabase) {
        supabase
          .from('meeting_participants')
          .delete()
          .eq('room_id', roomId)
          .eq('user_id', currentUserId)
          .then(() => console.log('Cleanup: User removed from meeting'))
      }
    }
  }, [roomId, currentUserId, userName, hasJoined]) // Removed isMuted and isVideoEnabled

  // Separate effect to update current user's mic/video status
  useEffect(() => {
    if (!hasJoined || !isConnected) return

    // Update current user's status in the participants list immediately
    setParticipants(prev => prev.map(p => 
      p.id === currentUserId 
        ? { ...p, isMuted, isVideoEnabled }
        : p
    ))

    // Also update in database
    const updateStatus = async () => {
      try {
        const supabase = createSupabaseClient()
        if (!supabase) return

        const { error } = await supabase
          .from('meeting_participants')
          .update({
            is_muted: isMuted,
            is_video_enabled: isVideoEnabled
          })
          .eq('room_id', roomId)
          .eq('user_id', currentUserId)

        if (error) {
          console.log('Error updating status:', error.message)
        }
      } catch (error) {
        console.error('Error updating participant status:', error)
      }
    }

    updateStatus()
  }, [isMuted, isVideoEnabled, hasJoined, isConnected, roomId, currentUserId])

  // TODO: Implement real-time participant management with Supabase
  // TODO: Implement LiveKit integration for video/audio

  // Pre-meeting screen
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-900 to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Join Meeting</h1>
              <p className="text-gray-400">Room ID: {roomId}</p>
            </div>

            {/* Preview Area */}
            <div className="video-container mb-6 bg-gradient-to-br from-dark-800 to-dark-900 z-10">
              <div className="w-full h-full flex items-center justify-center relative">
                {isVideoEnabled ? (
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-2">
                        <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <p className="text-white font-medium mb-12 sm:mb-16 text-sm sm:text-base">{userName || 'Your Video'}</p>
                    </div>
                ) : (
                    <div className="text-center mb-16 sm:mb-20">
                    <VideoOff className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm sm:text-base">Camera off</p>
                    </div>
                )}

                {/* Controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`toolbar-button ${isMuted ? 'danger' : 'active'}`}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`toolbar-button ${!isVideoEnabled ? 'danger' : 'active'}`}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2 ">
                  Your Name
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-dark w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                  autoFocus
                />
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoinMeeting}
              disabled={isJoining || !userName.trim()}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? (
                <>
                  <div className="spinner-sm"></div>
                  <span>Joining Meeting...</span>
                </>
              ) : (
                <>
                  <Video className="h-5 w-5" />
                  <span>Join Meeting</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Meeting Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                By joining, you agree to our meeting guidelines
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="spinner mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Connecting to DarkMeet</h2>
          <p className="text-gray-400">Preparing your meeting room...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main Meeting Area */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <MeetingRoom
            roomId={roomId}
            isScreenSharing={isScreenSharing}
            participants={participants}
          />
          
          {/* Screen Share Overlay */}
          {isScreenSharing && (
            <ScreenShare onClose={() => setIsScreenSharing(false)} />
          )}
          
          {/* Whiteboard Overlay */}
          {isWhiteboardOpen && (
            <Whiteboard onClose={() => setIsWhiteboardOpen(false)} />
          )}
        </div>

        {/* Side Panels */}
        <div className="flex">
          {/* Chat Panel */}
          {isChatOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80"
            >
              <ChatPanel
                roomId={roomId}
                onClose={() => setIsChatOpen(false)}
              />
            </motion.div>
          )}

          {/* Participants Panel */}
          {isParticipantsOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80"
            >
              <ParticipantsPanel
                participants={participants}
                onClose={() => setIsParticipantsOpen(false)}
              />
            </motion.div>
          )}

          {/* AI Assistant Panel */}
          {isAIOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96"
            >
              <AIAssistant
                roomId={roomId}
                onClose={() => setIsAIOpen(false)}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Meeting Controls */}
      <MeetingControls
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        isRecording={isRecording}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        isAIOpen={isAIOpen}
        isWhiteboardOpen={isWhiteboardOpen}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleWhiteboard={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
        roomId={roomId}
      />
    </div>
  )
} 