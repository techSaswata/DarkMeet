# Contributing to DarkMeet 

Welcome to DarkMeet! We're excited that you want to contribute to our next-generation video conferencing platform. This document will guide you through the contribution process.

## 🌟 About DarkMeet

DarkMeet is a cutting-edge video conferencing platform that combines stunning dark aesthetics with AI-powered features. Built with Next.js 14, TypeScript, and powered by Google Gemini AI, it offers a modern alternative to traditional video conferencing solutions.

### Key Features:

- **AI-Powered Meeting Assistant** - Real-time insights and summaries
- **Live Translation** - 100+ languages support
- **AI Whiteboard** - Sketch-to-diagram conversion
- **Voice Commands** - Natural language meeting control
- **Emotion Analytics** - Sentiment analysis and engagement tracking
- **Modern Dark UI** - Glassmorphism with neon accents

## 🤝 How to Contribute

We welcome meaningful contributions that enhance the core functionality and technical infrastructure of DarkMeet!

## ⚠️ Important: Contribution Focus

**Please note: We are currently NOT accepting:**

- **Pure frontend/UI-only PRs** (styling, layout changes, design tweaks)
- **Documentation-only PRs** (README updates, comment additions)

**We ARE looking for:**

- **Backend functionality** and API development
- **AI feature implementation** and enhancement
- **Video conferencing core features**
- **Performance optimizations** and bug fixes
- **Infrastructure improvements**
- **Full-stack features** that include both frontend and backend work

### 🎯 Priority Contribution Areas

#### � Backend & Infrastructure

- **Database optimization** and schema improvements
- **API endpoint** development and enhancement
- **Real-time functionality** with WebSockets/Supabase
- **Performance optimizations** and caching
- **Security enhancements** and authentication flows

#### 🤖 AI & Machine Learning

- **Gemini AI integration** enhancements
- **Voice processing** and speech recognition
- **Computer vision** for whiteboard analysis
- **Natural language processing** improvements
- **Machine learning model** integrations

#### 🎥 Video & Real-time Features

- **LiveKit integration** improvements
- **WebRTC optimization** and troubleshooting
- **Screen sharing** advanced functionality
- **Recording and transcription** features
- **Participant management** system enhancements

#### 🧪 Testing & Quality Assurance

- **Unit tests** for critical functionality
- **Integration tests** for API endpoints
- **End-to-end testing** automation
- **Performance testing** and benchmarking
- **Security testing** and vulnerability assessments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the Repository**

   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/DarkMeet.git
   cd DarkMeet
   ```
2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Set Up Environment Variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in the required environment variables:

   ```env
   # Supabase (optional for UI development)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # LiveKit (optional for video features)
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret

   # Google Gemini AI (optional for AI features)
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Start Development Server**

   ```bash
   npm run dev
   ```
5. **Open Your Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 💡 Development Tips

- **Backend Development**: Focus on API endpoints, database operations, and server-side logic
- **AI Features**: You'll need a Gemini API key from Google AI Studio for AI-related contributions
- **Video Features**: LiveKit setup is required for video conferencing functionality
- **Real-time Features**: Supabase setup is needed for real-time database operations
- **Testing**: Always include tests for new backend functionality
- **Performance**: Consider scalability and performance implications of your changes

## 📋 Contribution Guidelines

### 🔄 Workflow

