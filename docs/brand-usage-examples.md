# Brand System Usage Examples

This document provides practical examples of how to use the Viscalyx brand system in your components.

## Quick Start

### 1. Import Brand Components

```tsx
import {
  BrandShowcase,
  BRAND_COLORS,
  BRAND_TYPOGRAPHY,
} from '@/components/brand'
```

### 2. Basic Brand Usage

```tsx
// Using brand colors
<div className="bg-primary-600 text-white p-4">
  <h1 className="text-gradient">Viscalyx</h1>
  <p className="text-secondary-100">Modern web development</p>
</div>

// Using brand typography
<h1 className="text-4xl font-bold text-gradient">
  Hero Heading
</h1>
<p className="text-lg text-secondary-700 dark:text-secondary-300">
  Body text with proper contrast
</p>
```

### 3. Interactive Elements

```tsx
// Branded buttons
<button className="btn-primary">
  Primary Action
</button>
<button className="btn-secondary">
  Secondary Action
</button>

// Hover effects
<div className="card-hover bg-white dark:bg-secondary-800 p-6 rounded-lg">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-secondary-600 dark:text-secondary-400">
    Card content with hover animation
  </p>
</div>
```

## Advanced Patterns

### 1. Custom Components with Brand Colors

```tsx
import { BRAND_COLORS } from '@/components/brand'

const CustomAlert = ({ type, children }) => {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>{children}</div>
  )
}
```

### 2. Responsive Brand Layouts

```tsx
const BrandedSection = ({ children }) => (
  <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
    <div className="container-custom">{children}</div>
  </section>
)
```

### 3. Brand Animation Patterns

```tsx
import { motion } from 'framer-motion'

const BrandedCard = ({ children }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
  >
    {children}
  </motion.div>
)
```

## Theme Integration

### 1. Dark Mode Support

```tsx
// All brand components support dark mode automatically
<div className="bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100">
  <h1 className="text-gradient">Works in both themes</h1>
</div>
```

### 2. Theme Toggle Usage

```tsx
import { ThemeToggle } from '@/components/brand'

const Navigation = () => (
  <nav className="flex items-center justify-between p-4">
    <div className="text-gradient font-bold text-xl">Viscalyx</div>
    <ThemeToggle />
  </nav>
)
```

## Accessibility Considerations

### 1. Focus States

```tsx
// All interactive elements include focus states
<button className="btn-primary focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800">
  Accessible Button
</button>
```

### 2. Color Contrast

```tsx
// Use high contrast text combinations
<div className="bg-primary-600 text-white">
  {' '}
  {/* 4.5:1 ratio */}
  <p>High contrast text</p>
</div>
```

### 3. Semantic HTML

```tsx
// Use proper semantic structure
<article className="bg-white dark:bg-secondary-800 rounded-lg p-6">
  <header>
    <h2 className="text-xl font-bold mb-2">Article Title</h2>
    <time className="text-sm text-secondary-600">2024-01-01</time>
  </header>
  <main>
    <p className="text-secondary-700 dark:text-secondary-300">
      Article content with proper semantic structure
    </p>
  </main>
</article>
```

## Performance Tips

### 1. Efficient CSS Classes

```tsx
// Group related classes
const cardClasses = "bg-white dark:bg-secondary-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"

<div className={cardClasses}>
  Card content
</div>
```

### 2. Conditional Styling

```tsx
// Use clsx for conditional classes
import clsx from 'clsx'

const Button = ({ variant, disabled, children }) => (
  <button
    className={clsx('px-4 py-2 rounded-lg font-medium transition-colors', {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled,
    })}
  >
    {children}
  </button>
)
```

### 3. Animation Performance

```tsx
// Use transform and opacity for smooth animations
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Optimized animation
</motion.div>
```

## Common Patterns

### 1. Hero Section

```tsx
const HeroSection = () => (
  <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
    <div className="container-custom text-center">
      <h1 className="text-5xl lg:text-7xl font-bold text-gradient mb-6">
        Welcome to Viscalyx
      </h1>
      <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-2xl mx-auto">
        Modern web development solutions
      </p>
      <div className="flex gap-4 justify-center">
        <button className="btn-primary">Get Started</button>
        <button className="btn-secondary">Learn More</button>
      </div>
    </div>
  </section>
)
```

### 2. Feature Cards

```tsx
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card-hover bg-white dark:bg-secondary-800 rounded-lg p-6">
    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
    </div>
    <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
      {title}
    </h3>
    <p className="text-secondary-600 dark:text-secondary-400">{description}</p>
  </div>
)
```

### 3. Navigation

```tsx
const Navigation = () => (
  <nav className="bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-700">
    <div className="container-custom">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <img src="/favicon-32x32.png" alt="Viscalyx" className="w-8 h-8" />
          <span className="text-xl font-bold text-gradient">Viscalyx</span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            About
          </a>
          <a
            href="#"
            className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Services
          </a>
          <button className="btn-primary">Contact</button>
        </div>
      </div>
    </div>
  </nav>
)
```

## Troubleshooting

### 1. Colors Not Showing

- Ensure Tailwind CSS is properly configured
- Check that custom colors are defined in `tailwind.config.js`
- Verify dark mode is set up correctly

### 2. Animations Not Working

- Ensure Framer Motion is installed
- Check that `initial` and `animate` props are set
- Verify `prefers-reduced-motion` is not blocking animations

### 3. Responsive Issues

- Use mobile-first approach
- Test on multiple breakpoints
- Ensure proper container classes are used

For more detailed information, refer to the [Complete Brand Style Guide](brand-style-guide.md).
