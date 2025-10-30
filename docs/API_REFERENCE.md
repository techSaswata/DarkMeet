# DarkMeet API Reference

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Supabase Database Schema](#supabase-database-schema)
- [API Endpoints](#api-endpoints)
- [LiveKit Integration](#livekit-integration)
- [Gemini AI Integration](#gemini-ai-integration)
- [Real-time Subscriptions](#real-time-subscriptions)
- [Error Handling](#error-handling)

## Overview

DarkMeet uses a combination of REST APIs, real-time subscriptions, and WebRTC for its functionality. The primary services include:

- **Supabase**: Authentication, database, and real-time subscriptions
- **LiveKit**: Video/audio streaming and WebRTC infrastructure
- **Google Gemini**: AI-powered features and natural language processing

## Authentication

### Supabase Auth

All API requests require authentication via Supabase Auth. The client automatically handles JWT tokens and session management.

#### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    data: {
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
})
```

#### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})
```

#### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

#### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

#### OAuth Sign In

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://darkmeet.com/auth/callback'
  }
})
```

## Supabase Database Schema

### Tables

#### `users`

Extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (references auth.users) |
| email | text | User email |
| full_name | text | User's full name |
| avatar_url | text | Avatar image URL |
| created_at | timestamp | Account creation time |
| updated_at | timestamp | Last update time |

#### `meetings`

Meeting metadata and configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| room_id | text | Unique room identifier |
| host_id | uuid | Foreign key to users |
| title | text | Meeting title |
| description | text | Meeting description |
| scheduled_at | timestamp | Scheduled start time (nullable) |
| started_at | timestamp | Actual start time (nullable) |
| ended_at | timestamp | End time (nullable) |
| is_active | boolean | Meeting status |
| settings | jsonb | Meeting configuration |
| created_at | timestamp | Creation time |

#### `meeting_participants`

Tracks who participated in meetings.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| meeting_id | uuid | Foreign key to meetings |
| user_id | uuid | Foreign key to users |
| joined_at | timestamp | Join time |
| left_at | timestamp | Leave time (nullable) |
| is_host | boolean | Host status |
| role | text | Participant role |

#### `chat_messages`

Meeting chat messages.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| room_id | text | Meeting room ID |
| user_id | uuid | Foreign key to users |
| message | text | Message content |
| message_type | text | Type (text, file, etc.) |
| created_at | timestamp | Send time |

#### `meeting_recordings`

Recorded meeting data.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| room_id | text | Meeting room ID |
| file_url | text | Recording file URL |
| duration | integer | Duration in seconds |
| transcription | text | AI-generated transcription |
| created_at | timestamp | Recording time |

#### `breakout_rooms`

Breakout room configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| meeting_id | text | Parent meeting ID |
| name | text | Breakout room name |
| max_participants | integer | Maximum participants |
| participants | text[] | Array of user IDs |
| is_active | boolean | Room status |
| created_by | uuid | Creator user ID |
| created_at | timestamp | Creation time |

### Database Operations

#### Insert Meeting

```typescript
const { data, error } = await supabase
  .from('meetings')
  .insert({
    room_id: 'unique-room-id',
    host_id: userId,
    title: 'Team Standup',
    description: 'Daily team sync',
    is_active: true,
    settings: {
      recording_enabled: true,
      chat_enabled: true,
      waiting_room: false
    }
  })
  .select()
  .single()
```

#### Query Meetings

```typescript
// Get user's meetings
const { data: meetings, error } = await supabase
  .from('meetings')
  .select(`
    *,
    host:users(full_name, avatar_url),
    participants:meeting_participants(count)
  `)
  .eq('host_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)

// Get active meetings
const { data: activeMeetings } = await supabase
  .from('meetings')
  .select('*')
  .eq('is_active', true)
```

#### Update Meeting

```typescript
const { data, error } = await supabase
  .from('meetings')
  .update({
    ended_at: new Date().toISOString(),
    is_active: false
  })
  .eq('room_id', roomId)
```

#### Insert Chat Message

```typescript
const { data, error } = await supabase
  .from('chat_messages')
  .insert({
    room_id: roomId,
    user_id: userId,
    message: 'Hello everyone!',
    message_type: 'text'
  })
```

#### Query Chat Messages

```typescript
const { data: messages, error } = await supabase
  .from('chat_messages')
  .select(`
    *,
    user:users(full_name, avatar_url)
  `)
  .eq('room_id', roomId)
  .order('created_at', { ascending: true })
```

#### Create Breakout Room

```typescript
const { data, error } = await supabase
  .from('breakout_rooms')
  .insert({
    meeting_id: roomId,
    name: 'Breakout Room 1',
    max_participants: 5,
    participants: [],
    is_active: true,
    created_by: userId
  })
```

## API Endpoints

### Settings API

#### GET `/api/settings`

Get user settings.

**Response:**
```json
{
  "video": {
    "quality": "hd",
    "mirrorVideo": true,
    "backgroundBlur": false
  },
  "audio": {
    "echoCancellation": true,
    "noiseSuppression": true,
    "autoGainControl": true
  },
  "general": {
    "notifications": true,
    "sound": true
  }
}
```

#### POST `/api/settings`

Update user settings.

**Request Body:**
```json
{
  "video": {
    "quality": "fullhd",
    "backgroundBlur": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

### LiveKit Token Generation

#### POST `/api/livekit/token`

Generate a LiveKit access token for joining a room.

**Request Body:**
```json
{
  "roomId": "unique-room-id",
  "userId": "user-uuid",
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://livekit.example.com"
}
```

## LiveKit Integration

### Room Connection

```typescript
import { Room, RoomEvent } from 'livekit-client'

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

// Connect to room
await room.connect(livekitUrl, token)
```

### Track Management

#### Enable Camera and Microphone

```typescript
await room.localParticipant.enableCameraAndMicrophone()
```

#### Toggle Audio

```typescript
// Mute
await room.localParticipant.setMicrophoneEnabled(false)

// Unmute
await room.localParticipant.setMicrophoneEnabled(true)
```

#### Toggle Video

```typescript
// Disable camera
await room.localParticipant.setCameraEnabled(false)

// Enable camera
await room.localParticipant.setCameraEnabled(true)
```

#### Screen Sharing

```typescript
import { createScreenShareTrack } from 'livekit-client'

// Start screen sharing
const screenTrack = await createScreenShareTrack({
  audio: true, // Share system audio
})
await room.localParticipant.publishTrack(screenTrack)

// Stop screen sharing
const publications = Array.from(room.localParticipant.tracks.values())
for (const publication of publications) {
  if (publication.source === Track.Source.ScreenShare) {
    await room.localParticipant.unpublishTrack(publication.track!)
  }
}
```

### Event Handling

```typescript
// Participant connected
room.on(RoomEvent.ParticipantConnected, (participant) => {
  console.log('Participant joined:', participant.identity)
})

// Track subscribed
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === 'video') {
    const videoElement = track.attach()
    document.body.appendChild(videoElement)
  }
})

// Track unsubscribed
room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
  track.detach()
})

// Active speakers changed
room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
  console.log('Active speakers:', speakers)
})

// Participant disconnected
room.on(RoomEvent.ParticipantDisconnected, (participant) => {
  console.log('Participant left:', participant.identity)
})

// Connection quality changed
room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
  console.log(`Connection quality: ${quality}`)
})

// Disconnect
room.on(RoomEvent.Disconnected, () => {
  console.log('Disconnected from room')
})
```

## Gemini AI Integration

### Initialize Client

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
```

### Meeting Assistant

```typescript
async function getMeetingInsights(transcript: string) {
  const prompt = `
    Analyze this meeting transcript and provide:
    1. Key discussion points
    2. Action items
    3. Decisions made
    4. Follow-up topics
    
    Transcript:
    ${transcript}
  `
  
  const result = await model.generateContent(prompt)
  const response = result.response.text()
  return response
}
```

### Live Translation

```typescript
async function translateText(text: string, targetLanguage: string) {
  const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`
  
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

### Meeting Summary

```typescript
async function generateMeetingSummary(messages: string[]) {
  const conversation = messages.join('\n')
  const prompt = `
    Create a concise summary of this meeting conversation:
    
    ${conversation}
    
    Include:
    - Main topics discussed
    - Key decisions
    - Action items with owners
    - Next steps
  `
  
  const result = await model.generateContent(prompt)
  return result.response.text()
}
```

### Voice Commands

```typescript
async function processVoiceCommand(command: string) {
  const prompt = `
    Parse this voice command for a video meeting and return a JSON response:
    Command: "${command}"
    
    Possible actions: mute, unmute, video_on, video_off, share_screen, 
    end_meeting, record_start, record_stop, chat_open, chat_close
    
    Return format: { "action": "action_name", "confidence": 0.95 }
  `
  
  const result = await model.generateContent(prompt)
  return JSON.parse(result.response.text())
}
```

## Real-time Subscriptions

### Chat Messages

```typescript
const subscription = supabase
  .channel(`chat-${roomId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `room_id=eq.${roomId}`
  }, (payload) => {
    const newMessage = payload.new
    // Update UI with new message
    setMessages(prev => [...prev, newMessage])
  })
  .subscribe()

// Cleanup
return () => {
  subscription.unsubscribe()
}
```

### Participant Updates

```typescript
const subscription = supabase
  .channel(`participants-${roomId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'meeting_participants',
    filter: `meeting_id=eq.${roomId}`
  }, (payload) => {
    if (payload.eventType === 'INSERT') {
      // New participant joined
      handleParticipantJoined(payload.new)
    } else if (payload.eventType === 'DELETE') {
      // Participant left
      handleParticipantLeft(payload.old)
    }
  })
  .subscribe()
```

### Breakout Rooms

```typescript
const subscription = supabase
  .channel(`breakout-rooms-${roomId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'breakout_rooms',
    filter: `meeting_id=eq.${roomId}`
  }, (payload) => {
    if (payload.eventType === 'INSERT') {
      setBreakoutRooms(prev => [...prev, payload.new])
    } else if (payload.eventType === 'UPDATE') {
      setBreakoutRooms(prev => 
        prev.map(room => 
          room.id === payload.new.id ? payload.new : room
        )
      )
    }
  })
  .subscribe()
```

## Error Handling

### Supabase Errors

```typescript
const { data, error } = await supabase
  .from('meetings')
  .insert({ room_id: roomId })

if (error) {
  console.error('Database error:', error.message)
  // Handle specific error codes
  if (error.code === '23505') {
    // Unique constraint violation
    console.error('Room ID already exists')
  }
}
```

### LiveKit Errors

```typescript
try {
  await room.connect(url, token)
} catch (error) {
  if (error.message.includes('token')) {
    console.error('Invalid or expired token')
  } else if (error.message.includes('room')) {
    console.error('Room not found')
  } else {
    console.error('Connection error:', error)
  }
}
```

### AI API Errors

```typescript
try {
  const result = await model.generateContent(prompt)
  const response = result.response.text()
} catch (error) {
  if (error.status === 429) {
    console.error('Rate limit exceeded')
  } else if (error.status === 500) {
    console.error('AI service error')
  } else {
    console.error('AI request failed:', error)
  }
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | Refresh authentication token |
| 403 | Forbidden | Check user permissions |
| 404 | Not Found | Verify resource exists |
| 429 | Rate Limited | Implement exponential backoff |
| 500 | Server Error | Retry with fallback |

---

*For additional support or questions, please refer to the main documentation or reach out to the development team.*
