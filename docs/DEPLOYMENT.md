# DarkMeet Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Supabase Setup](#supabase-setup)
- [LiveKit Setup](#livekit-setup)
- [Vercel Deployment](#vercel-deployment)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## Overview

This guide walks through deploying DarkMeet to production. The recommended stack includes:

- **Vercel** - Application hosting
- **Supabase** - Database and authentication
- **LiveKit Cloud** - Video infrastructure
- **Google Cloud** - AI services (Gemini)

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed locally
- [ ] Git repository with your code
- [ ] Vercel account
- [ ] Supabase account
- [ ] LiveKit Cloud account
- [ ] Google Cloud account with Gemini API access
- [ ] Domain name (optional, for custom domain)

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LiveKit
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Security Checklist

- [ ] Never commit `.env` files to version control
- [ ] Use strong, unique keys for all services
- [ ] Enable 2FA on all service accounts
- [ ] Rotate keys regularly (quarterly recommended)
- [ ] Use different credentials for dev/staging/production

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region (select closest to your users)
4. Set database password (save securely)
5. Wait for project initialization (~2 minutes)

### 2. Configure Authentication

```sql
-- Enable email authentication
-- Go to Authentication > Settings > Auth Providers
-- Enable Email provider
```

Configure Auth Settings:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 
  - `https://your-domain.com/auth/callback`
  - `https://your-domain.com/dashboard`

Enable OAuth providers (optional):
```sql
-- Google OAuth
-- Go to Authentication > Settings > Auth Providers
-- Enable Google
-- Add Client ID and Secret from Google Cloud Console
```

### 3. Run Database Schema

Execute the schema from `supabase-schema.sql`:

```bash
# Connect to Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run schema
\i supabase-schema.sql
```

Or use Supabase SQL Editor:
1. Go to SQL Editor in Supabase Dashboard
2. Create new query
3. Paste contents of `supabase-schema.sql`
4. Run query

### 4. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE breakout_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Meeting host can manage their meetings
CREATE POLICY "Hosts can manage meetings"
ON meetings FOR ALL
USING (auth.uid() = host_id);

-- Participants can view their meetings
CREATE POLICY "View participant meetings"
ON meetings FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM meeting_participants 
    WHERE meeting_id = meetings.id
  )
);

-- Participants can send messages
CREATE POLICY "Send messages in meetings"
ON chat_messages FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM meeting_participants
    WHERE meeting_id = chat_messages.room_id
  )
);

-- View messages in joined meetings
CREATE POLICY "View meeting messages"
ON chat_messages FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM meeting_participants
    WHERE meeting_id = chat_messages.room_id
  )
);
```

### 5. Configure Storage (Optional)

For file uploads (avatars, recordings):

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', false);

-- Create storage policies
CREATE POLICY "Users can upload recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recordings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'recordings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 6. Enable Realtime

```sql
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE breakout_rooms;
```

## LiveKit Setup

### 1. Create LiveKit Cloud Account

1. Visit [livekit.io/cloud](https://livekit.io/cloud)
2. Sign up for an account
3. Create a new project
4. Note your project URL (e.g., `wss://your-project.livekit.cloud`)

### 2. Generate API Keys

1. Go to Settings > API Keys
2. Create a new API key
3. Save the API Key and Secret securely
4. Add to environment variables

### 3. Configure LiveKit Settings

Recommended settings for production:

```yaml
# Room Settings
room:
  auto_create: true
  max_participants: 100
  empty_timeout: 300s  # 5 minutes
  
# Video Settings
video:
  h264:
    profile: high
  simulcast: true
  
# Audio Settings
audio:
  opus:
    stereo: true
    
# Recording (optional)
recording:
  enabled: true
  storage: s3
```

### 4. Set Up Webhooks (Optional)

Configure webhooks for room events:

1. Go to Settings > Webhooks
2. Add webhook URL: `https://your-domain.com/api/livekit/webhook`
3. Select events:
   - room_started
   - room_finished
   - participant_joined
   - participant_left

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Link Project

