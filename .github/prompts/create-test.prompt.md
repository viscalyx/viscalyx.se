---
agent: agent
description: 'Scaffold a Vitest unit test for a component, with common mocks and examples'
---

# Create Test

Create `/components/__tests__/ComponentName.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ComponentName from '../ComponentName'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('framer-motion', () => ({
  motion: { div: 'div', section: 'section', button: 'button' },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => children,
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
}))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

describe('ComponentName', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
})
```
