# Meeting Timer Component

A React/TypeScript component for DarkMeet that displays meeting elapsed time with visual indicators and time limit warnings.

## 📋 Description

The `MeetingTimer` component provides real-time tracking of meeting duration with a beautiful dark-themed UI that matches DarkMeet's aesthetic. It includes progress visualization, time limit warnings, and customizable duration limits.

## ✨ Features

- ⏱️ **Real-time Timer**: Displays elapsed time in HH:MM:SS or MM:SS format
- 📊 **Progress Bar**: Visual representation of time used
- ⚠️ **Time Warnings**: Alerts when approaching time limit (at 90%)
- 🎨 **Dark Theme**: Glassmorphism design matching DarkMeet
- 🔔 **Callbacks**: Trigger actions when time limit reached
- 📱 **Responsive**: Works on all screen sizes
- 🎯 **Customizable**: Adjustable max duration and warning settings

## 🚀 Usage

### Basic Implementation

```tsx
import MeetingTimer from '@/components/meeting/meeting-timer';

function MeetingRoom() {
  return (
    <MeetingTimer 
      startTime={new Date()}
      maxDuration={60}
    />
  );
}
```

### With Time Limit Callback

```tsx
<MeetingTimer 
  startTime={meetingStartTime}
  maxDuration={45}
  showWarning={true}
  onTimeLimit={() => {
    // Handle time limit reached
    alert('Meeting time limit reached!');
    // Or end meeting, show modal, etc.
  }}
/>
```

### Custom Configuration

```tsx
<MeetingTimer 
  startTime={customStartTime}
  maxDuration={120}        // 2 hours
  showWarning={false}      // Disable warnings
/>
```

## 🎨 Component States

### Normal State (< 90% time used)
- Blue clock icon
- White timer text
- Blue/purple gradient progress bar

### Warning State (≥ 90% time used)
- Orange alert icon
- Orange timer text
- Orange/red gradient progress bar
- Warning message displayed

## 📦 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startTime` | `Date` | `new Date()` | Meeting start timestamp |
| `maxDuration` | `number` | `60` | Maximum duration in minutes |
| `showWarning` | `boolean` | `true` | Show time limit warnings |
| `onTimeLimit` | `() => void` | `undefined` | Callback when time limit reached |

## 🎯 Use Cases

- **Meeting Controls Bar**: Display in toolbar alongside other controls
- **Dashboard Widget**: Show active meeting duration
- **Recording Indicator**: Track recording time
- **Breakout Rooms**: Monitor breakout session duration
- **Scheduled Meetings**: Count down to end time

## 🖼️ Visual Design

The component features:
- **Glassmorphism effect** with backdrop blur
- **Neon accents** matching DarkMeet theme
- **Smooth animations** on progress bar
- **Color-coded states** for quick recognition
- **Monospace font** for timer display

## 🔧 Technical Details

### Dependencies
- React
- TypeScript
- Tailwind CSS
- Lucide React icons (Clock, Timer, AlertCircle)

### Time Formatting
- Under 1 hour: `MM:SS` (e.g., "15:30")
- Over 1 hour: `HH:MM:SS` (e.g., "01:15:30")

### Warning Logic
- Warning triggers at 90% of `maxDuration`
- Progress bar color changes
- Alert icon replaces clock icon
- Warning message appears

### Performance
- Updates every second
- Cleanup on unmount prevents memory leaks
- Minimal re-renders using state updates

## 📱 Integration Example

### In Meeting Room Component

```tsx
// app/meeting/[roomId]/page.tsx
import MeetingTimer from '@/components/meeting/meeting-timer';

export default function MeetingRoom() {
  const [meetingStart] = useState(new Date());

  return (
    <div className="meeting-interface">
      {/* Other components */}
      
      <div className="controls-bar">
        <MeetingTimer 
          startTime={meetingStart}
          maxDuration={60}
          onTimeLimit={() => {
            // Auto-end meeting or show warning
          }}
        />
      </div>
    </div>
  );
}
```

## 🎨 Styling

The component uses Tailwind CSS classes compatible with DarkMeet's theme:
- `bg-gray-900/50` - Semi-transparent dark background
- `backdrop-blur-lg` - Glassmorphism effect
- `border-gray-800` - Subtle borders
- Gradient progress bars
- Smooth transitions

## 🔄 Future Enhancements

Potential additions:
- Pause/resume functionality
- Overtime tracking
- Multiple time zone display
- Speaking time per participant
- Meeting analytics integration
- Export timer data

## 👨‍💻 Author

**Ashvin**
- GitHub: [@ashvin2005](https://github.com/ashvin2005)
- LinkedIn: [ashvin-tiwari](https://linkedin.com/in/ashvin-tiwari)

## 🎃 Hacktoberfest 2025

Created as part of Hacktoberfest 2025 contributions to DarkMeet.

## 📄 License

MIT License - Same as DarkMeet project

---

Made with ❤️ for the DarkMeet community