```bash
# From project directory
vercel link
```

### 3. Configure Environment Variables

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_LIVEKIT_URL production
vercel env add LIVEKIT_API_KEY production
vercel env add LIVEKIT_API_SECRET production
vercel env add GEMINI_API_KEY production
```

Or add via Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add each variable with appropriate scope

### 4. Deploy

```bash
# Deploy to production
vercel --prod
```

Or set up automatic deployments:
1. Connect GitHub repository in Vercel Dashboard
2. Configure production branch (usually `main`)
3. Enable automatic deployments
4. Push to production branch to trigger deploy

### 5. Build Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Custom Domain Configuration

### 1. Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add your domain (e.g., `darkmeet.com`)
3. Add www subdomain (e.g., `www.darkmeet.com`)

### 2. Configure DNS

Add these records in your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

For Cloudflare users:
- Disable "Proxy" (orange cloud) for Vercel domains
- Or add Page Rules for WebSocket support

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. Wait 24-48 hours for DNS propagation.

### 4. Update Environment Variables

```bash
# Update app URL in all environments
vercel env add NEXT_PUBLIC_APP_URL production
# Value: https://your-domain.com
```

Update in Supabase:
- Authentication > Settings > Site URL: `https://your-domain.com`
- Add redirect URLs for your custom domain

## Performance Optimization

### 1. Next.js Configuration

Optimize `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['your-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Production source maps (disable for security)
  productionBrowserSourceMaps: false,
  
  // SWC minification
  swcMinify: true,
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 2. Enable Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 3. Configure Caching

```typescript
// API route caching example
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const data = await fetchData()
  return Response.json(data)
}
```

### 4. Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  quality={85}
  placeholder="blur"
/>
```

## Monitoring and Analytics

### 1. Vercel Analytics

Enable in Vercel Dashboard:
- Go to Project > Analytics
- View real-time metrics
- Monitor Web Vitals

### 2. Error Tracking (Sentry)

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure:

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 3. Uptime Monitoring

Options:
- **Vercel Monitoring** - Built-in
- **UptimeRobot** - Free tier available
- **Pingdom** - Enterprise solution

### 4. Database Monitoring

Monitor Supabase:
- Database size and performance
- Connection pool usage
- Query performance
- Real-time connections

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors

```bash
# Check types locally
npm run type-check

# Fix type errors before deploying
```

**Issue**: Missing environment variables

```bash
# Verify all required variables are set
vercel env ls
```

### Connection Issues

**Issue**: WebRTC connection fails

- Check LiveKit URL is correct (wss://)
- Verify API keys are valid
- Ensure CORS is configured
- Check firewall/network settings

**Issue**: Supabase connection timeout

- Verify connection string
- Check if IP is allowlisted
- Monitor connection pool usage

### Performance Issues

**Issue**: Slow page loads

- Enable compression
- Optimize images
- Review bundle size
- Enable CDN caching

**Issue**: High server costs

- Review function execution time
- Optimize database queries
- Enable query caching
- Use incremental static regeneration

### Security Issues

**Issue**: CORS errors

Add proper CORS headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
      ],
    },
  ]
}
```

### Rollback Procedure

If deployment fails:

```bash
# Via CLI
vercel rollback

# Or via Dashboard
# Go to Deployments > Previous deployment > Promote to Production
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Create a test meeting
- [ ] Test video/audio functionality
- [ ] Verify real-time features work
- [ ] Check mobile responsiveness
- [ ] Test screen sharing
- [ ] Verify AI features
- [ ] Monitor error logs for 24 hours
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Document any custom configurations

## Backup and Disaster Recovery

### Database Backups

Supabase provides automatic backups:
- Daily automated backups (7 days retention on free tier)
- Point-in-time recovery (paid plans)
- Manual backups via pg_dump

```bash
# Manual backup
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" > backup.sql
```

### Application Backups

- Code is version controlled in Git
- Vercel maintains deployment history
- Environment variables backed up separately

---

*For additional support, consult the Vercel, Supabase, and LiveKit documentation, or reach out to the development team.*
