# DarkMeet UI/UX Design System

## Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing and Layout](#spacing-and-layout)
- [Components](#components)
- [Animations](#animations)
- [Glassmorphism Effects](#glassmorphism-effects)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)
- [Dark Theme Guidelines](#dark-theme-guidelines)

## Overview

DarkMeet's design system emphasizes a modern, dark aesthetic with neon accents, glassmorphism effects, and smooth animations. The design prioritizes user experience, accessibility, and visual appeal while maintaining performance.

## Design Philosophy

### Core Principles

1. **Dark-First Design**: Built for extended use with reduced eye strain
2. **Visual Hierarchy**: Clear distinction between primary, secondary, and tertiary elements
3. **Consistency**: Uniform patterns across all components and pages
4. **Performance**: Lightweight animations that don't compromise functionality
5. **Accessibility**: WCAG 2.1 AA compliant with high contrast ratios

### Design Goals

- Create an immersive, futuristic meeting experience
- Reduce cognitive load during long video calls
- Provide intuitive controls with minimal learning curve
- Maintain professional aesthetics suitable for business use

## Color System

### Primary Colors

```css
/* Neon Accent Colors */
--neon-cyan: #00f0ff;
--neon-pink: #ff00ff;
--neon-purple: #b900ff;
--neon-blue: #0066ff;
--neon-green: #00ff88;
```

### Background Colors

```css
/* Dark Backgrounds */
--bg-primary: #0a0a0f;        /* Main background */
--bg-secondary: #12121a;      /* Secondary surfaces */
--bg-tertiary: #1a1a24;       /* Elevated surfaces */
--bg-elevated: #22222e;       /* Cards, modals */
```

### Surface Colors

```css
/* Glass/Surface Colors */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-hover: rgba(255, 255, 255, 0.08);
```

### Text Colors

```css
/* Text Hierarchy */
--text-primary: #ffffff;      /* Main text */
--text-secondary: #b4b4be;    /* Secondary text */
--text-tertiary: #7d7d89;     /* Muted text */
--text-disabled: #4a4a54;     /* Disabled text */
```

### Semantic Colors

```css
/* Status Colors */
--success: #00ff88;           /* Success states */
--warning: #ffa500;           /* Warning states */
--error: #ff3366;             /* Error states */
--info: #00f0ff;              /* Info states */
```

### Usage Examples

```tsx
// Primary action button
<button className="bg-gradient-to-r from-neon-cyan to-neon-purple">
  Join Meeting
</button>

// Danger button
<button className="bg-gradient-to-r from-red-500 to-pink-500">
  End Meeting
</button>

// Glass card
<div className="glass-dark rounded-xl">
  Content
</div>
```

## Typography

### Font Stack

```css
/* Primary Font */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Type Scale

```css
/* Headings */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Usage Guidelines

```tsx
// Hero heading
<h1 className="text-6xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
  Welcome to DarkMeet
</h1>

// Section heading
<h2 className="text-3xl font-semibold text-white mb-4">
  Key Features
</h2>

// Body text
<p className="text-base text-secondary leading-relaxed">
  Lorem ipsum dolor sit amet...
</p>

// Small caption
<span className="text-sm text-tertiary">
  Last updated: 2 hours ago
</span>
```

## Spacing and Layout

### Spacing Scale

```css
/* Tailwind-based spacing */
0:   0px      /* 0rem */
1:   4px      /* 0.25rem */
2:   8px      /* 0.5rem */
3:   12px     /* 0.75rem */
4:   16px     /* 1rem */
5:   20px     /* 1.25rem */
6:   24px     /* 1.5rem */
8:   32px     /* 2rem */
10:  40px     /* 2.5rem */
12:  48px     /* 3rem */
16:  64px     /* 4rem */
20:  80px     /* 5rem */
24:  96px     /* 6rem */
```

### Container Sizes

```css
/* Max-width containers */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
  {cards.map(card => <VideoTile key={card.id} {...card} />)}
</div>
```

## Components

### Buttons

#### Primary Button

```tsx
<button className="btn-primary">
  Join Meeting
</button>

/* CSS */
.btn-primary {
  @apply px-6 py-3 rounded-lg font-semibold text-white;
  @apply bg-gradient-to-r from-neon-cyan to-neon-purple;
  @apply hover:opacity-90 transition-all duration-200;
  @apply active:scale-95;
}
```

#### Glass Button

```tsx
<button className="btn-glass">
  <Settings className="w-5 h-5" />
</button>

/* CSS */
.btn-glass {
  @apply p-3 rounded-lg backdrop-blur-xl;
  @apply bg-white/5 border border-white/10;
  @apply hover:bg-white/10 transition-all duration-200;
  @apply active:scale-95;
}
```

#### Danger Button

```tsx
<button className="btn-danger">
  End Meeting
</button>

/* CSS */
.btn-danger {
  @apply px-6 py-3 rounded-lg font-semibold text-white;
  @apply bg-gradient-to-r from-red-500 to-pink-500;
  @apply hover:opacity-90 transition-all duration-200;
}
```

### Cards

#### Glass Card

```tsx
<div className="glass-card">
  <h3 className="text-xl font-semibold mb-4">Card Title</h3>
  <p className="text-secondary">Card content goes here...</p>
</div>

/* CSS */
.glass-card {
  @apply p-6 rounded-xl backdrop-blur-xl;
  @apply bg-white/5 border border-white/10;
  @apply hover:bg-white/8 transition-all duration-300;
}
```

#### Elevated Card

```tsx
<div className="elevated-card">
  <div className="card-header">
    <h3>Meeting Details</h3>
  </div>
  <div className="card-body">
    Content
  </div>
</div>

/* CSS */
.elevated-card {
  @apply bg-bg-elevated rounded-xl border border-white/10;
  @apply shadow-2xl shadow-black/50;
}
```

### Inputs

#### Text Input

```tsx
<input 
  type="text"
  className="input-primary"
  placeholder="Enter meeting name"
/>

/* CSS */
.input-primary {
  @apply w-full px-4 py-3 rounded-lg;
  @apply bg-white/5 border border-white/10;
  @apply text-white placeholder-text-tertiary;
  @apply focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20;
  @apply transition-all duration-200;
}
```

#### Search Input

```tsx
<div className="search-container">
  <Search className="search-icon" />
  <input 
    type="text"
    className="search-input"
    placeholder="Search meetings..."
  />
</div>

/* CSS */
.search-container {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 -translate-y-1/2 text-tertiary;
}

.search-input {
  @apply w-full pl-10 pr-4 py-3 rounded-lg;
  @apply bg-white/5 border border-white/10;
  @apply focus:border-neon-cyan;
}
```

### Badges

```tsx
// Status badges
<span className="badge-success">Active</span>
<span className="badge-warning">Scheduled</span>
<span className="badge-error">Ended</span>

/* CSS */
.badge-success {
  @apply px-3 py-1 rounded-full text-sm font-medium;
  @apply bg-green-500/20 text-green-400 border border-green-500/30;
}

.badge-warning {
  @apply px-3 py-1 rounded-full text-sm font-medium;
  @apply bg-yellow-500/20 text-yellow-400 border border-yellow-500/30;
}
```

### Avatars

```tsx
// User avatar
<div className="avatar-container">
  <img src={avatarUrl} alt={name} className="avatar" />
  <div className="avatar-status online" />
</div>

/* CSS */
.avatar {
  @apply w-10 h-10 rounded-full object-cover;
  @apply ring-2 ring-white/20;
}

.avatar-status {
  @apply absolute bottom-0 right-0;
  @apply w-3 h-3 rounded-full border-2 border-bg-primary;
}

.avatar-status.online {
  @apply bg-green-500;
}
```

### Tooltips

```tsx
<div className="tooltip-container">
  <button>Hover me</button>
  <div className="tooltip">
    Tooltip content
  </div>
</div>

/* CSS */
.tooltip {
  @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2;
  @apply px-3 py-2 rounded-lg backdrop-blur-xl;
  @apply bg-black/90 border border-white/10;
  @apply text-sm text-white whitespace-nowrap;
  @apply opacity-0 pointer-events-none transition-opacity duration-200;
}

.tooltip-container:hover .tooltip {
  @apply opacity-100 pointer-events-auto;
}
```

## Animations

### Page Transitions

```tsx
import { motion } from 'framer-motion'

// Fade in animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide up animation
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Content
</motion.div>
```

### Button Interactions

```css
/* Hover scale */
.btn-scale {
  @apply transition-transform duration-200;
  @apply hover:scale-105 active:scale-95;
}

/* Pulse animation */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Loading States

```tsx
// Spinner
<div className="spinner" />

/* CSS */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  @apply w-8 h-8 border-4 border-white/20 border-t-neon-cyan rounded-full;
  animation: spin 1s linear infinite;
}

// Skeleton loader
<div className="skeleton" />

/* CSS */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  @apply bg-white/10 rounded-lg;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Notification Animations

```tsx
// Toast notification
<motion.div
  initial={{ x: 300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 300, opacity: 0 }}
  className="toast"
>
  Message sent successfully
</motion.div>
```

## Glassmorphism Effects

### Standard Glass

```css
.glass {
  @apply backdrop-blur-xl bg-white/5;
  @apply border border-white/10;
  @apply shadow-2xl shadow-black/20;
}
```

### Dark Glass

```css
.glass-dark {
  @apply backdrop-blur-xl bg-black/30;
  @apply border border-white/10;
  @apply shadow-2xl shadow-black/50;
}
```

### Frosted Glass

```css
.glass-frosted {
  @apply backdrop-blur-2xl backdrop-saturate-150;
  @apply bg-white/10 border border-white/20;
}
```

### Usage Example

```tsx
// Meeting controls toolbar
<div className="fixed bottom-6 left-1/2 -translate-x-1/2">
  <div className="glass-dark rounded-full px-6 py-4">
    <div className="flex items-center gap-4">
      {/* Controls */}
    </div>
  </div>
</div>
```

## Accessibility

### Color Contrast

Minimum contrast ratios (WCAG AA):
- **Normal text**: 4.5:1
- **Large text**: 3:1
- **UI components**: 3:1

```css
/* Good contrast examples */
--text-on-dark: #ffffff;        /* 21:1 ratio */
--text-secondary: #b4b4be;      /* 9.2:1 ratio */
--neon-cyan-on-dark: #00f0ff;   /* 7.8:1 ratio */
```

### Focus States

```css
/* Keyboard focus indicators */
*:focus-visible {
  @apply outline-none ring-2 ring-neon-cyan ring-offset-2 ring-offset-bg-primary;
}

/* Button focus */
.btn:focus-visible {
  @apply ring-2 ring-neon-cyan/50;
}
```

### Screen Reader Support

```tsx
// Descriptive labels
<button aria-label="Toggle microphone">
  <Mic className="w-5 h-5" />
</button>

// Hidden text for screen readers
<span className="sr-only">
  John Doe is currently speaking
</span>

// Live regions
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Keyboard Navigation

```tsx
// Ensure all interactive elements are keyboard accessible
<div 
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Content
</div>
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
sm: 640px    /* Tablet */
md: 768px    /* Small laptop */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Responsive Patterns

```tsx
// Stack on mobile, grid on desktop
<div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Responsive text sizes
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Responsive Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

### Mobile Optimization

- Touch targets minimum 44x44px
- Larger font sizes for readability
- Simplified navigation
- Optimized video grid layouts

## Dark Theme Guidelines

### Best Practices

1. **Avoid Pure Black**: Use `#0a0a0f` instead of `#000000`
2. **Layer Hierarchy**: Use progressive lightness for depth
3. **Reduce Color Intensity**: Desaturate bright colors slightly
4. **Increase White Space**: Give elements room to breathe
5. **Use Shadows Carefully**: Subtle shadows for depth

### Color Adjustments

```css
/* Light mode colors adjusted for dark */
--primary-light: #0066ff;      /* Too bright */
--primary-dark: #3388ff;       /* Better for dark theme */

--success-light: #00ff00;      /* Too intense */
--success-dark: #00ff88;       /* Softer, easier on eyes */
```

### Text on Dark

```css
/* Pure white can be harsh */
--text-harsh: #ffffff;         /* Avoid for body text */
--text-soft: #e8e8f0;          /* Better for reading */
```

---

*This design system ensures consistency, accessibility, and visual appeal across the entire DarkMeet platform.*
