'use client'

import { motion } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, Crown, Hand } from 'lucide-react'

interface Participant {
  id: string
  name: string
  isHost: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  avatar?: string
}

interface MeetingRoomProps {
  roomId: string
  isScreenSharing: boolean
  participants: Participant[]
}

export function MeetingRoom({ roomId, isScreenSharing, participants }: MeetingRoomProps) {
  const getGridClass = () => {
    const count = participants.length
    if (count === 1) return 'participant-grid single'
    if (count === 2) return 'participant-grid two'
    if (count <= 4) return 'participant-grid four'
    return 'participant-grid many'
  }

  return (
    <div className="flex-1 p-4">
      {/* Meeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Meeting Room</h1>
          <p className="text-gray-400">Room ID: {roomId}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-dark rounded-lg px-4 py-2">
            <span className="text-sm text-gray-300">{participants.length} participants</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Video Grid */}
      <div className={getGridClass()}>
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="video-container group relative"
          >
            {/* Video Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              {participant.isVideoEnabled ? (
                <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <div className="text-6xl">
                    {participant.avatar || '👤'}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="bg-dark-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-3">
                    <VideoOff className="h-10 w-10 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm">Camera off</p>
                  <p className="text-gray-500 text-xs mt-1">{participant.name}</p>
                </div>
              )}
            </div>

            {/* Participant Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{participant.name}</span>
                  {participant.isHost && (
                    <Crown className="h-4 w-4 text-neon-yellow" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {participant.isMuted ? (
                    <MicOff className="h-4 w-4 text-red-400" />
                  ) : (
                    <Mic className="h-4 w-4 text-neon-green" />
                  )}
                  
                  {!participant.isVideoEnabled && (
                    <VideoOff className="h-4 w-4 text-red-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Hover Controls */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                <button className="glass-dark rounded-lg p-2 hover:bg-white/20 transition-colors duration-300">
                  <Hand className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Speaking Indicator */}
            {!participant.isMuted && (
              <div className="absolute inset-0 border-4 border-neon-green rounded-2xl animate-pulse-glow"></div>
            )}
            
            {/* Camera Access Denied Indicator */}
            {!participant.isVideoEnabled && (
              <div className="absolute top-4 left-4 bg-red-500/80 text-white text-xs px-2 py-1 rounded flex items-center">
                <VideoOff className="h-3 w-3 mr-1" />
                No camera
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Screen Share Indicator */}
      {isScreenSharing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-dark rounded-lg p-4 text-center"
        >
          <p className="text-neon-blue font-medium">Screen sharing is active</p>
        </motion.div>
      )}
      
      {/* Camera Access Help Text */}
      {participants.some(p => !p.isVideoEnabled) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass-dark rounded-lg p-4 text-center"
        >
          <p className="text-gray-400 text-sm">
            Some participants have their cameras turned off or denied camera access
          </p>
        </motion.div>
      )}
    </div>
  )
}