# DarkMeet Architecture Guide

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Application Structure](#application-structure)
- [Data Flow](#data-flow)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Real-time Communication](#real-time-communication)
- [Security Architecture](#security-architecture)

## Overview

DarkMeet is built using a modern, scalable architecture that leverages Next.js 14's App Router, real-time video infrastructure via LiveKit, and AI capabilities through Google Gemini. The application follows a component-based architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │  React       │  │  TypeScript  │      │
│  │   App Router │  │  Components  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     API/Service Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Supabase   │  │   LiveKit    │  │    Gemini    │      │
│  │   Auth/DB    │  │   WebRTC     │  │      AI      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Vercel    │  │  PostgreSQL  │  │   Storage    │      │
│  │   Hosting    │  │   Database   │  │    (S3)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Application Structure

### Directory Layout

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Landing page
├── globals.css             # Global styles and theme
├── api/                    # API routes
│   └── settings/
│       └── route.ts        # Settings API endpoint
├── auth/                   # Authentication pages
│   ├── page.tsx
│   ├── forgot-password/
│   └── reset-password/
├── dashboard/              # User dashboard
│   └── page.tsx
├── meeting/                # Meeting pages
│   ├── new/
│   │   └── page.tsx        # Create meeting
│   └── [roomId]/
│       └── page.tsx        # Meeting room (dynamic)
└── settings/
    └── page.tsx

components/
├── landing/                # Landing page components
│   ├── navbar.tsx
│   ├── hero-section.tsx
│   ├── feature-section.tsx
│   ├── stats-section.tsx
│   ├── testimonials-section.tsx
│   ├── cta-section.tsx
│   └── footer.tsx
├── meeting/                # Meeting components
│   ├── meeting-room.tsx
│   ├── meeting-controls.tsx
│   ├── chat-panel.tsx
│   ├── participants-panel.tsx
│   ├── ai-assistant.tsx
│   ├── whiteboard.tsx
│   ├── screen-share.tsx
│   ├── breakout-rooms.tsx
│   └── recording.tsx
├── ui/                     # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── switch.tsx
│   └── tabs.tsx
└── providers.tsx           # React context providers

lib/
├── supabase.ts             # Supabase client & utilities
├── gemini.ts               # AI integration
└── utils.ts                # Helper functions
```

### Page Responsibilities

#### Landing Page (`/`)
- Public-facing marketing page
- Feature showcase
- Call-to-action for sign-up
- SEO optimized

#### Authentication (`/auth`)
- User sign-in/sign-up
- OAuth integration
- Session management
- Password recovery

#### Dashboard (`/dashboard`)
- Meeting overview
- Schedule management
- Analytics display
- Quick actions

#### Meeting Room (`/meeting/[roomId]`)
- Real-time video conferencing
- WebRTC connection management
- UI controls and panels
- State synchronization

## Data Flow

### Meeting Creation Flow

```
User Input (Create Meeting)
        │
        ▼
  Validate Input
        │
        ▼
Create Room in Supabase
        │
        ▼
Generate LiveKit Token
        │
        ▼
Redirect to Meeting Room
        │
        ▼
Initialize WebRTC Connection
        │
        ▼
    Join Room
```

### Real-time Message Flow

```
User Action (Send Message)
        │
        ▼
Update Local State
        │
        ▼
Send to Supabase Realtime
        │
        ├──────────────────┐
        ▼                  ▼
  Local Update      Other Participants
        │                  │
        └─────────┬────────┘
                  ▼
           UI Update
```

### Video Stream Flow

```
Local Media Capture
        │
        ▼
Process (filters/effects)
        │
        ▼
Encode (LiveKit)
        │
        ▼
Send via WebRTC
        │
        ▼
LiveKit SFU (Routing)
        │
        ├──────────────────┐
        ▼                  ▼
  Participant A    Participant B
        │                  │
        ▼                  ▼
    Decode            Decode
        │                  │
        ▼                  ▼
    Render            Render
```

## Component Architecture

### Component Hierarchy

```
App
├── Providers
│   ├── SupabaseProvider
│   └── ToastProvider
│
├── Layout
│   ├── Navigation
│   └── Footer
│
└── Pages
    └── MeetingRoom
        ├── MeetingRoom (Video Grid)
        │   └── ParticipantTile[]
        │
        ├── MeetingControls (Toolbar)
        │   ├── AudioControl
        │   ├── VideoControl
        │   ├── ScreenShareControl
        │   └── EndCallButton
        │
        ├── Panels (Conditional)
        │   ├── ChatPanel
        │   ├── ParticipantsPanel
        │   ├── AIAssistant
        │   ├── Whiteboard
        │   ├── BreakoutRooms
        │   └── Recording
        │
        └── ScreenShare (Overlay)
```

### Component Communication Patterns

#### Props Drilling (Parent → Child)
```typescript
<MeetingControls
  isMuted={isMuted}
  onToggleMute={handleToggleMute}
  isVideoEnabled={isVideoEnabled}
  onToggleVideo={handleToggleVideo}
/>
```

#### Callback Props (Child → Parent)
```typescript
const handleToggleMute = () => {
  setIsMuted(!isMuted)
  // Update LiveKit track
}
```

#### Context API (Global State)
```typescript
// Used for authentication and theme
const { user } = useAuth()
```

#### LiveKit Events (Real-time Updates)
```typescript
room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
room.on(RoomEvent.ParticipantConnected, handleParticipantConnected)
```

## State Management

### Local State (useState)
- Component-specific UI state
- Form inputs
- Toggle states (mute, video, etc.)

```typescript
const [isMuted, setIsMuted] = useState(false)
const [isVideoEnabled, setIsVideoEnabled] = useState(true)
```

### Server State (Supabase)
- User profiles
- Meeting metadata
- Recordings
- Chat history

```typescript
const { data: meetings } = await supabase
  .from('meetings')
  .select('*')
  .eq('user_id', userId)
```

### Real-time State (LiveKit)
- Video/audio tracks
- Participant connections
- Network quality
- Speaking indicators

```typescript
const [participants, setParticipants] = useState<Participant[]>([])
room.participants.forEach(participant => {
  // Track participant state
})
```

### Ref State (useRef)
- DOM references
- MediaStream objects
- Interval/timeout IDs
- Previous values

```typescript
const videoRef = useRef<HTMLVideoElement>(null)
const mediaRecorderRef = useRef<MediaRecorder | null>(null)
```

## API Integration

### Supabase Integration

#### Authentication
```typescript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password
})
```

#### Database Operations
```typescript
// Insert
await supabase.from('meetings').insert({
  room_id: roomId,
  host_id: userId,
  title: meetingTitle
})

// Query
const { data } = await supabase
  .from('meetings')
  .select('*')
  .eq('room_id', roomId)
  .single()
```

#### Real-time Subscriptions
```typescript
const subscription = supabase
  .channel(`room-${roomId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'chat_messages',
    filter: `room_id=eq.${roomId}`
  }, handleNewMessage)
  .subscribe()
```

### LiveKit Integration

#### Room Connection
```typescript
const room = new Room({
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: {
      width: 1920,
      height: 1080,
    },
  },
})

await room.connect(livekitUrl, token)
```

#### Track Publishing
```typescript
// Enable camera and microphone
await room.localParticipant.enableCameraAndMicrophone()

// Screen sharing
const screenTrack = await createScreenShareTrack()
await room.localParticipant.publishTrack(screenTrack)
```

### Gemini AI Integration

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const result = await model.generateContent(prompt)
const response = result.response.text()
```

## Real-time Communication

### WebRTC Architecture

```
Participant A                    Participant B
     │                                 │
     ├──── Signaling (WebSocket) ─────┤
     │                                 │
     ├──── Media (P2P or SFU) ────────┤
     │                                 │
     └──── STUN/TURN (NAT) ───────────┘
```

### LiveKit SFU Model

- Selective Forwarding Unit (SFU) architecture
- Participants send one stream, receive multiple
- Server-side bandwidth optimization
- Automatic quality adaptation

### Event Handling

```typescript
// Participant events
room.on(RoomEvent.ParticipantConnected, (participant) => {
  console.log('Participant joined:', participant.identity)
})

// Track events
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === Track.Kind.Video) {
    attachVideoTrack(track, participant)
  }
})

