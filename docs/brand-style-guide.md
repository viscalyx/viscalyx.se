# Viscalyx.se Visual Style Guide

## Brand Overview

Viscalyx.se is a modern web development consultancy focused on automation, productivity, and technical excellence. Our visual identity reflects professionalism, innovation, and technical competence while maintaining accessibility and user-friendly design.

## Logo & Brand Mark

### Primary Logo

- **Main Logo**: Viscalyx wordmark with accompanying favicon
- **Favicon**: 32x32px favicon used as brand mark
- **Usage**: Logo should always maintain proper spacing and contrast
- **Variations**:
  - Light mode: Dark text on light background
  - Dark mode: Light text on dark background

### Logo Guidelines

- **Minimum size**: 32px height for digital usage
- **Clear space**: Minimum 16px clear space around logo
- **Placement**: Top-left corner of navigation, centered in hero sections
- **Animation**: Subtle hover scale (1.05x) for interactive elements

## Color Palette

### Primary Colors (Blue Scale)

```css
primary-50:  #eff6ff  /* Light blue background */
primary-100: #dbeafe  /* Very light blue */
primary-200: #bfdbfe  /* Light blue */
primary-300: #93c5fd  /* Medium light blue */
primary-400: #60a5fa  /* Medium blue */
primary-500: #3b82f6  /* Standard blue */
primary-600: #2563eb  /* Primary brand blue */
primary-700: #1d4ed8  /* Dark blue */
primary-800: #1e40af  /* Darker blue */
primary-900: #1e3a8a  /* Darkest blue */
```

### Secondary Colors (Gray Scale)

```css
secondary-50:  #f8fafc  /* Off-white */
secondary-100: #f1f5f9  /* Very light gray */
secondary-200: #e2e8f0  /* Light gray */
secondary-300: #cbd5e1  /* Medium light gray */
secondary-400: #94a3b8  /* Medium gray */
secondary-500: #64748b  /* Standard gray */
secondary-600: #475569  /* Dark gray */
secondary-700: #334155  /* Darker gray */
secondary-800: #1e293b  /* Very dark gray */
secondary-900: #0f172a  /* Almost black */
secondary-950: #020617  /* Darkest gray */
```

### Accent Colors

- **Success**: Green variants (emerald-400 to emerald-600)
- **Warning**: Orange variants (orange-400 to orange-600)
- **Error**: Red variants (red-400 to red-600)
- **Info**: Blue variants (blue-400 to blue-600)

### Color Usage Guidelines

- **Primary blue**: CTAs, links, key actions, brand elements
- **Secondary gray**: Text, backgrounds, borders, neutral elements
- **White**: Clean backgrounds, cards, content areas
- **Accent colors**: Status indicators, alerts, highlights

## Typography

### Font Family

- **Primary**: Inter (system-ui fallback)
- **Fallback**: system-ui, sans-serif
- **Usage**: All text elements use Inter for consistency

### Font Sizes & Hierarchy

```css
text-xs:   0.75rem  /* 12px - Small labels */
text-sm:   0.875rem /* 14px - Small text */
text-base: 1rem     /* 16px - Body text */
text-lg:   1.125rem /* 18px - Large body */
text-xl:   1.25rem  /* 20px - Large text */
text-2xl:  1.5rem   /* 24px - Small headings */
text-3xl:  1.875rem /* 30px - Medium headings */
text-4xl:  2.25rem  /* 36px - Large headings */
text-5xl:  3rem     /* 48px - Hero headings */
text-6xl:  3.75rem  /* 60px - Large hero */
text-7xl:  4.5rem   /* 72px - Huge hero */
```

### Font Weights

- **Light**: 300 - Subtle text
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings
- **Extrabold**: 800 - Hero text

### Typography Guidelines

- **Line Height**: 1.5 for body text, 1.2 for headings
- **Letter Spacing**: Default for body, slightly condensed for headings
- **Text Color**:
  - Light mode: `secondary-900` for headings, `secondary-700` for body
  - Dark mode: `secondary-100` for headings, `secondary-300` for body

## Spacing & Layout

### Spacing Scale

```css
0.5:  0.125rem  /* 2px  - Tiny gaps */
1:    0.25rem   /* 4px  - Small gaps */
2:    0.5rem    /* 8px  - Medium gaps */
3:    0.75rem   /* 12px - Standard gaps */
4:    1rem      /* 16px - Large gaps */
6:    1.5rem    /* 24px - Extra large gaps */
8:    2rem      /* 32px - Section gaps */
12:   3rem      /* 48px - Large sections */
16:   4rem      /* 64px - Major sections */
20:   5rem      /* 80px - Hero sections */
```

### Layout Patterns

- **Container**: Max-width 80rem (1280px) with auto margins
- **Section Padding**: 4rem vertical, responsive horizontal
- **Component Spacing**: 1.5-2rem between major elements
- **Card Padding**: 1.5rem (24px) standard, 2rem (32px) for large cards

## Components & UI Elements

### Buttons

#### Primary Button

```css
/* Style */
background: primary-600
hover: primary-700
text: white
padding: 0.75rem 1.5rem
border-radius: 0.5rem
font-weight: 500
transition: all 200ms
transform: hover:scale(1.05)
focus-ring: primary-200
```

#### Secondary Button

```css
/* Style */
background: white
hover: secondary-50
border: 1px solid secondary-200
text: secondary-900
padding: 0.75rem 1.5rem
border-radius: 0.5rem
font-weight: 500
transition: all 200ms
transform: hover:scale(1.05)
focus-ring: secondary-200
```

### Cards

