# Real-Time Participants Setup

## Database Setup

To enable real-time participant tracking in your DarkMeet application, you need to create the database table in Supabase.

### Step 1: Run SQL Schema

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your DarkMeet project
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click **Run** to execute the SQL

### Step 2: Verify Setup

After running the SQL, verify that:

1. **Table Created**: The `meeting_participants` table should appear in **Table Editor**
2. **Real-time Enabled**: The table should be listed in **Settings > API > Realtime**
3. **Policies Created**: Row Level Security policies should be visible in the table settings

### How It Works

1. **Join Meeting**: When a user joins a meeting, they're added to the `meeting_participants` table
2. **Real-time Updates**: All participants receive live updates when someone joins/leaves
3. **Auto Cleanup**: Users are automatically removed when they leave the meeting
4. **Unique Constraint**: One record per user per room prevents duplicates

### Features Enabled

- ✅ **Live Participant Count**: See all users in the meeting
- ✅ **Join/Leave Notifications**: Real-time updates when participants join/leave
- ✅ **Host Detection**: First user to join becomes the host
- ✅ **Display Names**: Random user names generated (can be enhanced with auth)
- ✅ **Status Tracking**: Track mute/video status per participant

### Testing

1. Deploy your updated code to Vercel
2. Open the same meeting from two different browsers/devices
3. You should now see multiple participants in the participants panel
4. Try joining/leaving to see real-time updates

### Troubleshooting

If participants aren't showing up:

1. Check browser console for any errors
2. Verify the SQL was executed successfully
3. Check Supabase logs in the dashboard
4. Ensure your environment variables are set correctly

### Future Enhancements

To make this production-ready, consider:

- **Authentication Integration**: Use Supabase Auth for real user management
- **Better Display Names**: Pull from user profiles
- **Permissions**: Implement proper host controls
- **Status Updates**: Real-time mute/video status sync
- **Connection Status**: Track online/offline status 