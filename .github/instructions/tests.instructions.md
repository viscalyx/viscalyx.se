---
applyTo: '**/*.test.tsx,**/*.test.ts,components/__tests__/**'
---

# Tests

## Required Mocks

```tsx
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('framer-motion', () => {
  const React = require('react')
  const motion: Record<string, any> = {}
  ;['div', 'section', 'button', 'span', 'h1', 'h2', 'p'].forEach(tag => {
    motion[tag] = ({
      children,
      initial,
      animate,
      transition,
      whileHover,
      ...props
    }: any) => React.createElement(tag, props, children)
  })
  return {
    motion,
    useInView: () => true,
    AnimatePresence: ({ children }: any) => children,
  }
})
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en',
}))
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
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

## Guidelines

- Use `screen.getByRole()` over `getByTestId()`
- Test user behavior, not implementation
- Clear mocks in `beforeEach`
- Use `@/lib/` path alias in mocks (not `../../lib/`)
