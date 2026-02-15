---
applyTo: '**/*.test.tsx,**/*.test.ts,components/__tests__/**'
---

# Tests

## Required Mocks

> **Note:** `framer-motion` and `next/image` are globally mocked in `vitest.setup.ts`.
> Do **not** re-mock them in individual test files. The global framer-motion mock
> uses a `Proxy` that handles any `motion.*` element, `AnimatePresence`,
> `useInView`, and `motion.create()`.

```tsx
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en',
}))
```

## Structure

```tsx
describe('ComponentName', () => {
  beforeEach(() => vi.clearAllMocks())
  it('renders correctly', () => {})
  it('handles interactions', async () => {})
})
```

## Server Component / Page Tests

For async server components (`generateMetadata`, `generateStaticParams`, page default exports):

```tsx
// Mock next-intl/server for server components
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
  getFormatter: vi.fn(async () => ({
    dateTime: (date: Date) => date.toISOString(),
  })),
}))

// Test generateMetadata
const params = Promise.resolve({ locale: 'en', slug: 'test-post' })
const metadata = await generateMetadata({ params })
expect(metadata.title).toBeDefined()

// Test generateStaticParams
const result = generateStaticParams()
expect(result).toEqual([{ slug: 'post-1' }, { slug: 'post-2' }])
```

## Guidelines

- Use `screen.getByRole()` over `getByTestId()`
- Test user behavior, not implementation
- Clear mocks in `beforeEach`
- Use `@/lib/` path alias in mocks (not `../../lib/`)
