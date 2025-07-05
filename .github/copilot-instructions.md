# Copilot Instructions for Viscalyx.se

This document provides instructions for AI agents working on the Viscalyx.se project - a multilingual Next.js website with TypeScript, Tailwind CSS, and Cloudflare deployment.

## Project Overview

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: next-intl with English and Swedish support
- **Testing**: Vitest with JSDOM environment
- **Deployment**: Cloudflare Workers with OpenNext
- **Animation**: Framer Motion for UI animations
- **Content**: Markdown blog posts with frontmatter

## Code Style & Conventions

### TypeScript Standards

- Use strict TypeScript settings
- Prefer to use explicit typing over `any`
- Use proper interface definitions for props
- Follow Next.js 15 and React 19 patterns
- Use functional components with hooks

### Component Structure

```typescript
'use client' // Only when needed for client-side features

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ComponentName } from 'lucide-react'

interface ComponentProps {
  // Define props with proper types
}

const Component = ({ prop }: ComponentProps) => {
  const t = useTranslations('section')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="responsive-classes"
    >
      {/* Component content */}
    </motion.div>
  )
}

export default Component
```

### File Organization

- Components: `/components/ComponentName.tsx`
- Icon Collections: `/components/*Icons.tsx` (e.g., `BlogIcons.tsx`, `SocialIcons.tsx`)
- Tests: `/components/__tests__/ComponentName.test.tsx`
- Pages: `/app/[locale]/page.tsx` (App Router)
- Layouts: `/app/[locale]/layout.tsx`
- Utilities: `/lib/utility-name.ts`
- Content: `/content/blog/post-name.md`
- Translations: `/messages/en.json`, `/messages/sv.json`

## Styling Guidelines

### Tailwind CSS Patterns

- Use mobile-first responsive design
- Leverage custom color palette (primary, secondary, accent)
- Dark mode support with `dark:` prefix
- Consistent spacing with design system
- Animation with Framer Motion, not Tailwind animations

### Color System

```css
primary: { 50-950 } /* Blue scale */
secondary: { 50-950 } /* Purple scale */
accent: { 50-950 } /* Orange scale */
```

### Common Patterns

```typescript
// Responsive containers
<div className="container mx-auto px-4 sm:px-6 lg:px-8">

// Cards with proper shadows and hover states
<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow">

// Buttons with consistent styling
<button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
```

## Internationalization (i18n)

### Translation Keys Structure

- Organize by component/section: `navigation.about`, `hero.title`
- Use nested objects for related content
- Keep keys descriptive and consistent
- Both English (`en.json`) and Swedish (`sv.json`) must be maintained

### Usage Pattern

```typescript
const t = useTranslations('sectionName')

// Simple translation
<h1>{t('title')}</h1>

// With interpolation
<p>{t('description', { name: 'value' })}</p>
```

### Adding New Translations

1. Add key to both `/messages/en.json` and `/messages/sv.json`
2. Use descriptive, hierarchical keys
3. Keep translations consistent in tone and style

## Testing Standards

### Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ComponentName from '../ComponentName'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    // Add other motion elements as needed
  },
  useInView: () => true,
  AnimatePresence: ({ children }) => <>{children}</>,
}))

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

### Test Coverage Requirements

- All components should have basic rendering tests
- Interactive components need user interaction tests
- Utility functions require comprehensive unit tests
- Aim for high test coverage but focus on critical paths

## Blog Content Management

### Markdown Frontmatter

```yaml
---
title: 'Post Title'
date: '2025-01-01'
author: 'Author Name'
excerpt: 'Brief summary for listings and SEO'
image: 'https://images.unsplash.com/photo-id?w=1200&h=600&fit=crop&crop=center'
tags: ['tag1', 'tag2', 'tag3']
category: 'Category Name'
readTime: '5 min read' # Auto-calculated if not provided
---
```

### Content Guidelines

- Use semantic HTML in markdown
- Include proper alt text for images
- Follow SEO best practices
- Code blocks should specify language for syntax highlighting
- Use blockquotes for important callouts

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Production build
npm run preview            # Preview production build

