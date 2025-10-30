'use client'

import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share2, 
  MessageSquare, 
  Users, 
  Brain, 
  Palette, 
  Phone, 
  Settings,
  Circle,
  StopCircle,
  Users2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MeetingControlsProps {
  isMuted: boolean
  isVideoEnabled: boolean
  isRecording: boolean
  isScreenSharing: boolean
  isChatOpen: boolean
  isParticipantsOpen: boolean
  isAIOpen: boolean
  isWhiteboardOpen: boolean
  isBreakoutRoomsOpen: boolean
  isRecordingOpen: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onToggleRecording: () => void
  onToggleScreenShare: () => void
  onToggleChat: () => void
  onToggleParticipants: () => void
  onToggleAI: () => void
  onToggleWhiteboard: () => void
  onToggleBreakoutRooms: () => void
  onToggleRecordingPanel: () => void
  roomId: string
}

export function MeetingControls({
  isMuted,
  isVideoEnabled,
  isRecording,
  isScreenSharing,
  isChatOpen,
  isParticipantsOpen,
  isAIOpen,
  isWhiteboardOpen,
  isBreakoutRoomsOpen,
  isRecordingOpen,
  onToggleMute,
  onToggleVideo,
  onToggleRecording,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onToggleAI,
  onToggleWhiteboard,
  onToggleBreakoutRooms,
  onToggleRecordingPanel,
  roomId
}: MeetingControlsProps) {
  const router = useRouter()

  const handleEndMeeting = () => {
    router.push('/')
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
    >
      <div className="toolbar flex items-center justify-center">
        {/* Microphone */}
        <button
          onClick={onToggleMute}
          className={`toolbar-button ${isMuted ? 'danger' : 'active'}`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={onToggleVideo}
          className={`toolbar-button ${!isVideoEnabled ? 'danger' : 'active'}`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onToggleScreenShare}
          className={`toolbar-button ${isScreenSharing ? 'active' : ''}`}
          title="Share screen"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Recording */}
        <button
          onClick={onToggleRecording}
          className={`toolbar-button ${isRecording ? 'danger' : ''}`}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-2"></div>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className={`toolbar-button ${isChatOpen ? 'active' : ''}`}
          title="Toggle chat"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Participants */}
        <button
          onClick={onToggleParticipants}
          className={`toolbar-button ${isParticipantsOpen ? 'active' : ''}`}
          title="Show participants"
        >
          <Users className="h-5 w-5" />
        </button>

        {/* Breakout Rooms */}
        <button
          onClick={onToggleBreakoutRooms}
          className={`toolbar-button ${isBreakoutRoomsOpen ? 'active' : ''}`}
          title="Breakout Rooms"
        >
          <Users2 className="h-5 w-5" />
        </button>

        {/* AI Assistant */}
        <button
          onClick={onToggleAI}
          className={`toolbar-button ${isAIOpen ? 'active' : ''}`}
          title="AI Assistant"
        >
          <Brain className="h-5 w-5" />
        </button>

        {/* Whiteboard */}
        <button
          onClick={onToggleWhiteboard}
          className={`toolbar-button ${isWhiteboardOpen ? 'active' : ''}`}
          title="AI Whiteboard"
        >
          <Palette className="h-5 w-5" />
        </button>

        {/* Recording Panel */}
        <button
          onClick={onToggleRecordingPanel}
          className={`toolbar-button ${isRecordingOpen ? 'active' : ''}`}
          title="Recording & Transcription"
        >
          <Mic className="h-5 w-5" />
        </button>

        {/* Settings */}
        <button
          className="toolbar-button"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-2"></div>

        {/* End Meeting */}
        <button
          onClick={handleEndMeeting}
          className="toolbar-button danger"
          title="End meeting"
        >
          <Phone className="h-5 w-5 rotate-[135deg]" />
        </button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 glass-dark rounded-lg px-4 py-2 flex items-center space-x-2"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-white font-medium">Recording</span>
        </motion.div>
      )}
    </motion.div>
  )
} 