// Connection quality
room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
  updateNetworkIndicator(quality)
})
```

## Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
Supabase Auth
    │
    ▼
JWT Token Generation
    │
    ▼
Client-side Storage (httpOnly cookie)
    │
    ▼
Authenticated Requests
```

### Authorization

#### Row Level Security (RLS)
```sql
-- Only meeting participants can view messages
CREATE POLICY "Users can view messages in their meetings"
ON chat_messages FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM meeting_participants
    WHERE meeting_id = chat_messages.room_id
  )
);
```

#### API Route Protection
```typescript
// Server-side route protection
export async function GET(request: Request) {
  const supabase = createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Process request
}
```

### LiveKit Token Security

```typescript
import { AccessToken } from 'livekit-server-sdk'

const token = new AccessToken(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET,
  {
    identity: userId,
    ttl: '2h',
  }
)

token.addGrant({
  roomJoin: true,
  room: roomId,
  canPublish: true,
  canSubscribe: true,
})
```

### Data Protection

- Environment variables for sensitive keys
- HTTPS only in production
- CORS configuration
- Input validation and sanitization
- XSS protection
- CSRF tokens

## Performance Optimizations

### Code Splitting

```typescript
// Dynamic imports for heavy components
const Whiteboard = dynamic(() => import('@/components/meeting/whiteboard'), {
  ssr: false,
  loading: () => <Spinner />
})
```

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/avatar.png"
  width={40}
  height={40}
  alt="User avatar"
  priority
/>
```

### Memoization

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

### Video Stream Optimization

- Simulcast for adaptive streaming
- Dynacast for bandwidth management
- Automatic resolution switching
- Frame rate adaptation

## Scalability Considerations

### Horizontal Scaling
- Stateless architecture
- Distributed LiveKit servers
- Database connection pooling
- CDN for static assets

### Caching Strategy
- Browser caching
- API response caching
- Static page generation
- Image optimization

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Real-time analytics
- User session tracking

---

*This architecture is designed to scale from hundreds to thousands of concurrent users while maintaining performance and reliability.*
