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

  useEffect(() => {
    // Simulate connection and add current user as participant
    const timer = setTimeout(() => {
      setIsConnected(true)
      // Add current user as the first participant (host)
      setParticipants([
        { 
          id: 'current-user', 
          name: 'You', 
          isHost: true, 
          isMuted: false, 
          isVideoEnabled: true 
        }
      ])
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

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