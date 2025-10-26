'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Smile, Users, MoreHorizontal } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

interface ChatMessage {
  id: string
  sender: string
  sender_id: string
  message: string
  timestamp: string
  isOwn: boolean
  emoji?: string
}

interface ChatPanelProps {
  roomId: string
  onClose: () => void
  currentUserId?: string
  currentUserName?: string
}

export function ChatPanel({ roomId, onClose, currentUserId = 'user', currentUserName = 'You' }: ChatPanelProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseClient()

  // Common emojis for quick access
  const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯', '👏', '🙌']

  useEffect(() => {
    if (!supabase) return

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_name,
          sender_id: msg.sender_id,
          message: msg.message,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: msg.sender_id === currentUserId,
          emoji: msg.emoji
        }))
        setMessages(formattedMessages)
      }
    }

    fetchMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat-${roomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        }, 
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            sender: payload.new.sender_name,
            sender_id: payload.new.sender_id,
            message: payload.new.message,
            timestamp: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: payload.new.sender_id === currentUserId,
            emoji: payload.new.emoji
          }
          setMessages(prev => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId, currentUserId, supabase])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || !supabase) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: currentUserId,
          sender_name: currentUserName,
          message: message.trim(),
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error sending message:', error)
        // Fallback to local state if database fails
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: currentUserName,
          sender_id: currentUserId,
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true
        }
        setMessages(prev => [...prev, newMessage])
      }
      
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setIsEmojiPickerOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Meeting Chat</span>
          <span className="text-sm text-gray-400">({messages.length})</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No messages yet</h4>
            <p className="text-gray-500 text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.isOwn 
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white' 
                      : 'glass-dark text-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.emoji && (
                      <div className="text-lg mt-1">{msg.emoji}</div>
                    )}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                    <span className="font-medium">{msg.sender}</span> • {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="input-dark w-full pr-12"
            />
            <button 
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 glass-dark rounded-lg p-3"
          >
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform duration-200 p-1 rounded hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
} 