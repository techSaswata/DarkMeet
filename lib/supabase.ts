import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client-side Supabase client
export const createSupabaseClient = () => {
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }
  
  // Use direct createClient for client-side operations
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  })
}

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey !== 'placeholder-service-key' 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types
export interface Meeting {
  id: string
  title: string
  description?: string
  room_id: string
  host_id: string
  scheduled_at?: string
  started_at?: string
  ended_at?: string
  status: 'scheduled' | 'active' | 'ended'
  settings: {
    recording_enabled: boolean
    chat_enabled: boolean
    screen_share_enabled: boolean
    ai_features_enabled: boolean
    max_participants: number
  }
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  meeting_id: string
  user_id: string
  display_name: string
  avatar_url?: string
  role: 'host' | 'moderator' | 'participant'
  joined_at: string
  left_at?: string
  is_muted: boolean
  is_video_enabled: boolean
  is_screen_sharing: boolean
}

export interface ChatMessage {
  id: string
  meeting_id: string
  user_id: string
  display_name: string
  avatar_url?: string
  message: string
  message_type: 'text' | 'emoji' | 'system'
  created_at: string
}

export interface AIInsight {
  id: string
  meeting_id: string
  type: 'summary' | 'action_item' | 'key_moment' | 'sentiment' | 'translation'
  content: string
  metadata: Record<string, any>
  timestamp: string
  created_at: string
}

export interface Recording {
  id: string
  meeting_id: string
  file_url: string
  file_size: number
  duration: number
  transcription?: string
  ai_summary?: string
  created_at: string
} 