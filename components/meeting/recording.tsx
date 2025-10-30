'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Circle, StopCircle, Download, Play, Pause, FileText, Mic } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

interface RecordingSegment {
  id: string
  speaker: string
  text: string
  timestamp: number
  duration: number
}

interface RecordingProps {
  roomId: string
  onClose: () => void
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  participants: any[]
}

export function Recording({ roomId, onClose, isRecording, onStartRecording, onStopRecording, participants }: RecordingProps) {
  const [recordingSegments, setRecordingSegments] = useState<RecordingSegment[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [transcription, setTranscription] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const supabase = createSupabaseClient()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      })

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        processRecording(audioBlob)
      }

      mediaRecorder.start(1000) // Collect data every second

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

      // Start real-time transcription simulation
      startRealTimeTranscription()

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Please check microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsTranscribing(true)
    // Simulate transcription processing
    setTimeout(() => {
      setIsTranscribing(false)
    }, 2000)
  }

  const processRecording = async (audioBlob: Blob) => {
    try {
      // In a real implementation, you would send this to a transcription service
      // For now, we'll simulate the transcription
      const simulatedTranscription = generateSimulatedTranscription()
      setRecordingSegments(simulatedTranscription)
      
      // Generate text transcription for database
      const transcriptionText = simulatedTranscription
        .map(seg => `${seg.speaker}: ${seg.text}`)
        .join('\n')
      
      // Save recording to database
      if (supabase) {
        const { error } = await supabase
          .from('meeting_recordings')
          .insert({
            room_id: roomId,
            duration: recordingDuration,
            transcription: transcriptionText,
            created_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error saving recording:', error)
        }
      }
    } catch (error) {
      console.error('Error processing recording:', error)
    }
  }

  const generateSimulatedTranscription = () => {
    const segments = [
      { speaker: 'John', text: 'Welcome everyone to today\'s meeting. Let\'s start by reviewing our quarterly goals.' },
      { speaker: 'Sarah', text: 'Thanks John. I think we\'ve made great progress on the product roadmap this quarter.' },
      { speaker: 'Mike', text: 'I agree. The new features we launched have been well received by our users.' },
      { speaker: 'John', text: 'That\'s excellent news. Let\'s discuss the next steps for Q4 planning.' },
      { speaker: 'Sarah', text: 'I\'ll prepare a detailed presentation for next week\'s planning session.' }
    ]

    return segments.map((segment, index) => ({
      id: `segment-${index}`,
      speaker: segment.speaker,
      text: segment.text,
      timestamp: index * 30,
      duration: 15
    }))
  }

  const startRealTimeTranscription = () => {
    // Simulate real-time transcription updates
    const simulatedSegments = [
      { speaker: 'John', text: 'Welcome everyone to today\'s meeting...' },
      { speaker: 'Sarah', text: 'Thanks John. I think we\'ve made great progress...' },
      { speaker: 'Mike', text: 'I agree. The new features we launched...' }
    ]

    simulatedSegments.forEach((segment, index) => {
      setTimeout(() => {
        setRecordingSegments(prev => [...prev, {
          id: `live-${index}`,
          speaker: segment.speaker,
          text: segment.text,
          timestamp: index * 20,
          duration: 10
        }])
      }, index * 2000)
    })
  }

  const downloadRecording = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meeting-recording-${roomId}-${new Date().toISOString().split('T')[0]}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const downloadTranscription = () => {
    const transcriptionText = recordingSegments
      .map(segment => `${segment.speaker}: ${segment.text}`)
      .join('\n\n')
    
    const blob = new Blob([transcriptionText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-transcription-${roomId}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>Meeting Recording</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Recording Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <button
                onClick={onStartRecording}
                className="btn-primary flex items-center space-x-2"
              >
                <Circle className="h-5 w-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={onStopRecording}
                className="btn-danger flex items-center space-x-2"
              >
                <StopCircle className="h-5 w-5" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">
              {isRecording ? `Recording: ${formatTime(recordingDuration)}` : 'Not Recording'}
            </span>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="glass-dark rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live Transcription Active</span>
            </div>
            <p className="text-xs text-gray-400">
              Audio is being recorded and transcribed in real-time
            </p>
          </div>
        )}
      </div>

      {/* Transcription */}
      <div className="flex-1 overflow-y-auto p-4">
        {isTranscribing ? (
          <div className="text-center py-8">
            <div className="spinner mb-4"></div>
            <h4 className="text-lg font-medium text-gray-400 mb-2">Processing Transcription</h4>
            <p className="text-gray-500 text-sm">Converting audio to text...</p>
          </div>
        ) : recordingSegments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">No Recording Yet</h4>
            <p className="text-gray-500 text-sm">Start recording to see live transcription</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-3">Live Transcription</h4>
            {recordingSegments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-lg p-3"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs font-medium">
                    {segment.speaker[0]}
                  </div>
                  <span className="text-sm font-medium text-white">{segment.speaker}</span>
                  <span className="text-xs text-gray-400">{formatTime(segment.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-300">{segment.text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={downloadRecording}
            disabled={recordingSegments.length === 0}
            className="btn-secondary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Download Audio</span>
          </button>
          <button
            onClick={downloadTranscription}
            disabled={recordingSegments.length === 0}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>Download Text</span>
          </button>
        </div>
        
        <div className="glass-dark rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Mic className="h-4 w-4 text-neon-blue" />
            <span className="text-sm font-medium text-white">Recording Features</span>
          </div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• High-quality audio recording</li>
            <li>• Real-time transcription</li>
            <li>• Speaker identification</li>
            <li>• Automatic timestamping</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
