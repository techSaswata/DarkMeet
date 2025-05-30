'use client'

import { motion } from 'framer-motion'
import { X, Crown, Mic, MicOff, Video, VideoOff, MoreVertical } from 'lucide-react'

interface Participant {
  id: string
  name: string
  isHost: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  avatar?: string
}

interface ParticipantsPanelProps {
  participants: Participant[]
  onClose: () => void
}

export function ParticipantsPanel({ participants, onClose }: ParticipantsPanelProps) {
  return (
    <div className="h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Participants ({participants.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-lg p-3 hover:bg-white/10 transition-colors duration-300"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-medium">
                {participant.avatar || participant.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{participant.name}</span>
                  {participant.isHost && (
                    <Crown className="h-4 w-4 text-neon-yellow" />
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {participant.isMuted ? (
                    <MicOff className="h-3 w-3 text-red-400" />
                  ) : (
                    <Mic className="h-3 w-3 text-neon-green" />
                  )}
                  {participant.isVideoEnabled ? (
                    <Video className="h-3 w-3 text-neon-green" />
                  ) : (
                    <VideoOff className="h-3 w-3 text-red-400" />
                  )}
                </div>
              </div>

              {/* Actions */}
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button 
          onClick={() => {
            const inviteLink = `${window.location.origin}/meeting/${window.location.pathname.split('/').pop()}`
            if (navigator.share) {
              navigator.share({
                title: 'Join my DarkMeet call',
                text: `Join my video meeting: ${inviteLink}`,
                url: inviteLink,
              })
            } else {
              navigator.clipboard.writeText(inviteLink)
              // Show toast notification if toast is available
              if (typeof window !== 'undefined' && (window as any).toast) {
                (window as any).toast.success('Invite link copied to clipboard!')
              }
            }
          }}
          className="btn-secondary w-full"
        >
          Invite Others
        </button>
        <button className="btn-primary w-full">
          Mute All
        </button>
      </div>
    </div>
  )
} 