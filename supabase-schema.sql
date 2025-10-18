-- Create meetings table to track meeting creators
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT UNIQUE NOT NULL,
    title TEXT,
    created_by TEXT NOT NULL, -- User ID of the meeting creator
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_room_id ON meetings(room_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON meetings(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists and create new one
DROP POLICY IF EXISTS "Allow all operations on meetings" ON meetings;
CREATE POLICY "Allow all operations on meetings" 
ON meetings FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Enable real-time subscriptions for meetings (only if not already added)
DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE meetings;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
END $$;

-- Create meeting_participants table for real-time participant tracking
CREATE TABLE IF NOT EXISTS meeting_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    is_video_enabled BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one record per user per room
    UNIQUE(room_id, user_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_meeting_participants_room_id ON meeting_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_joined_at ON meeting_participants(joined_at);

-- Enable Row Level Security (RLS)
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists and create new one
DROP POLICY IF EXISTS "Allow all operations on meeting_participants" ON meeting_participants;
CREATE POLICY "Allow all operations on meeting_participants" 
ON meeting_participants FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Enable real-time subscriptions (only if not already added)
DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE meeting_participants;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one for meetings
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Drop trigger if exists and create new one for participants
DROP TRIGGER IF EXISTS update_meeting_participants_updated_at ON meeting_participants;
CREATE TRIGGER update_meeting_participants_updated_at
    BEFORE UPDATE ON meeting_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a function to clean up old participants (for scheduled cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_participants()
RETURNS void AS $$
BEGIN
    -- Remove participants older than 24 hours (adjust as needed)
    DELETE FROM meeting_participants 
    WHERE joined_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create contact_messages table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists and create new one
DROP POLICY IF EXISTS "Allow all operations on contact_messages" ON contact_messages;
CREATE POLICY "Allow all operations on contact_messages" 
ON contact_messages FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Enable real-time subscriptions (only if not already added)
DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
    EXCEPTION WHEN duplicate_object THEN
        -- Table already in publication, skip
        NULL;
    END;
END $$;

-- Drop trigger if exists and create new one for contact_messages
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 