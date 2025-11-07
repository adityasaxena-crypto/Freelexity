# Freelexity Design System
**Perplexity-Inspired Minimalist Search Interface**

## Overview
This design system follows Perplexity's core philosophy: combining search engine simplicity with AI conversational UI through generous whitespace, clear hierarchy, and a dark theme optimized for reading.

---

## Design Foundation

### Core Philosophy
- **Search-First**: The search bar is the hero element, centered and prominent
- **Minimalist**: Clean interface with no unnecessary UI elements
- **Fast Information Retrieval**: Quick access to answers with inline citations
- **Dark Mode**: Default dark theme optimized for extended reading
- **Generous Whitespace**: Breathing room between elements using 8px grid

---

## Color Palette

### Dark Mode (Default)
```css
/* Background Colors */
--color-bg-primary: #0f1117     /* Main background */
--color-bg-secondary: #1a1d29   /* Cards, input fields */
--color-bg-tertiary: #24273a    /* Hover states, elevated elements */
--color-bg-hover: #2a2d3e       /* Interactive hover */

/* Text Colors */
--color-text-primary: #f0f2f5   /* Main text, high contrast */
--color-text-secondary: #a0a4b8 /* Supporting text */
--color-text-tertiary: #6b7280  /* Subtle text, placeholders */

/* Accent Colors - Cyan/Teal */
--color-accent-primary: #20d9d2   /* Primary actions, links */
--color-accent-secondary: #18b2ac /* Hover states */
--color-accent-tertiary: #0d9488  /* Gradient end */

/* UI Elements */
--color-border: #2a2d3e
--color-border-hover: #3a3d4e
--color-success: #22c55e
--color-error: #ef4444
--color-warning: #f59e0b
```

---

## Typography

### Font Families
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace
```

### Font Sizes
```css
--text-xs: 12px    /* Small labels, metadata */
--text-sm: 14px    /* Body text in cards */
--text-base: 16px  /* Main body text */
--text-lg: 18px    /* Subheadings */
--text-xl: 20px    /* User queries */
--text-2xl: 24px   /* Section headings */
--text-3xl: 32px   /* Hero text */
```

### Line Heights
```css
--line-height-tight: 1.25    /* Headings */
--line-height-normal: 1.5    /* Body text */
--line-height-relaxed: 1.75  /* Reading content */
```

---

## Spacing System (8px Grid)

All spacing uses multiples of 8px for consistency:

```css
--space-xs: 4px    /* 0.5x - Tight spacing */
--space-sm: 8px    /* 1x - Base unit */
--space-md: 16px   /* 2x - Standard spacing */
--space-lg: 24px   /* 3x - Section spacing */
--space-xl: 32px   /* 4x - Large spacing */
--space-2xl: 48px  /* 6x - Major sections */
--space-3xl: 64px  /* 8x - Hero sections */
```

---

## Border Radius

```css
--radius-sm: 8px     /* Small elements */
--radius-md: 12px    /* Buttons, inputs */
--radius-lg: 16px    /* Cards, containers */
--radius-xl: 24px    /* Large cards */
--radius-full: 9999px /* Pills, badges */
```

---

## Layout Structure

### 1. Header (Minimal)
- **Height**: Auto (minimal padding)
- **Max Width**: 880px
- **Sticky**: Yes, always visible
- **Elements**: Logo + Brand (left), New Chat button (right, when active)

### 2. Main Content
- **Max Width**: 880px (reading-optimized width)
- **Centered**: Always
- **Padding**: 24px horizontal

### 3. Search Bar (Hero Element)
- **Position**: Centered vertically when no messages
- **Width**: 100% of content area (max 680px)
- **Style**: Dark background, subtle border, 16px radius
- **Focus**: Accent color outline

### 4. Messages Thread
- **Layout**: Vertical thread
- **Spacing**: 64px between messages
- **User Query**: Bold, 20px, bottom border
- **AI Answer**: Regular text, 16px, relaxed line height

### 5. Source Cards
- **Layout**: Grid (auto-fill, min 280px)
- **Style**: Dark cards with hover effect
- **Content**: Title (14px), Domain (12px)
- **Limit**: Show top 3 sources

---

## Component Styling

### Search Input
```css
padding: 16px
background: var(--color-bg-secondary)
border: 1px solid var(--color-border)
border-radius: var(--radius-lg)
font-size: var(--text-base)
color: var(--color-text-primary)
```

### Search Button
```css
padding: 8px 24px
background: var(--color-accent-primary)
color: var(--color-bg-primary)
border-radius: var(--radius-md)
font-size: var(--text-sm)
font-weight: 600
transition: 150ms ease-in-out
```

### Source Card
```css
padding: 16px
background: var(--color-bg-secondary)
border: 1px solid var(--color-border)
border-radius: var(--radius-md)
transition: 150ms ease-in-out

