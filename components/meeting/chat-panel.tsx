'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Smile, Users } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isOwn: boolean
}

interface ChatPanelProps {
  roomId: string
  onClose: () => void
}

export function ChatPanel({ roomId, onClose }: ChatPanelProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    // TODO: Implement real-time chat with Supabase
    // For now, start with empty chat
  }, [roomId])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
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
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.isOwn 
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white' 
                      : 'glass-dark text-gray-200'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                    <span className="font-medium">{msg.sender}</span> • {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
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
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300">
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
        
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
} 