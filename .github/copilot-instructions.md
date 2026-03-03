# Copilot Instructions — Viscalyx.se

> Scoped instruction files (`components.instructions.md`, `tests.instructions.md`, etc.) auto-load for matching file patterns. This file covers cross-cutting rules only — do not duplicate scoped guidance here.

## Stack

Next.js 16 (App Router) | React 19 | TypeScript strict | Tailwind CSS 4 | next-intl (en/sv) | Framer Motion | Vitest | Cloudflare Workers

## Commands

| Command | Purpose |
|---|---|
| `npm run check` | **All checks** (lint, test, type, format, spell) |
| `npm run test` | Run tests |
| `npm run dev` | Dev server |

## File Map

```
components/Name.tsx       → tests: components/__tests__/Name.test.tsx
components/*Icons.tsx     → icon collections (lucide-react)
lib/kebab-name.ts         → tests: lib/__tests__/kebab-name.test.ts
app/[locale]/page.tsx     → App Router pages
content/blog/slug.md      → blog posts (kebab-case)
messages/{en,sv}.json     → translations
```

## Imports

`@/*` aliases only; ordering deferred to Biome

## Component Architecture

Prefer **server page + client island**:
- Server page in `app/` fetches data → passes props to `'use client'` island in `components/`
- Server: `getTranslations`/`getFormatter` (async, `next-intl/server`)
- Client: `useTranslations`/`useFormatter` (hooks, `next-intl`)

## Styling

- Tailwind only; inline styles only for runtime-computed values or unsupported SVG attrs
- Always include `dark:` variants
- Colors: `primary-{50-950}`, `secondary-{50-950}`, `accent-{50-950}`
- Icons: `lucide-react`, grouped in `*Icons.tsx`

## i18n

- Keys: `section.item.property`
- Always update both `en.json` AND `sv.json`

## Anti-patterns

- Hardcoded UI strings (use translations) or secrets
- Relative imports (use `@/lib/`, `@/components/`, etc.)
- Mixing client/server patterns (see Component Architecture)
