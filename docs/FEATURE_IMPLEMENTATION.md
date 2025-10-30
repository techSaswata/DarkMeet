# DarkMeet Feature Implementation Guide

## Table of Contents

- [Overview](#overview)
- [Core Video Conferencing](#core-video-conferencing)
- [Real-time Chat](#real-time-chat)
- [Screen Sharing](#screen-sharing)
- [Recording and Transcription](#recording-and-transcription)
- [Breakout Rooms](#breakout-rooms)
- [AI-Powered Features](#ai-powered-features)
- [Participant Management](#participant-management)
- [Meeting Settings](#meeting-settings)
- [Advanced Features](#advanced-features)

## Overview

This guide provides detailed implementation instructions for each feature in DarkMeet. It covers both the technical implementation and user-facing functionality.

## Core Video Conferencing

### Architecture

DarkMeet uses LiveKit for WebRTC infrastructure, providing:
- Selective Forwarding Unit (SFU) for efficient bandwidth usage
- Adaptive bitrate streaming
- Automatic quality adjustment
- Multi-codec support (VP8, VP9, H.264)

### Implementation

#### 1. Room Connection

```typescript
// app/meeting/[roomId]/page.tsx

const connectToLiveKit = async (token: string) => {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: {
        width: 1920,
        height: 1080,
      },
    },
    audioCaptureDefaults: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  })

  // Set up event listeners
  room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
  room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
  room.on(RoomEvent.ParticipantConnected, handleParticipantConnected)
  room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)

  // Connect to room
  await room.connect(LIVEKIT_URL, token)
  setLiveKitRoom(room)

  // Enable local tracks
  await room.localParticipant.enableCameraAndMicrophone()
}
```

#### 2. Video Grid Layout

```typescript
// components/meeting/meeting-room.tsx

export function MeetingRoom({ participants, localParticipant }) {
  const getGridLayout = (count: number) => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-2'
    if (count <= 4) return 'grid-cols-2 grid-rows-2'
    if (count <= 6) return 'grid-cols-3 grid-rows-2'
    if (count <= 9) return 'grid-cols-3 grid-rows-3'
    return 'grid-cols-4'
  }

  return (
    <div className={`grid ${getGridLayout(participants.length)} gap-4`}>
      {participants.map(participant => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  )
}
```

#### 3. Audio/Video Controls

```typescript
// Toggle microphone
const toggleMute = async () => {
  if (!room) return
  const enabled = room.localParticipant.isMicrophoneEnabled
  await room.localParticipant.setMicrophoneEnabled(!enabled)
  setIsMuted(!enabled)
}

// Toggle camera
const toggleVideo = async () => {
  if (!room) return
  const enabled = room.localParticipant.isCameraEnabled
  await room.localParticipant.setCameraEnabled(!enabled)
  setIsVideoEnabled(!enabled)
}
```

### Features

#### Speaking Indicator

```typescript
room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
  const speakerIds = speakers.map(s => s.identity)
  setActiveSpeakers(speakerIds)
})

// In VideoTile component
<div className={`relative ${isActiveSpeaker ? 'ring-4 ring-green-500' : ''}`}>
  <video ref={videoRef} />
</div>
```

#### Network Quality Indicator

```typescript
room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
  updateParticipantQuality(participant.identity, quality)
})

// Display quality indicator
const QualityIcon = ({ quality }) => {
  if (quality === 'excellent') return <Signal className="text-green-500" />
  if (quality === 'good') return <Signal className="text-yellow-500" />
  return <SignalLow className="text-red-500" />
}
```

#### Picture-in-Picture Mode

```typescript
const enablePiP = async (videoElement: HTMLVideoElement) => {
  if (document.pictureInPictureEnabled) {
    try {
      await videoElement.requestPictureInPicture()
    } catch (error) {
      console.error('PiP failed:', error)
    }
  }
}
```

## Real-time Chat

### Implementation

#### 1. Chat Database Schema

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_room ON chat_messages(room_id, created_at);
```

#### 2. Send Message

```typescript
// components/meeting/chat-panel.tsx

const sendMessage = async () => {
  if (!message.trim() || !supabase) return

  const { error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      user_id: currentUserId,
      message: message.trim(),
      message_type: 'text'
    })

  if (!error) {
    setMessage('')
  }
}
```

#### 3. Real-time Subscription

```typescript
useEffect(() => {
  if (!supabase) return

  const subscription = supabase
    .channel(`chat-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      const newMessage = payload.new
      setMessages(prev => [...prev, newMessage])
      
      // Auto-scroll to bottom
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 
          chatContainerRef.current.scrollHeight
      }
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [roomId, supabase])
```

### Features

#### Emoji Support

```typescript
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const EmojiPicker = ({ onSelect }) => (
  <Picker 
    data={data} 
    onEmojiSelect={(emoji) => onSelect(emoji.native)}
    theme="dark"
  />
)
```

#### File Sharing

```typescript
const uploadFile = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${roomId}/${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('chat-files')
    .upload(fileName, file)

  if (!uploadError) {
    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName)

    await supabase.from('chat_messages').insert({
      room_id: roomId,
      user_id: currentUserId,
      message: publicUrl,
      message_type: 'file'
    })
  }
}
```

#### Typing Indicator

```typescript
const [typingUsers, setTypingUsers] = useState<string[]>([])

const handleTyping = async () => {
  // Broadcast typing status
  await supabase
    .channel(`typing-${roomId}`)
    .send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId }
    })
}

// Subscribe to typing events
supabase
  .channel(`typing-${roomId}`)
  .on('broadcast', { event: 'typing' }, (payload) => {
    const userId = payload.payload.user_id
    setTypingUsers(prev => [...new Set([...prev, userId])])
    
    // Clear after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(id => id !== userId))
    }, 3000)
  })
  .subscribe()
```

## Screen Sharing

### Implementation

#### 1. Start Screen Share

```typescript
const startScreenShare = async () => {
  try {
    const screenTrack = await createScreenShareTrack({
      audio: true, // System audio
      video: {
        displaySurface: 'monitor', // 'monitor', 'window', 'browser'
      }
    })

    if (room) {
      await room.localParticipant.publishTrack(screenTrack)
      setIsScreenSharing(true)
    }

    // Handle when user stops via browser UI
    screenTrack.mediaStreamTrack.onended = () => {
      stopScreenShare()
    }
  } catch (error) {
    console.error('Screen share failed:', error)
  }
}
```

#### 2. Stop Screen Share

```typescript
const stopScreenShare = async () => {
  if (!room) return

  const publications = Array.from(room.localParticipant.tracks.values())
  for (const publication of publications) {
    if (publication.source === Track.Source.ScreenShare ||
        publication.source === Track.Source.ScreenShareAudio) {
      await room.localParticipant.unpublishTrack(publication.track!)
    }
  }

  setIsScreenSharing(false)
}
```

#### 3. Display Shared Screen

```typescript
// Full-screen overlay for shared screen
<motion.div className="fixed inset-0 z-40 bg-black">
  <div className="relative h-full flex items-center justify-center">
    <video
      ref={screenVideoRef}
      autoPlay
      playsInline
      className="max-w-full max-h-full"
    />
    
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 btn-glass"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
</motion.div>
```

### Features

#### Cursor Annotation

```typescript
const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  
  // Broadcast cursor position
  room?.localParticipant.publishData(
    JSON.stringify({ type: 'cursor', x, y }),
    DataPacket_Kind.RELIABLE
  )
}
```

#### Drawing Tools

```typescript
const [isDrawing, setIsDrawing] = useState(false)
const [drawings, setDrawings] = useState<Line[]>([])

const handleDraw = (e: React.MouseEvent) => {
  if (!isDrawing) return
  
  const point = {
    x: e.clientX - e.currentTarget.offsetLeft,
    y: e.clientY - e.currentTarget.offsetTop
  }
  
  setDrawings(prev => [...prev, point])
}
```

## Recording and Transcription

### Implementation

#### 1. Start Recording

```typescript
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    })

    const chunks: Blob[] = []
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' })
      await processRecording(audioBlob)
    }

    mediaRecorder.start()
    setIsRecording(true)
    mediaRecorderRef.current = mediaRecorder
  } catch (error) {
    console.error('Recording failed:', error)
  }
}
```

#### 2. AI Transcription

```typescript
const transcribeAudio = async (audioBlob: Blob) => {
  // Convert audio to text using Gemini (simulation)
  const segments = generateSimulatedTranscription()
  setRecordingSegments(segments)
  
  // In production, use speech-to-text API
  // const formData = new FormData()
  // formData.append('audio', audioBlob)
  // const response = await fetch('/api/transcribe', {
  //   method: 'POST',
  //   body: formData
  // })
}
```

#### 3. Save Recording

```typescript
const saveRecording = async (audioBlob: Blob, transcription: string) => {
  // Upload to storage
  const fileName = `${roomId}/${Date.now()}.webm`
  const { error: uploadError } = await supabase.storage
    .from('recordings')
    .upload(fileName, audioBlob)

  if (!uploadError) {
    const { data: { publicUrl } } = supabase.storage
      .from('recordings')
      .getPublicUrl(fileName)

    // Save metadata
    await supabase.from('meeting_recordings').insert({
      room_id: roomId,
      file_url: publicUrl,
      duration: recordingDuration,
      transcription: transcription,
      created_at: new Date().toISOString()
    })
  }
}
```

### Features

#### Live Transcription

```typescript
const startLiveTranscription = () => {
  // Simulate real-time transcription
  const simulatedSegments = [
    { speaker: 'John', text: 'Welcome everyone...' },
    { speaker: 'Sarah', text: 'Thanks for joining...' }
  ]

  simulatedSegments.forEach((segment, index) => {
    setTimeout(() => {
      setRecordingSegments(prev => [...prev, {
        id: `live-${index}`,
        speaker: segment.speaker,
        text: segment.text,
        timestamp: Date.now(),
        duration: 5
      }])
    }, index * 5000)
  })
}
```

#### Download Recording

```typescript
const downloadRecording = async (recordingUrl: string) => {
  const response = await fetch(recordingUrl)
  const blob = await response.blob()
  
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meeting-${roomId}.webm`
  a.click()
  
  window.URL.revokeObjectURL(url)
}
```

## Breakout Rooms

### Implementation

#### 1. Create Breakout Room

```typescript
const createBreakoutRoom = async () => {
  const { data, error } = await supabase
    .from('breakout_rooms')
    .insert({
      meeting_id: roomId,
      name: roomName,
      max_participants: 5,
      participants: [],
      is_active: true,
      created_by: currentUserId
    })
    .select()
    .single()

  if (!error) {
    // Generate LiveKit token for breakout room
    const token = await generateToken(data.id, currentUserId)
    // Redirect participants
  }
}
```

#### 2. Assign Participants

```typescript
const assignParticipant = async (userId: string, roomId: string) => {
  const { data: room } = await supabase
    .from('breakout_rooms')
    .select('participants')
    .eq('id', roomId)
    .single()

  const updatedParticipants = [...room.participants, userId]

  await supabase
    .from('breakout_rooms')
    .update({ participants: updatedParticipants })
    .eq('id', roomId)
}
```

#### 3. Join Breakout Room

```typescript
const joinBreakoutRoom = async (breakoutRoomId: string) => {
  // Disconnect from main room
  await room?.disconnect()

  // Connect to breakout room
  const token = await getBreakoutRoomToken(breakoutRoomId)
  await connectToLiveKit(token)
}
```

### Features

#### Auto-assign Participants

```typescript
const autoAssignParticipants = (
  participants: Participant[],
  roomCount: number
) => {
  const assignments: Record<string, string[]> = {}
  
  participants.forEach((participant, index) => {
    const roomIndex = index % roomCount
    const roomId = breakoutRooms[roomIndex].id
    
    if (!assignments[roomId]) {
      assignments[roomId] = []
    }
    assignments[roomId].push(participant.id)
  })

  return assignments
}
```

#### Broadcast to All Rooms

```typescript
const broadcastMessage = async (message: string) => {
  const rooms = await supabase
    .from('breakout_rooms')
    .select('id')
    .eq('meeting_id', roomId)
    .eq('is_active', true)

  for (const room of rooms.data || []) {
    await supabase.from('chat_messages').insert({
      room_id: room.id,
      user_id: 'system',
      message: message,
      message_type: 'broadcast'
    })
  }
}
```

## AI-Powered Features

### Meeting Assistant

```typescript
const askAI = async (question: string) => {
  const context = messages.map(m => `${m.user}: ${m.text}`).join('\n')
  
  const prompt = `
    You are an AI meeting assistant. Based on this conversation:
    ${context}
    
    Answer the following question: ${question}
  `
  
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

### Live Translation

```typescript
const translateMessage = async (text: string, targetLang: string) => {
  const prompt = `Translate to ${targetLang}: ${text}`
  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Real-time translation
useEffect(() => {
  if (!enableTranslation) return
  
  const subscription = supabase
    .channel(`chat-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `room_id=eq.${roomId}`
    }, async (payload) => {
      const translated = await translateMessage(
        payload.new.message,
        userLanguage
      )
      setTranslatedMessages(prev => ({
        ...prev,
        [payload.new.id]: translated
      }))
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [enableTranslation, userLanguage])
```

### Meeting Summary

```typescript
const generateSummary = async () => {
  const conversation = messages
    .map(m => `${m.user}: ${m.message}`)
    .join('\n')
  
  const prompt = `
    Summarize this meeting conversation. Include:
    1. Main topics discussed
    2. Key decisions made
    3. Action items
    4. Next steps
    
    Conversation:
    ${conversation}
  `
  
  const result = await model.generateContent(prompt)
  const summary = result.response.text()
  
  // Save summary
  await supabase.from('meeting_summaries').insert({
    meeting_id: roomId,
    summary: summary,
    created_at: new Date().toISOString()
  })
  
  return summary
}
```

### Voice Commands

```typescript
const processVoiceCommand = async (transcript: string) => {
  const prompt = `
    Parse this voice command: "${transcript}"
    Return JSON with action and parameters.
    Actions: mute, unmute, video_on, video_off, share_screen, end_call
  `
  
  const result = await model.generateContent(prompt)
  const command = JSON.parse(result.response.text())
  
  switch (command.action) {
    case 'mute':
      await toggleMute()
      break
    case 'video_off':
      await toggleVideo()
      break
    case 'share_screen':
      await startScreenShare()
      break
  }
}
```

## Participant Management

### Mute Participant (Host Only)

```typescript
const muteParticipant = async (participantId: string) => {
  if (!isHost) return
  
  // Send data packet to specific participant
  room?.localParticipant.publishData(
    JSON.stringify({
      type: 'mute_request',
      target: participantId
    }),
    DataPacket_Kind.RELIABLE
  )
}

// Participant receives mute request
room.on(RoomEvent.DataReceived, (payload, participant) => {
  const data = JSON.parse(new TextDecoder().decode(payload))
  
  if (data.type === 'mute_request' && data.target === myId) {
    toggleMute()
  }
})
```

### Remove Participant

```typescript
const removeParticipant = async (participantId: string) => {
  if (!isHost) return
  
  // Mark as removed in database
  await supabase
    .from('meeting_participants')
    .update({ removed_at: new Date().toISOString() })
    .eq('meeting_id', roomId)
    .eq('user_id', participantId)
  
  // Send disconnect signal
  room?.localParticipant.publishData(
    JSON.stringify({ type: 'remove', target: participantId }),
    DataPacket_Kind.RELIABLE
  )
}
```

## Meeting Settings

### Update Settings

```typescript
const updateSettings = async (newSettings: MeetingSettings) => {
  await supabase
    .from('meetings')
    .update({ settings: newSettings })
    .eq('room_id', roomId)
  
  // Broadcast settings change
  room?.localParticipant.publishData(
    JSON.stringify({ type: 'settings_update', settings: newSettings }),
    DataPacket_Kind.RELIABLE
  )
}
```

### Waiting Room

```typescript
const admitParticipant = async (participantId: string) => {
  await supabase
    .from('meeting_participants')
    .update({ admitted: true })
    .eq('user_id', participantId)
    .eq('meeting_id', roomId)
}
```

## Advanced Features

### Virtual Backgrounds

```typescript
import { BackgroundBlur } from '@mediapipe/selfie_segmentation'

const applyVirtualBackground = async (videoTrack: LocalVideoTrack) => {
  const segmentation = new BackgroundBlur()
  await segmentation.load()
  
  // Apply background effect to video track
  const processedTrack = await segmentation.process(videoTrack)
  await room?.localParticipant.publishTrack(processedTrack)
}
```

### Noise Cancellation

```typescript
import { NoiseSuppression } from '@livekit/krisp-audio-plugin'

const enableNoiseCancellation = async () => {
  const plugin = new NoiseSuppression()
  await plugin.init()
  
  room?.localParticipant.setAudioProcessor(plugin)
}
```

### Grid Layout Customization

```typescript
const layouts = {
  gallery: 'grid',
  speaker: 'spotlight',
  sidebar: 'picture-in-picture'
}

const setLayout = (layout: keyof typeof layouts) => {
  setCurrentLayout(layout)
  localStorage.setItem('preferred_layout', layout)
}
```

---

*This guide provides a comprehensive overview of implementing DarkMeet's features. Refer to the API documentation for detailed function signatures and parameters.*
