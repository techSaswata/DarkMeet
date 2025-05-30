'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Send, Sparkles, FileText, MessageSquare, Zap } from 'lucide-react'

interface AIAssistantProps {
  roomId: string
  onClose: () => void
}

export function AIAssistant({ roomId, onClose }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'insights'>('chat')
  const [question, setQuestion] = useState('')

  const aiResponses = [
    {
      id: '1',
      type: 'summary',
      content: 'Meeting started at 10:30 AM. Key topics discussed: Q4 planning, budget allocation, and team restructuring.',
      timestamp: '10:35 AM'
    },
    {
      id: '2',
      type: 'insight',
      content: 'Sarah has been the most active speaker (45% talk time). Consider encouraging more participation from other members.',
      timestamp: '10:40 AM'
    }
  ]

  const askAI = () => {
    if (question.trim()) {
      // TODO: Integrate with Gemini API
      console.log('Asking AI:', question)
      setQuestion('')
    }
  }

  return (
    <div className="h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-neon-blue" />
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'chat'
              ? 'text-neon-blue border-b-2 border-neon-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'summary'
              ? 'text-neon-purple border-b-2 border-neon-purple'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'insights'
              ? 'text-neon-pink border-b-2 border-neon-pink'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4 inline mr-2" />
          Insights
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-4 w-4 text-neon-blue" />
                <span className="text-sm font-medium text-white">AI Assistant</span>
              </div>
              <p className="text-gray-300 text-sm">
                I'm here to help! Ask me anything about the meeting, request summaries, or get insights about the discussion.
              </p>
            </div>

            {aiResponses.map((response) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-neon-purple" />
                  <span className="text-sm font-medium text-white">AI Assistant</span>
                  <span className="text-xs text-gray-400">{response.timestamp}</span>
                </div>
                <p className="text-gray-300 text-sm">{response.content}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="glass-dark rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Live Meeting Summary</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <span className="text-neon-blue font-medium">Duration:</span> 0 minutes
                </div>
                <div>
                  <span className="text-neon-purple font-medium">Participants:</span> 1 active
                </div>
                <div>
                  <span className="text-neon-pink font-medium">Key Topics:</span>
                  <div className="mt-2 text-gray-400 italic">
                    No key topics detected yet. AI will analyze the conversation as it progresses.
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Action Items</h4>
              <div className="text-center py-4">
                <div className="text-gray-400 italic">
                  No action items identified yet. AI will capture them automatically as the meeting progresses.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="glass-dark rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Meeting Analytics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Engagement Level</span>
                    <span className="text-gray-400">Analyzing...</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-500 h-2 rounded-full w-1/5"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Participation Balance</span>
                    <span className="text-gray-400">Analyzing...</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-500 h-2 rounded-full w-1/5"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">AI Recommendations</h4>
              <div className="text-center py-4">
                <div className="text-gray-400 italic">
                  AI will provide recommendations based on meeting dynamics and engagement patterns as they develop.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question Input */}
      {activeTab === 'chat' && (
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask AI anything about the meeting..."
              className="input-dark flex-1"
              onKeyPress={(e) => e.key === 'Enter' && askAI()}
            />
            <button
              onClick={askAI}
              disabled={!question.trim()}
              className="btn-primary px-3 py-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 