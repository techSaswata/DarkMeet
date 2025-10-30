'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Users, Plus, Settings, ArrowRight, Crown, User } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

interface BreakoutRoom {
  id: string
  name: string
  participants: string[]
  maxParticipants: number
  isActive: boolean
  created_at: string
}

interface BreakoutRoomsProps {
  roomId: string
  onClose: () => void
  currentUserId: string
  participants: any[]
}

export function BreakoutRooms({ roomId, onClose, currentUserId, participants }: BreakoutRoomsProps) {
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([])
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [isHost, setIsHost] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!supabase) return

    // Check if current user is host
    const currentParticipant = participants.find(p => p.id === currentUserId)
    setIsHost(currentParticipant?.isHost || false)

    // Fetch existing breakout rooms
    const fetchBreakoutRooms = async () => {
      const { data, error } = await supabase
        .from('breakout_rooms')
        .select('*')
        .eq('meeting_id', roomId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching breakout rooms:', error)
      } else {
        setBreakoutRooms(data || [])
      }
    }

    fetchBreakoutRooms()

    // Subscribe to breakout room changes
    const subscription = supabase
      .channel(`breakout-rooms-${roomId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'breakout_rooms',
          filter: `meeting_id=eq.${roomId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBreakoutRooms(prev => [...prev, payload.new as BreakoutRoom])
          } else if (payload.eventType === 'UPDATE') {
            setBreakoutRooms(prev => prev.map(room => 
              room.id === (payload.new as BreakoutRoom).id ? payload.new as BreakoutRoom : room
            ))
          } else if (payload.eventType === 'DELETE') {
            setBreakoutRooms(prev => prev.filter(room => room.id !== (payload.old as BreakoutRoom).id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId, currentUserId, participants, supabase])

  const createBreakoutRoom = async () => {
    if (!newRoomName.trim() || !supabase) return

    try {
      const { error } = await supabase
        .from('breakout_rooms')
        .insert({
          meeting_id: roomId,
          name: newRoomName.trim(),
          max_participants: 4,
          is_active: true,
          created_by: currentUserId,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating breakout room:', error)
        alert('Failed to create breakout room')
      } else {
        setNewRoomName('')
        setIsCreatingRoom(false)
      }
    } catch (error) {
      console.error('Error creating breakout room:', error)
    }
  }

  const joinBreakoutRoom = async (breakoutRoomId: string) => {
    if (!supabase) return

    try {
      // Add user to breakout room
      const { error } = await supabase
        .from('breakout_room_participants')
        .insert({
          breakout_room_id: breakoutRoomId,
          user_id: currentUserId,
          joined_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error joining breakout room:', error)
        alert('Failed to join breakout room')
      } else {
        // Update participant count
        const { data: participants } = await supabase
          .from('breakout_room_participants')
          .select('user_id')
          .eq('breakout_room_id', breakoutRoomId)

        await supabase
          .from('breakout_rooms')
          .update({ participants: participants?.map(p => p.user_id) || [] })
          .eq('id', breakoutRoomId)
      }
    } catch (error) {
      console.error('Error joining breakout room:', error)
    }
  }

  const leaveBreakoutRoom = async (breakoutRoomId: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('breakout_room_participants')
        .delete()
        .eq('breakout_room_id', breakoutRoomId)
        .eq('user_id', currentUserId)

      if (error) {
        console.error('Error leaving breakout room:', error)
      } else {
        // Update participant count
        const { data: participants } = await supabase
          .from('breakout_room_participants')
          .select('user_id')
          .eq('breakout_room_id', breakoutRoomId)

        await supabase
          .from('breakout_rooms')
          .update({ participants: participants?.map(p => p.user_id) || [] })
          .eq('id', breakoutRoomId)
      }
    } catch (error) {
      console.error('Error leaving breakout room:', error)
    }
  }

  const deleteBreakoutRoom = async (breakoutRoomId: string) => {
    if (!supabase || !isHost) return

    try {
      // Delete all participants first
      await supabase
        .from('breakout_room_participants')
        .delete()
        .eq('breakout_room_id', breakoutRoomId)

      // Delete the room
      const { error } = await supabase
        .from('breakout_rooms')
        .delete()
        .eq('id', breakoutRoomId)

      if (error) {
        console.error('Error deleting breakout room:', error)
        alert('Failed to delete breakout room')
      }
    } catch (error) {
      console.error('Error deleting breakout room:', error)
    }
  }

  const isUserInRoom = (room: BreakoutRoom) => {
    return room.participants.includes(currentUserId)
  }

  return (
    <div className="h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Breakout Rooms</span>
          <span className="text-sm text-gray-400">({breakoutRooms.length})</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Create Room Section */}
      {isHost && (
        <div className="p-4 border-b border-white/10">
          {!isCreatingRoom ? (
            <button
              onClick={() => setIsCreatingRoom(true)}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Breakout Room</span>
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name (e.g., Discussion Group 1)"
                className="input-dark w-full"
                onKeyPress={(e) => e.key === 'Enter' && createBreakoutRoom()}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={createBreakoutRoom}
                  disabled={!newRoomName.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Create Room
                </button>
                <button
                  onClick={() => {
                    setIsCreatingRoom(false)
                    setNewRoomName('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breakout Rooms List */}
      <div className="flex-1 overflow-y-auto p-4">
        {breakoutRooms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No breakout rooms</h4>
            <p className="text-gray-500 text-sm">
              {isHost ? 'Create a breakout room to get started' : 'Wait for the host to create breakout rooms'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {breakoutRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-lg p-4 hover:bg-white/5 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-neon-blue" />
                    <h4 className="text-white font-medium">{room.name}</h4>
                    {room.isActive && (
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {isHost && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => deleteBreakoutRoom(room.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                        title="Delete room"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {room.participants.length}/{room.maxParticipants}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {room.participants.slice(0, 3).map((participantId, idx) => {
                        const participant = participants.find(p => p.id === participantId)
                        return (
                          <div
                            key={participantId}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs font-medium"
                            title={participant?.name || 'Unknown'}
                          >
                            {(participant?.name || 'U')[0]}
                          </div>
                        )
                      })}
                      {room.participants.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                          +{room.participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isUserInRoom(room) ? (
                      <button
                        onClick={() => leaveBreakoutRoom(room.id)}
                        className="btn-danger text-sm px-3 py-1"
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={() => joinBreakoutRoom(room.id)}
                        disabled={room.participants.length >= room.maxParticipants}
                        className="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <ArrowRight className="h-3 w-3" />
                        <span>Join</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-dark rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-neon-purple" />
            <span className="text-sm font-medium text-white">How it works</span>
          </div>
          <p className="text-xs text-gray-300">
            {isHost 
              ? 'Create breakout rooms to split participants into smaller groups for focused discussions. You can manage all rooms and bring everyone back to the main meeting anytime.'
              : 'Join breakout rooms to participate in smaller group discussions. The host can create rooms and manage the session.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
