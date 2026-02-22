# Copilot Instructions for Viscalyx.se

## Stack

Next.js 15 (App Router) | React 19 | TypeScript (strict) | Tailwind CSS 4 | next-intl (en/sv) | Framer Motion | Vitest | Cloudflare Workers

## File Structure

```
components/ComponentName.tsx     → Tests: components/__tests__/ComponentName.test.tsx
components/*Icons.tsx            → Icon collections (BlogIcons.tsx, SocialIcons.tsx)
lib/utility-name.ts              → Tests: lib/__tests__/utility-name.test.ts
app/[locale]/page.tsx            → App Router pages
content/blog/post-slug.md        → Blog posts (kebab-case)
messages/{en,sv}.json            → Translations
```

## Code Standards

### TypeScript

- Strict mode, explicit types, avoid `any`
- Path alias: `@/*` maps to project root (use instead of relative `../`)
- Interface for props: `interface ComponentProps { }`

### Imports (ordered, alphabetically within each group)

1. `@/lib/*`, `@/components/*` (path alias imports)
2. Third-party (`framer-motion`, `lucide-react`)
3. `next`, `next/*`, `next-intl`
4. `react`, `react-dom`
5. Relative imports (`./`, `../`)
6. Type-only imports (`import type { }`)

**Example:**

```tsx
import { getConsentSettings } from '@/lib/cookie-consent'
import { motion } from 'framer-motion'
import { Cookie, Settings } from 'lucide-react'
import { Route } from 'next'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
```

### Formatting (Prettier)

`semi: false` | `singleQuote: true` | `trailingComma: 'es5'` | `useTabs: false` | `tabWidth: 2` | `arrowParens: 'avoid'`

- Use arrow functions for components: `const Component = () => { }`
- Destructure props inline: `const Component = ({ title }: Props) => { }`
- One blank line between import groups
- No blank lines within import groups

### Client vs Server Components

**Use `'use client'`**: hooks, browser APIs, event handlers, Framer Motion, `useTranslations`
**Server Components**: static content, data fetching, SEO-critical pages, `generateMetadata`, `generateStaticParams`

**Server page + client island pattern** (preferred for data-driven pages):

- Page in `app/` is a server component that fetches data directly (e.g., `getAllPosts()`)
- Interactive parts are extracted into `'use client'` components in `components/` that receive data as props
- Use `getTranslations`/`getFormatter` (async, from `next-intl/server`) in server components
- Use `useTranslations`/`useFormatter` (hooks, from `next-intl`) in client components
- Examples: `blog/page.tsx` (server) → `BlogPostGrid` (client island), `blog/[slug]/page.tsx` (server) → `BlogPostContent` (client island)

## Component Patterns

### Client Component (interactive UI in `components/`)

```tsx
'use client'

import { useTheme } from '@/lib/theme-context'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface ComponentProps {
  title: string
}

const Component = ({ title }: ComponentProps) => {
  const t = useTranslations('section')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 dark:bg-gray-900"
    >
      <h1>{t('heading')}</h1>
    </motion.div>
  )
}

export default Component
```

### Server Page Component (data-driven pages in `app/`)

```tsx
import ClientIsland from '@/components/ClientIsland'
import { getData } from '@/lib/data'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'section' })
  return { title: t('title'), description: t('description') }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'section' })
  const data = getData()
  return (
    <main>
      <h1>{t('heading')}</h1>
      <ClientIsland items={data} />
    </main>
  )
}
```

## Styling

- Dark mode: always include `dark:` variants
- Colors: `primary-{50-950}`, `secondary-{50-950}`, `accent-{50-950}`
- Icons: `lucide-react`, group in `*Icons.tsx` files

### Responsive (mobile + desktop)

- Mobile-first: base styles target small screens, layer up with `sm:`, `md:`, `lg:`, `xl:`
- Use responsive layout utilities: `flex-col sm:flex-row`, `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Touch targets: interactive elements need `min-h-[44px] min-w-[44px]` (WCAG 2.5.5)
- Responsive spacing: smaller padding/margins on mobile, scale up (`px-4 sm:px-6 lg:px-8`)
- Responsive images: always set the `sizes` prop on `next/image` for proper srcset selection
- No fixed widths (`w-[600px]`) — use `max-w-*`, `w-full`, or fluid sizing
- Typography: `text-sm sm:text-base lg:text-lg` (scale up from mobile)
- **Use Tailwind classes for all styling**; inline styles are a limited exception only for:
  - Runtime-computed dynamic values (e.g., `style={{ width: `${percentage}%` }}`)
  - SVG-specific attributes not supported by Tailwind (`strokeDasharray`, `strokeDashoffset`, `filter`)
- All other styling must use Tailwind utility classes

## i18n

- Keys: `section.item.property` (e.g., `hero.title`)
- Always update both `en.json` AND `sv.json`
- **Client components**: `const t = useTranslations('section')` → `{t('key')}`
- **Server components**: `const t = await getTranslations({ locale, namespace: 'section' })` → `{t('key')}`
- **Exceptions**: Decorative icon aria-labels when parent has accessible text

## Accessibility

- Semantic HTML, proper heading hierarchy (h1→h2→h3)
- ARIA labels for interactive elements
- Keyboard navigation, focus indicators
- WCAG AA contrast

## Scripts

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

## Anti-patterns

- `any` without justification
- Hardcoded UI strings (use translations)
- Hardcoded secrets or credentials
- Relative imports `../lib/` (use `@/lib/`)
- Missing tests for new components
- Skipping accessibility
- Mixing client/server patterns incorrectly

## Instruction Conflicts

When a task requires deviating from these instructions, **do not silently ignore the rules**. Instead:

1. **Pause and explain** the conflict clearly
2. **Propose an instruction update** with:
   - **What to change**: The specific instruction that needs updating
   - **Why**: The technical or practical reason for the change
   - **Pros**: Benefits of updating the instruction
   - **Cons**: Potential drawbacks or risks
   - **Recommendation**: Whether this should be a permanent change or a one-time exception

### Example format:

> ⚠️ **Instruction Conflict Detected**
>
> The current task requires [action] which conflicts with [instruction].
>
> **Proposed Update:** [new instruction text]
>
> | Pros      | Cons       |
> | --------- | ---------- |
> | Benefit 1 | Drawback 1 |
> | Benefit 2 | Drawback 2 |
>
> **Recommendation:** [Permanent update / One-time exception with justification]

This ensures instructions evolve with the project while maintaining transparency about deviations.