```css
/* Style */
background: white
border-radius: 0.5rem
box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
hover: shadow-xl, transform: translateY(-0.5rem)
transition: all 300ms
padding: 1.5rem
```

### Forms

- **Input Fields**: White background, gray border, focus state with primary color
- **Labels**: Medium font weight, secondary-700 color
- **Validation**: Green for success, red for errors
- **Placeholder**: Light gray text

## Dark Mode

### Color Adaptations

- **Backgrounds**: `secondary-900` primary, `secondary-800` secondary
- **Text**: `secondary-100` headings, `secondary-300` body
- **Borders**: `secondary-700` primary, `secondary-600` secondary
- **Cards**: `secondary-800` background with `secondary-700` borders

### Component Adaptations

- **Primary Button**: `primary-500` background, `primary-600` hover
- **Secondary Button**: `secondary-800` background, `secondary-700` hover
- **Navigation**: `secondary-900` with opacity blur effect

## Iconography

### Icon Library

- **Primary**: Lucide React icons
- **Style**: Outlined, 24px default size
- **Colors**: Inherit from parent or use primary/secondary colors
- **Usage**: Consistent sizing and alignment

### Icon Collections

- **Social**: GitHub, LinkedIn, Twitter, Email
- **Blog**: Calendar, User, Clock, Tag, Arrow
- **UI**: Menu, Close, Settings, Arrow, Check

## Animation & Interactions

### Motion Principles

- **Subtle**: Prefer subtle animations over dramatic ones
- **Purposeful**: Animations should enhance usability
- **Consistent**: Use consistent timing and easing
- **Accessibility**: Respect `prefers-reduced-motion`

### Common Animations

```css
/* Fade In */
opacity: 0 → 1
duration: 0.5s
easing: ease-in-out

/* Slide Up */
transform: translateY(20px) → translateY(0)
opacity: 0 → 1
duration: 0.5s
easing: ease-out

/* Hover Scale */
transform: scale(1) → scale(1.05)
duration: 0.2s
easing: ease-in-out

/* Card Hover */
transform: translateY(0) → translateY(-8px)
box-shadow: lg → xl
duration: 0.3s
easing: ease-out
```

## Accessibility

### Color Contrast

- **WCAG AA**: Minimum 4.5:1 for normal text
- **WCAG AAA**: Minimum 7:1 for enhanced accessibility
- **Large Text**: Minimum 3:1 contrast ratio

### Focus States

- **Visible**: Clear focus indicators with primary color
- **Keyboard Navigation**: Tab order follows logical flow
- **Screen Readers**: Proper ARIA labels and semantic HTML

## Code Syntax Highlighting

### Light Theme Colors

```css
comment:     #6b7280  /* gray-500 */
punctuation: #374151  /* gray-700 */
property:    #dc2626  /* red-600 */
selector:    #059669  /* green-600 */
operator:    #d97706  /* amber-600 */
keyword:     #2563eb  /* blue-600 */
function:    #7c3aed  /* violet-600 */
variable:    #ea580c  /* orange-600 */
```

### Dark Theme Colors

```css
comment:     #9ca3af  /* gray-400 */
punctuation: #d1d5db  /* gray-300 */
property:    #f87171  /* red-400 */
selector:    #34d399  /* green-400 */
operator:    #fbbf24  /* amber-400 */
keyword:     #60a5fa  /* blue-400 */
function:    #a78bfa  /* violet-400 */
variable:    #fb923c  /* orange-400 */
```

## Usage Guidelines

### Do's

- ✅ Use consistent spacing throughout
- ✅ Maintain proper color contrast
- ✅ Follow responsive design patterns
- ✅ Use Inter font family consistently
- ✅ Implement proper focus states
- ✅ Use semantic HTML elements
- ✅ Maintain consistent hover states

### Don'ts

- ❌ Mix different font families
- ❌ Use colors outside the defined palette
- ❌ Ignore accessibility requirements
- ❌ Use excessive animations
- ❌ Break responsive design patterns
- ❌ Forget focus indicators
- ❌ Use insufficient color contrast

## File Structure

### CSS Organization

```
app/
├── globals.css              # Global styles, components
├── prism-theme.css          # Code syntax highlighting
└── code-block-components.css # Code block styling

tailwind.config.js           # Tailwind configuration
```

### Component Structure

```
components/
├── Header.tsx               # Navigation with logo
├── Hero.tsx                 # Hero section with branding
├── Footer.tsx               # Footer with brand consistency
├── ThemeToggle.tsx          # Dark/light mode toggle
└── [Component].tsx          # Other branded components
```

## Brand Voice & Tone

### Visual Characteristics

- **Professional**: Clean, organized, trustworthy
- **Modern**: Contemporary design patterns
- **Technical**: Precise, well-crafted details
- **Approachable**: User-friendly, accessible
- **Innovative**: Forward-thinking, cutting-edge

### Application

- **Navigation**: Clear, logical, hierarchical
- **Content**: Well-structured, scannable
- **Interactions**: Smooth, responsive, intuitive
- **Feedback**: Clear, helpful, constructive

## Implementation Notes

### CSS Classes

- Use Tailwind utility classes for consistency
- Custom components defined in `@layer components`
- Responsive design with mobile-first approach
- Dark mode using `class` strategy

### Component Patterns

- Consistent prop interfaces
- Proper TypeScript typing
- Accessibility considerations
- Responsive design patterns

### Performance

- Optimized images with Next.js Image component
- Efficient CSS with Tailwind's purging
- Smooth animations with Framer Motion
- Proper semantic HTML structure

---

This style guide serves as the foundation for maintaining visual consistency across the Viscalyx.se website. All design decisions should align with these guidelines to ensure a cohesive brand experience.
