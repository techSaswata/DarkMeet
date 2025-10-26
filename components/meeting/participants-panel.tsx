'use client'

import { motion } from 'framer-motion'
import { X, Crown, Mic, MicOff, Video, VideoOff, MoreVertical, UserX, Volume2, VolumeX } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

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
  currentUserId?: string
  roomId?: string
}

export function ParticipantsPanel({ participants, onClose, currentUserId = 'user', roomId = 'room' }: ParticipantsPanelProps) {
  const supabase = createSupabaseClient()
  
  // Check if current user is host
  const currentParticipant = participants.find(p => p.id === currentUserId)
  const isHost = currentParticipant?.isHost || false

  const muteAllParticipants = async () => {
    if (!supabase || !isHost) return

    try {
      const { error } = await supabase
        .from('meeting_participants')
        .update({ is_muted: true })
        .eq('room_id', roomId)
        .neq('user_id', currentUserId) // Don't mute the host

      if (error) {
        console.error('Error muting all participants:', error)
      }
    } catch (error) {
      console.error('Error muting all participants:', error)
    }
  }

  const unmuteAllParticipants = async () => {
    if (!supabase || !isHost) return

    try {
      const { error } = await supabase
        .from('meeting_participants')
        .update({ is_muted: false })
        .eq('room_id', roomId)

      if (error) {
        console.error('Error unmuting all participants:', error)
      }
    } catch (error) {
      console.error('Error unmuting all participants:', error)
    }
  }

  const toggleParticipantMute = async (participantId: string, currentMuteState: boolean) => {
    if (!supabase || !isHost) return

    try {
      const { error } = await supabase
        .from('meeting_participants')
        .update({ is_muted: !currentMuteState })
        .eq('room_id', roomId)
        .eq('user_id', participantId)

      if (error) {
        console.error('Error toggling participant mute:', error)
      }
    } catch (error) {
      console.error('Error toggling participant mute:', error)
    }
  }

  const removeParticipant = async (participantId: string) => {
    if (!supabase || !isHost) return

    try {
      const { error } = await supabase
        .from('meeting_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', participantId)

      if (error) {
        console.error('Error removing participant:', error)
      }
    } catch (error) {
      console.error('Error removing participant:', error)
    }
  }

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/meeting/${roomId}`
    if (navigator.share) {
      navigator.share({
        title: 'Join my DarkMeet call',
        text: `Join my video meeting: ${inviteLink}`,
        url: inviteLink,
      })
    } else {
      navigator.clipboard.writeText(inviteLink)
      // Show toast notification if available
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.success('Invite link copied to clipboard!')
      }
    }
  }

  const mutedCount = participants.filter(p => p.isMuted).length
  const videoOffCount = participants.filter(p => !p.isVideoEnabled).length

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

      {/* Stats */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-dark rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <MicOff className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-300">Muted</span>
            </div>
            <div className="text-lg font-semibold text-white">{mutedCount}</div>
          </div>
          <div className="glass-dark rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <VideoOff className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-300">Video Off</span>
            </div>
            <div className="text-lg font-semibold text-white">{videoOffCount}</div>
          </div>
        </div>
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
                  {participant.id === currentUserId && (
                    <span className="text-xs text-gray-400">(You)</span>
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
              {isHost && participant.id !== currentUserId && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleParticipantMute(participant.id, participant.isMuted)}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    title={participant.isMuted ? 'Unmute' : 'Mute'}
                  >
                    {participant.isMuted ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                    title="Remove participant"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button 
          onClick={copyInviteLink}
          className="btn-secondary w-full"
        >
          Invite Others
        </button>
        
        {isHost && (
          <div className="flex space-x-2">
            <button 
              onClick={muteAllParticipants}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
            >
              <VolumeX className="h-4 w-4" />
              <span>Mute All</span>
            </button>
            <button 
              onClick={unmuteAllParticipants}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Volume2 className="h-4 w-4" />
              <span>Unmute All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 