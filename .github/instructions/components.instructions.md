---
applyTo: 'components/**/*.tsx'
---

# Components

## Structure

1. `'use client'` (only if hooks/events/animations)
2. Imports: `@/components`, `@/lib` → Third-party → `next`, `next/*`, `next-intl` → `react` → Relative → Types
3. `interface ComponentProps { }`
4. Arrow function component
5. `export default`

## Client Islands

Components in `components/` are typically `'use client'` islands that receive data as props from server page components in `app/`. Keep them focused on interactivity — data fetching and heavy processing belong in the server page.

Examples:

- `BlogPostGrid` — receives `allPosts` from server, handles client-side category filtering and pagination
- `BlogPostContent` — receives post data and processed HTML from server, handles share, analytics, scroll tracking

## Required

- `useTranslations('section')` for all UI text (client components only; server components use `getTranslations`)
- `dark:` variants in Tailwind classes
- ARIA labels on interactive elements
- Semantic HTML, proper heading order

### Responsive (mobile + desktop)

- Mobile-first: base styles for small screens, add `sm:`, `md:`, `lg:` for larger viewports
- All layouts must work from 320px to 1440px+ (single-column mobile → multi-column desktop)
- Touch targets: buttons and links need `min-h-[44px] min-w-[44px]`
- No fixed widths — use responsive/fluid sizing (`w-full`, `max-w-*`, `flex`, `grid`)
- Test layout mentally at mobile and desktop before submitting

## Animation Patterns

Use Framer Motion for scroll-triggered animations:

```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6 }}
>
```

## Images

- Always use `next/image` for all images
- Include `alt` text for accessibility
- Use `next/font/google` for fonts (configured in `app/layout.tsx`)

## Loading States

- Implement `isLoading` state for async operations
- Disable buttons during loading: `disabled={isLoading}`
- Show loading feedback: `{isLoading ? t('saving') : t('save')}`

## Lazy Loading

- Use dynamic imports for large libraries (see `MermaidRenderer.tsx`)
- Lazy load components below the fold

## After Changes

1. Add/update test: `__tests__/ComponentName.test.tsx`
2. Add translations to `messages/en.json` AND `messages/sv.json`
3. Run `npm run check`
