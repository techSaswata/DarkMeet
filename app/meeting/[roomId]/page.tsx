'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { MeetingRoom } from '@/components/meeting/meeting-room'
import { MeetingControls } from '@/components/meeting/meeting-controls'
import { ChatPanel } from '@/components/meeting/chat-panel'
import { ParticipantsPanel } from '@/components/meeting/participants-panel'
import { AIAssistant } from '@/components/meeting/ai-assistant'
import { Whiteboard } from '@/components/meeting/whiteboard'
import { ScreenShare } from '@/components/meeting/screen-share'
import { BreakoutRooms } from '@/components/meeting/breakout-rooms'
import { Recording } from '@/components/meeting/recording'
import { createSupabaseClient } from '@/lib/supabase'
import { Video, User, ArrowRight, Mic, MicOff, VideoOff, AlertCircle } from 'lucide-react'
// LiveKit imports
import { Room, RoomEvent, Participant as LiveKitParticipant, RemoteTrackPublication, Track } from 'livekit-client'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'notRequested'>('notRequested')
  const [liveKitRoom, setLiveKitRoom] = useState<Room | null>(null)
  
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
  const [isBreakoutRoomsOpen, setIsBreakoutRoomsOpen] = useState(false)
  const [isRecordingOpen, setIsRecordingOpen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentUserId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  // Request camera permission with enhanced error handling and HD quality
  const requestCameraPermission = async () => {
    try {
      setCameraPermission('prompt')
      
      const videoConstraints = {
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 },
        facingMode: 'user'
      }
      
      // Enhanced audio constraints for noise suppression
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: videoConstraints,
        audio: audioConstraints
      })
      
      if (mediaStream.getAudioTracks().length > 0) {
        const audioTrack = mediaStream.getAudioTracks()[0]
        const settings = audioTrack.getSettings()
        console.log('Audio settings:', settings)
        
        // Enable noise suppression on the track
        if (audioTrack.getCapabilities) {
          const capabilities = audioTrack.getCapabilities()
          console.log('Audio capabilities:', capabilities)
        }
      }
      
      setStream(mediaStream)
      setCameraPermission('granted')
      
      // Attach stream to video element if available
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      return mediaStream
    } catch (error: any) {
      console.error('Camera permission denied:', error)
      setCameraPermission('denied')
      // Set video to disabled if permission is denied
      setIsVideoEnabled(false)
      
      // Show specific error messages based on the error type
      let errorMessage = 'Camera access was denied. You can still join the meeting but others won\'t see your video.'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access was blocked. Please allow camera access in your browser settings and try again.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera device and try again.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application. Please close other applications using the camera and try again.'
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Your camera does not support the required video constraints. Please try a different camera.'
      }
      
      // Show error message to user
      alert(errorMessage)
      
      return null
    }
  }

  // Connect to LiveKit room with enhanced quality settings
  const connectToLiveKit = async (token: string) => {
    try {
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: {
            width: 1920,
            height: 1080,
          },
        },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Set up event listeners
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
      room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged)
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected)
      room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)

      // Connect to the room
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token)
      setLiveKitRoom(room)

      // Publish local tracks if we have them
      if (stream) {
        await room.localParticipant.enableCameraAndMicrophone()
        await room.localParticipant.setCameraEnabled(isVideoEnabled)
        await room.localParticipant.setMicrophoneEnabled(!isMuted)
      }

      return room
    } catch (error) {
      console.error('Error connecting to LiveKit:', error)
      return null
    }
  }

  // Handle track subscribed
  const handleTrackSubscribed = (
    track: Track,
    publication: RemoteTrackPublication,
    participant: LiveKitParticipant
  ) => {
    // Handle incoming tracks
    console.log('Track subscribed:', track, publication, participant)
  }

  // Handle track unsubscribed
  const handleTrackUnsubscribed = (
    track: Track,
    publication: RemoteTrackPublication,
    participant: LiveKitParticipant
  ) => {
    // Handle track removal
    console.log('Track unsubscribed:', track, publication, participant)
  }

  // Handle active speakers change
  const handleActiveSpeakersChanged = (speakers: LiveKitParticipant[]) => {
    // Handle active speakers change
    console.log('Active speakers changed:', speakers)
  }

  // Handle participant connected
  const handleParticipantConnected = (participant: LiveKitParticipant) => {
    console.log('Participant connected:', participant)
    // Update participants list
    setParticipants(prev => {
      const exists = prev.find(p => p.id === participant.identity)
      if (exists) return prev
      return [...prev, {
        id: participant.identity,
        name: participant.name || participant.identity,
        isHost: false, // Would need to determine this from your app logic
        isMuted: participant.isMicrophoneEnabled === false,
        isVideoEnabled: participant.isCameraEnabled === true
      }]
    })
  }

  // Handle participant disconnected
  const handleParticipantDisconnected = (participant: LiveKitParticipant) => {
    console.log('Participant disconnected:', participant)
    // Remove participant from list
    setParticipants(prev => prev.filter(p => p.id !== participant.identity))
  }

  // Get LiveKit token from your backend
  const getLiveKitToken = async (): Promise<string> => {
    // In a real implementation, this would call your backend to get a token
    // For now, we'll return a placeholder - you would implement this with your backend
    try {
      const response = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room: roomId,
          username: userName,
          userId: currentUserId,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get token')
      }
      
      const data = await response.json()
      return data.token
    } catch (error) {
      console.error('Error getting LiveKit token:', error)
      throw error
    }
  }

  const handleJoinMeeting = async () => {
    if (!userName.trim()) {
      alert('Please enter your name')
      return
    }

    // Request camera permission before joining
    const stream = await requestCameraPermission()
    if (cameraPermission === 'denied') {
      const shouldContinue = confirm('Camera access was denied. You can still join the meeting but others won\'t see your video. Do you want to continue?')
      if (!shouldContinue) {
        return
      }
    }

    setIsJoining(true)

    try {
      // Get LiveKit token and connect
      const token = await getLiveKitToken()
      const room = await connectToLiveKit(token)
      
      if (!room) {
        throw new Error('Failed to connect to LiveKit')
      }

      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasJoined(true)
    } catch (error) {
      console.error('Error joining meeting:', error)
      alert('Failed to join meeting. Please try again.')
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
            isVideoEnabled: cameraPermission === 'granted' // Only enable video if permission was granted
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
          isVideoEnabled: cameraPermission === 'granted' // Only enable video if permission was granted
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
            is_video_enabled: cameraPermission === 'granted', // Only enable video if permission was granted
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
            
            // Disconnect from LiveKit room
            if (liveKitRoom) {
              liveKitRoom.disconnect()
            }
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
            isVideoEnabled: cameraPermission === 'granted' // Only enable video if permission was granted
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
      
      // Stop all tracks in the stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      
      // Disconnect from LiveKit room
      if (liveKitRoom) {
        liveKitRoom.disconnect()
      }
    }
  }, [roomId, currentUserId, userName, hasJoined, stream, cameraPermission, liveKitRoom]) // Added liveKitRoom

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
    
    // Update LiveKit status
    if (liveKitRoom) {
      liveKitRoom.localParticipant.setMicrophoneEnabled(!isMuted)
      liveKitRoom.localParticipant.setCameraEnabled(isVideoEnabled)
    }
  }, [isMuted, isVideoEnabled, hasJoined, isConnected, roomId, currentUserId, liveKitRoom])

  // Toggle video functionality with permission handling
  const handleToggleVideo = async () => {
    if (!isVideoEnabled) {
      // Trying to enable video, check if we have permission
      if (cameraPermission === 'denied') {
        // Request permission again
        const stream = await requestCameraPermission()
        if (stream) {
          setIsVideoEnabled(true)
        }
      } else if (cameraPermission === 'granted' && stream) {
        setIsVideoEnabled(true)
      } else {
        // Request permission for the first time
        const stream = await requestCameraPermission()
        if (stream) {
          setIsVideoEnabled(true)
        }
      }
    } else {
      // Disable video
      setIsVideoEnabled(false)
    }
    
    // Update LiveKit status
    if (liveKitRoom) {
      liveKitRoom.localParticipant.setCameraEnabled(!isVideoEnabled)
    }
  }

  // Toggle mute functionality
  const handleToggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    
    // Update LiveKit status
    if (liveKitRoom) {
      liveKitRoom.localParticipant.setMicrophoneEnabled(!newMutedState)
    }
  }

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
            <div className="video-container mb-6 bg-gradient-to-br from-dark-800 to-dark-900 relative">
              <div className="w-full h-full flex items-center justify-center relative">
                {isVideoEnabled && cameraPermission === 'granted' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      muted 
                      playsInline
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <p className="text-white font-medium mt-2">{userName || 'Your Name'}</p>
                  </div>
                ) : isVideoEnabled && cameraPermission === 'denied' ? (
                  <div className="text-center p-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <p className="text-red-400 mb-2">Camera access denied</p>
                    <p className="text-gray-400 text-sm">Click the video button to try again</p>
                  </div>
                ) : isVideoEnabled && cameraPermission === 'prompt' ? (
                  <div className="text-center">
                    <div className="spinner mb-2"></div>
                    <p className="text-gray-400">Requesting camera access...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Camera off</p>
                  </div>
                )}

                {/* Camera permission status indicator */}
                {cameraPermission === 'denied' && (
                  <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                    Access denied
                  </div>
                )}
                {cameraPermission === 'granted' && (
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                    Access granted
                  </div>
                )}

                {/* Controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={handleToggleMute}
                    className={`toolbar-button ${isMuted ? 'danger' : 'active'}`}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleToggleVideo}
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
                <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
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

            {/* Permission Status */}
            {cameraPermission === 'denied' && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-medium text-sm">Camera access denied</p>
                    <p className="text-red-400 text-xs mt-1">
                      You can still join the meeting but others won't see your video. 
                      To enable video:
                    </p>
                    <ul className="text-red-400 text-xs mt-1 list-disc list-inside">
                      <li>Click the camera button to retry</li>
                      <li>Check your browser permissions</li>
                      <li>Ensure no other app is using your camera</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

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
            <ScreenShare 
              onClose={() => setIsScreenSharing(false)} 
              room={liveKitRoom}
              isSharing={isScreenSharing}
              sharerName="You"
            />
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
                currentUserId={currentUserId}
                currentUserName={userName}
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
                currentUserId={currentUserId}
                roomId={roomId}
              />
            </motion.div>
          )}

          {/* Breakout Rooms Panel */}
          {isBreakoutRoomsOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96"
            >
              <BreakoutRooms
                roomId={roomId}
                onClose={() => setIsBreakoutRoomsOpen(false)}
                currentUserId={currentUserId}
                participants={participants}
              />
            </motion.div>
          )}

          {/* Recording Panel */}
          {isRecordingOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96"
            >
              <Recording
                roomId={roomId}
                onClose={() => setIsRecordingOpen(false)}
                isRecording={isRecording}
                onStartRecording={() => setIsRecording(true)}
                onStopRecording={() => setIsRecording(false)}
                participants={participants}
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
        isBreakoutRoomsOpen={isBreakoutRoomsOpen}
        isRecordingOpen={isRecordingOpen}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onToggleAI={() => setIsAIOpen(!isAIOpen)}
        onToggleWhiteboard={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
        onToggleBreakoutRooms={() => setIsBreakoutRoomsOpen(!isBreakoutRoomsOpen)}
        onToggleRecordingPanel={() => setIsRecordingOpen(!isRecordingOpen)}
        roomId={roomId}
      />
    </div>
  )
}