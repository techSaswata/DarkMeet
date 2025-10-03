# DarkMeet - Next-Gen Video Conferencing Platform

## 🌟 Overview

DarkMeet is a cutting-edge video conferencing platform that combines stunning dark aesthetics with AI-powered features. Built with Next.js 14, TypeScript, and Tailwind CSS, it offers a modern alternative to traditional video conferencing solutions.

## ✨ Features

### 🎯 Core Video Conferencing

- **HD Video Quality** - Crystal clear 4K video with noise suppression
- **Screen Sharing** - Share screens, windows, or applications
- **Breakout Rooms** - Create and manage breakout sessions
- **Real-time Chat** - In-meeting messaging with emoji support
- **Recording** - Record meetings with automatic transcription
- **Participant Management** - Mute, unmute, and manage attendees

### 🤖 AI-Powered Features

- **Meeting Assistant** - Gemini-powered AI for real-time insights
- **Live Translation** - Real-time translation in 100+ languages
- **AI Whiteboard** - Convert sketches to professional diagrams
- **Voice Commands** - Control meetings with natural language
- **Emotion Analytics** - Sentiment analysis and engagement tracking
- **Time Capsule** - AI highlights key moments in recordings
- **Smart Summaries** - Automatic meeting summaries and action items

### 🎨 Design & UX

- **Dark Theme** - Beautiful dark UI with neon accents
- **Glassmorphism** - Modern glass effects and blur backgrounds
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Framer Motion powered interactions
- **Accessibility** - WCAG compliant design

## 🏗️ Project Structure

```
darkmeet/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles and theme
│   ├── auth/
│   │   └── page.tsx            # Authentication page
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard
│   └── meeting/
│       ├── new/
│       │   └── page.tsx        # Create new meeting
│       └── [roomId]/
│           └── page.tsx        # Meeting room interface
├── components/
│   ├── landing/                 # Landing page components
│   │   ├── navbar.tsx
│   │   ├── hero-section.tsx
│   │   ├── feature-section.tsx
│   │   ├── stats-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── cta-section.tsx
│   │   └── footer.tsx
│   ├── meeting/                 # Meeting interface components
│   │   ├── meeting-room.tsx     # Video grid and participants
│   │   ├── meeting-controls.tsx # Toolbar with controls
│   │   ├── chat-panel.tsx       # Real-time chat
│   │   ├── participants-panel.tsx # Participant management
│   │   ├── ai-assistant.tsx     # AI features panel
│   │   ├── whiteboard.tsx       # AI whiteboard
│   │   └── screen-share.tsx     # Screen sharing overlay
│   └── providers.tsx            # App providers and context
├── lib/
│   ├── supabase.ts             # Database client and types
│   └── gemini.ts               # AI integration with Gemini
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── env.example                 # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- LiveKit account
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/techSaswata/DarkMeet.git
   cd DarkMeet
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # LiveKit
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run the development server**

   ```bash
   npm run dev
   ```
5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Features Deep Dive

### Meeting Assistant

- Real-time meeting analysis
- Automatic note-taking
- Q&A assistance
- Context-aware responses

### Live Translation

- 100+ language support
- Real-time subtitle generation
- Voice translation
- Cultural context awareness

### AI Whiteboard

- Sketch-to-diagram conversion
- Handwriting recognition
- Smart shape detection
- Collaborative editing

### Voice Commands

- Natural language processing
- Meeting control via voice
- Custom command training
- Multi-language support

### Analytics & Insights

- Engagement tracking
- Sentiment analysis
- Speaking time distribution
- Meeting effectiveness scores

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Services

- **Supabase** - Database and authentication
- **LiveKit** - Real-time video infrastructure
- **Google Gemini** - AI and machine learning
- **Vercel** - Deployment platform

## 📱 Pages Overview

### Landing Page (`/`)

- Hero section with animated background
- Feature showcase with AI capabilities
- Statistics and social proof
- Customer testimonials
- Call-to-action sections

### Authentication (`/auth`)

- Sign in / Sign up forms
- Social login options
- Password reset functionality
- Animated form transitions

### Dashboard (`/dashboard`)

- Meeting overview and statistics
- Recent, scheduled, and recorded meetings
- Quick actions and search
- Analytics dashboard

### New Meeting (`/meeting/new`)

- Instant meeting creation
- Meeting scheduling
- Room configuration
- Invite management

### Meeting Room (`/meeting/[roomId]`)

- Video conferencing interface
- Real-time chat panel
- Participant management
- AI assistant integration
- Screen sharing and whiteboard
- Meeting controls toolbar

## 🔧 Configuration

### Tailwind CSS

Custom configuration with:

- Dark theme variables
- Neon color palette
- Glassmorphism utilities
- Custom animations
- Responsive breakpoints

### Next.js

Optimized configuration with:

- App Router setup
- Image optimization
- Environment variable handling
- TypeScript support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, join our [Discord community](https://discord.gg/NPv4zRHQqY).

---

**Built with ❤️ by techy**