# Quality Assurance
npm run check              # Run all checks (lint, test, type, format, spell)
npm run test               # Run tests
npm run test:watch         # Watch mode testing
npm run test:coverage      # Coverage report
npm run lint               # ESLint
npm run type-check         # TypeScript checking
npm run format             # Prettier formatting
npm run spell              # Spell checking

# Deployment
npm run deploy             # Deploy to Cloudflare
```

### Pre-commit Requirements

- All tests must pass
- No TypeScript errors
- Code must be formatted with Prettier
- ESLint rules must be satisfied
- Spell check must pass

## Component Development

### Animation Patterns

```typescript
// Scroll-triggered animations
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6 }}
>
```

### Icon Usage

- Use `lucide-react` for consistent iconography
- Create reusable icon collections in `/components/*Icons.tsx` files (e.g., `BlogIcons.tsx`, `SocialIcons.tsx`)
- Import only needed icons to optimize bundle size
- Maintain consistent icon sizing and styling
- Group related icons in dedicated icon component files for better organization

### State Management

- Use React hooks for component state
- Prefer built-in hooks over external state management
- Context for theme and global state only

## Performance Considerations

### Next.js Optimization

- Use Next.js `Image` component for all images
- Implement proper loading states
- Lazy load components below the fold
- Optimize fonts with `next/font`

### Bundle Optimization

- Tree-shake unused imports
- Use dynamic imports for large components
- Minimize third-party dependencies
- Monitor bundle size with analyzer

## Deployment & Environment

### Cloudflare Workers

- Uses OpenNext for Next.js compatibility
- Environment variables in Wrangler configuration
- Analytics integration with Cloudflare Analytics Engine
- Asset optimization through Cloudflare CDN

### Environment Setup

- Development: `npm run dev`
- Preview: `npm run preview` (Cloudflare Workers simulation)
- Production: Automatic deployment via Cloudflare

## Error Handling

### Component Error Boundaries

- Implement error boundaries for critical components
- Provide fallback UI for failed states
- Log errors appropriately for debugging

### Form Validation

- Use proper form validation patterns
- Provide clear error messages
- Maintain accessibility standards

## Accessibility Standards

### ARIA and Semantic HTML

- Use semantic HTML elements
- Proper heading hierarchy (h1, h2, h3...)
- ARIA labels for complex interactions
- Keyboard navigation support
- Screen reader compatibility

### Color and Contrast

- Maintain WCAG AA contrast ratios
- Dark mode support
- Color-blind friendly palette
- Focus indicators for interactive elements

## Security Considerations

### Content Security

- Sanitize HTML content (using sanitize-html)
- Validate external links
- Secure image handling
- XSS prevention in markdown rendering

### Dependencies

- Regular security audits with `npm run test:security`
- Keep dependencies updated
- Use trusted packages only
- Monitor for vulnerabilities

## Code Generation Guidelines

When generating code for this project:

1. **Follow established patterns** from existing components
2. **Include proper TypeScript types** for all props and variables
3. **Add internationalization support** with next-intl
4. **Implement responsive design** with Tailwind CSS
5. **Include basic tests** for new components
6. **Add proper documentation** in code comments
7. **Consider accessibility** from the start
8. **Use existing utilities** and patterns when possible
9. **Maintain consistent styling** with the design system
10. **Test thoroughly** before considering complete

## Common Anti-patterns to Avoid

- Don't use `any` type without justification
- Don't hardcode strings (use translations)
- Don't use inline styles (use Tailwind classes)
- Don't forget to add tests for new components
- Don't ignore accessibility requirements
- Don't use deprecated React patterns
- Don't mix client and server component patterns incorrectly
- Don't forget to handle loading and error states
- Don't use external libraries without consideration of bundle size
- Don't skip TypeScript type checking

## Questions to Ask When Uncertain

1. Does this component need to be client-side?
2. Are all strings properly internationalized?
3. Is this component accessible?
4. Are there existing utilities I can reuse?
5. Does this follow the established design patterns?
6. Are proper TypeScript types defined?
7. Are tests included and meaningful?
8. Is the component responsive?
9. Does it handle error states appropriately?
10. Is the performance impact acceptable?

Follow these guidelines to maintain code quality, consistency, and user experience standards throughout the project.
