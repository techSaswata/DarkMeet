'use client'

import { motion } from 'framer-motion'
import { X, Monitor, Maximize2, Minimize2, Share2, MonitorSpeaker } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Room, LocalTrackPublication, Track } from 'livekit-client'

interface ScreenShareProps {
  onClose: () => void
  room?: Room | null
  isSharing?: boolean
  sharerName?: string
}

export function ScreenShare({ onClose, room, isSharing = false, sharerName = 'Unknown' }: ScreenShareProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [isSharingScreen, setIsSharingScreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      // Request screen capture with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      setScreenStream(stream)
      setIsSharingScreen(true)

      // Publish screen share to LiveKit room
      if (room) {
        await room.localParticipant.publishTrack(stream.getVideoTracks()[0], {
          name: 'screen-share',
          source: Track.Source.ScreenShare
        })

        // Also publish audio if available
        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length > 0) {
          await room.localParticipant.publishTrack(audioTracks[0], {
            name: 'screen-share-audio',
            source: Track.Source.ScreenShareAudio
          })
        }
      }

      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare()
      })

    } catch (error) {
      console.error('Error starting screen share:', error)
      alert('Failed to start screen sharing. Please check your browser permissions.')
    }
  }

  // Stop screen sharing
  const stopScreenShare = async () => {
    if (room && isSharingScreen) {
      // Unpublish screen share tracks
      const publications = Array.from(room.localParticipant.tracks.values())
      for (const publication of publications) {
        if (publication.source === Track.Source.ScreenShare || 
            publication.source === Track.Source.ScreenShareAudio) {
          await room.localParticipant.unpublishTrack(publication.track!)
        }
      }
    }

    // Stop local stream
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
      setScreenStream(null)
    }

    setIsSharingScreen(false)
    onClose()
  }

  // Handle incoming screen share
  useEffect(() => {
    if (!room) return

    const handleTrackSubscribed = (track: Track, publication: any, participant: any) => {
      if (publication.source === Track.Source.ScreenShare && videoRef.current) {
        const videoElement = videoRef.current
        track.attach(videoElement)
      }
    }

    const handleTrackUnsubscribed = (track: Track, publication: any, participant: any) => {
      if (publication.source === Track.Source.ScreenShare) {
        track.detach()
      }
    }

    room.on('trackSubscribed', handleTrackSubscribed)
    room.on('trackUnsubscribed', handleTrackUnsubscribed)

    return () => {
      room.off('trackSubscribed', handleTrackSubscribed)
      room.off('trackUnsubscribed', handleTrackUnsubscribed)
    }
  }, [room])

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
          <span className="text-white font-medium">
            Screen Share - {isSharingScreen ? 'You' : sharerName}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isSharingScreen && (
            <button
              onClick={startScreenShare}
              className="toolbar-button active"
              title="Start screen sharing"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          
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
            onClick={isSharingScreen ? stopScreenShare : onClose}
            className="toolbar-button danger"
            title={isSharingScreen ? 'Stop sharing' : 'Stop viewing'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 rounded-lg overflow-hidden">
          {isSharing || isSharingScreen ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={!isSharingScreen} // Mute if viewing someone else's share
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MonitorSpeaker className="h-24 w-24 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Screen Share Active</h3>
                <p className="text-gray-400 mb-4">Click the share button to start sharing your screen</p>
                <button
                  onClick={startScreenShare}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Start Screen Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="glass-dark rounded-lg px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">
              {isSharingScreen ? 'You are sharing' : 'Live Screen Share'}
            </span>
          </div>
          
          {isSharingScreen && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sharing controls:</span>
              <button
                onClick={stopScreenShare}
                className="btn-danger text-sm px-3 py-1"
              >
                Stop Sharing
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 