/* Hover */
background: var(--color-bg-tertiary)
border-color: var(--color-border-hover)
```

### Badge (Search Indicator)
```css
padding: 4px 16px
background: var(--color-bg-secondary)
border: 1px solid var(--color-border)
border-radius: var(--radius-full)
font-size: var(--text-xs)
color: var(--color-accent-primary)
```

---

## Micro-interactions

### Transitions
```css
--transition-fast: 150ms ease-in-out   /* Hover effects */
--transition-base: 250ms ease-in-out   /* Standard animations */
--transition-slow: 350ms ease-in-out   /* Complex animations */
```

### Animations

**Fade In**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Pulse Glow** (Loading states)
```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(32, 217, 210, 0.1); }
  50% { box-shadow: 0 0 20px rgba(32, 217, 210, 0.3); }
}
```

---

## Responsive Breakpoints

### Mobile (< 640px)
- Reduce max-width to 100%
- Adjust padding to 16px
- Stack source cards vertically
- Reduce font sizes by 1 step

### Tablet (640px - 1024px)
- Max width: 760px
- Standard spacing
- 2-column source grid

### Desktop (> 1024px)
- Max width: 880px
- Full spacing
- 3-column source grid (when applicable)

---

## Accessibility (WCAG AA)

### Color Contrast
- Text on primary background: 4.5:1 minimum
- Accent colors on dark: 4.5:1 minimum
- Interactive elements clearly distinguishable

### Focus States
- Visible 2px outline using accent color
- 2px offset from element
- Applies to all interactive elements

### Keyboard Navigation
- Tab order follows visual flow
- Enter to submit forms
- Escape to clear input

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Descriptive alt text for icons

---

## Key Design Patterns

### 1. Search-First Interface
- **Empty State**: Large centered search with hero message
- **Active State**: Search bar moves to bottom, sticky
- **Always Accessible**: Search available at all times

### 2. Inline Citations
- **Badges**: Small pills indicating web search used
- **Source Cards**: Grid of clickable cards below answer
- **Transparency**: Always show when sources were used

### 3. Clean Hierarchy
- **User Query**: Large, bold, separated by border
- **AI Answer**: Regular weight, relaxed reading
- **Sources**: Smaller, in cards below answer
- **Metadata**: Smallest, subtle color

### 4. Generous Whitespace
- **Between Messages**: 64px vertical spacing
- **Section Padding**: 24px minimum
- **Component Spacing**: 16px standard gap

### 5. Dark Theme Optimization
- **Reduced Eye Strain**: Low contrast backgrounds
- **Accent Pop**: Cyan/teal stands out cleanly
- **Reading Comfort**: Warm white text (#f0f2f5)

---

## Implementation Notes

### CSS Variables
All colors, spacing, and typography use CSS custom properties for easy theming and consistency.

### Inline Styles
Currently using inline styles for rapid prototyping. Can be converted to CSS modules or styled-components for production.

### Animations
Kept minimal and purposeful - only fade-ins for new content and loading states.

### Performance
- No heavy shadows or effects
- Simple transitions (150-250ms)
- Minimal DOM nesting

---

## Future Enhancements

- [ ] Light mode variant
- [ ] Custom font loading (Inter)
- [ ] Skeleton loading states
- [ ] Progressive image loading
- [ ] Syntax highlighting for code blocks
- [ ] Markdown rendering support
- [ ] Copy-to-clipboard buttons
- [ ] Share conversation feature
- [ ] Mobile-optimized gestures

---

Built with inspiration from Perplexity's clean, search-first interface design.