1. **Create an Issue** (if one doesn't exist)

   - Describe the bug, feature, or improvement
   - Add appropriate labels
   - Wait for maintainer approval before starting work
2. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
3. **Make Your Changes**

   - Follow the coding standards below
   - Write clear, descriptive commit messages
   - Test your changes thoroughly
4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new AI feature for meeting summaries"
   ```
5. **Push and Create PR**

   ```bash
   git push origin your-branch-name
   ```

   Then create a Pull Request on GitHub.

### 🎨 Coding Standards

#### TypeScript & React

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components with TypeScript interfaces
- Implement proper error boundaries

#### Code Style

- Use 2 spaces for indentation
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow existing code patterns and structure

#### Component Structure

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from 'lucide-react'

interface ComponentProps {
  title: string
  isActive?: boolean
}

export function ComponentName({ title, isActive = false }: ComponentProps) {
  const [state, setState] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-dark rounded-lg p-4"
    >
      {/* Component content */}
    </motion.div>
  )
}
```

#### Styling Guidelines

- Use Tailwind CSS for styling
- Follow the dark theme color scheme
- Use existing CSS classes when possible:
  - `glass-dark` for glassmorphism effects
  - `neon-glow-{color}` for glow effects
  - `gradient-text` for gradient text
- Maintain responsive design principles

#### AI Integration

- Use the existing `GeminiAI` class in `lib/gemini.ts`
- Handle API errors gracefully
- Implement loading states for AI operations
- Add proper TypeScript types for AI responses

### 🧪 Testing

#### Manual Testing

- Test on different screen sizes (mobile, tablet, desktop)
- Verify dark theme consistency
- Check animations and transitions
- Test with and without API keys

#### Automated Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the project
npm run build
```

### 📝 Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(ai): add voice command processing
fix(ui): resolve mobile responsive issues
docs: update setup instructions
style(components): improve button hover effects
```

## 🏆 Recognition

### Contributors

All contributors will be:

- Added to our contributors list
- Mentioned in release notes for significant contributions
- Given credit in project documentation

### Hacktoberfest Participants

- Issues labeled with `hacktoberfest` count toward Hacktoberfest goals
- Quality contributions are prioritized over quantity
- Maintainers will help guide first-time contributors

## 🔍 Priority Project Areas

### 🤖 AI Features & Machine Learning
- **Meeting Assistant**: Enhance Gemini AI integration with better context understanding
- **Voice Commands**: Expand natural language processing capabilities
- **Translation**: Implement real-time translation engine improvements
- **Whiteboard AI**: Advanced sketch recognition and diagram generation
- **Analytics**: Machine learning-based meeting insights and recommendations
- **Emotion Recognition**: Advanced sentiment analysis and engagement tracking

### 🎥 Video & Real-time Infrastructure
- **LiveKit Integration**: Enhance video quality, scalability, and performance
- **WebRTC Optimization**: Improve connection stability and quality
- **Screen Sharing**: Advanced sharing controls and multi-screen support
- **Chat System**: Rich text, file sharing, and message persistence
- **Participant Management**: Advanced controls and role-based permissions
- **Recording Backend**: Server-side recording, transcription, and storage

### 🔧 Backend & Database
- **API Development**: RESTful APIs for meeting management and user operations
- **Database Optimization**: Query optimization and schema improvements
- **Authentication**: Enhanced security and user management systems
- **Real-time Sync**: WebSocket implementations for live collaboration
- **Caching**: Redis implementation for performance improvements
- **Microservices**: Service architecture and scalability enhancements

### 📱 Advanced Features
- **Mobile API**: React Native backend support and optimization
- **Browser Extension**: Cross-browser extension with backend integration
- **Calendar Integration**: Google/Outlook calendar sync with intelligent scheduling
- **Advanced Recording**: AI-powered highlights, bookmarks, and search
- **Breakout Rooms**: Automated room management and intelligent participant assignment
- **Enterprise Features**: SSO, admin controls, and advanced security

### 🛠️ Infrastructure & DevOps
- **Performance**: Database indexing, query optimization, and caching strategies
- **Security**: Enhanced data protection, encryption, and vulnerability fixes
- **Testing**: Comprehensive test coverage for backend services and APIs
- **Monitoring**: Application performance monitoring and logging systems
- **Deployment**: CI/CD improvements and containerization
- **Scalability**: Load balancing, auto-scaling, and performance optimization

## 🚨 Important Notes

### API Keys and Environment

- Never commit API keys or sensitive data
- Use `.env.local` for local development
- Mock AI responses for testing when needed

### Code Quality

- All PRs must pass TypeScript compilation
- Follow existing code patterns and architecture
- Add proper error handling and loading states
- Maintain responsive design principles

### Communication

- Be respectful and inclusive in all interactions
- Ask questions in issues or discussions
- Provide clear descriptions in PRs
- Respond to feedback promptly

## 🤔 Need Help?

### Getting Started

- Check out [good first issue](https://github.com/techSaswata/DarkMeet/labels/good%20first%20issue) labels
- Focus on backend, AI, or infrastructure improvements
- Read through existing backend code and API structure
- Start with bug fixes or small feature enhancements that include backend work

### Support Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and community support

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Supabase Documentation](https://supabase.com/docs)
- [LiveKit Documentation](https://docs.livekit.io/)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

## Together, let's build the future of video conferencing! 🚀

---

**Happy Coding!** 🎉

Built with ❤️ by techy
