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

  useEffect(() => {
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
      
      try {
        const supabase = createSupabaseClient()
        if (!supabase) {
          console.log('Supabase not available, using mock data')
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
          return
        }

        // Generate a display name (in real app, this would come from auth)
        const displayName = `User ${Math.floor(Math.random() * 1000)}`
        console.log('Generated display name:', displayName)
        
        // Add current user to participants
        const { error: insertError } = await supabase
          .from('meeting_participants')
          .insert({
            room_id: roomId,
            user_id: currentUserId,
            display_name: displayName,
            is_host: true, // First user is host (simplified logic)
            is_muted: false,
            is_video_enabled: true,
            joined_at: new Date().toISOString()
          })

        if (insertError) {
          console.log('Insert error (table might not exist):', insertError.message)
          // Fallback to mock data but still connect
          setParticipants([
            { 
              id: currentUserId, 
              name: displayName, 
              isHost: true, 
              isMuted: false, 
              isVideoEnabled: true 
            }
          ])
          setIsConnected(true)
        } else {
          console.log('Successfully inserted participant into database')
          
          // Subscribe to real-time changes
          const subscription = supabase
            .channel('meeting-participants')
            .on('postgres_changes', 
              { 
                event: '*', 
                schema: 'public', 
                table: 'meeting_participants',
                filter: `room_id=eq.${roomId}`
              }, 
              (payload) => {
                console.log('Participant change:', payload)
                fetchParticipants(supabase)
              }
            )
            .subscribe()

          // Initial fetch
          await fetchParticipants(supabase)
          setIsConnected(true)

          // Cleanup function - return it properly
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
        // Always connect even if there are database issues
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
    }

    // Add a timeout to ensure meeting starts even if database is slow
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
    }, 5000) // 5 second timeout

    initializeMeeting().then((cleanup) => {
      clearTimeout(timeoutId)
      // Store cleanup function for later use
      if (cleanup) {
        // We'll handle cleanup in the useEffect return
      }
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
  }, [roomId, currentUserId, isConnected])

  // TODO: Implement real-time participant management with Supabase
  // TODO: Implement LiveKit integration for video/audio

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