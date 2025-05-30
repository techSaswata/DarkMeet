'use client'

import { motion } from 'framer-motion'
import { X, Monitor, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

interface ScreenShareProps {
  onClose: () => void
}

export function ScreenShare({ onClose }: ScreenShareProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-black' 
          : 'absolute inset-4 z-40'
      } glass-dark rounded-2xl flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-neon-green" />
          <span className="text-white font-medium">Screen Share - Sarah Chen</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="toolbar-button"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={onClose}
            className="toolbar-button"
            title="Stop viewing"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-lg flex items-center justify-center">
          {/* Simulated screen content */}
          <div className="text-center">
            <Monitor className="h-24 w-24 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Screen Share Active</h3>
            <p className="text-gray-400">Sarah Chen is sharing their screen</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-center space-x-4">
          <div className="glass-dark rounded-lg px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live Screen Share</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 