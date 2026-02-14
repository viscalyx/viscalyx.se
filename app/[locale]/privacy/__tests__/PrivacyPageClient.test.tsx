import React from 'react'
import { vi } from 'vitest'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key
    t.raw = (key: string) => {
      // Return mock arrays for items keys
      if (key.endsWith('.items')) {
        return ['Item 1', 'Item 2']
      }
      return key
    }
    return t
  },
  useFormatter: () => ({
    dateTime: () => 'Jan 1, 2025',
  }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => {
  const motion: Record<string, React.FC<Record<string, unknown>>> = {}
  ;['div', 'section', 'button', 'span', 'h1', 'h2', 'p', 'main'].forEach(
    tag => {
      motion[tag] = ({
        children,
        initial: _initial,
        animate: _animate,
        transition: _transition,
        whileHover: _whileHover,
        ...props
      }: Record<string, unknown>) =>
        React.createElement(tag, props, children as React.ReactNode)
    }
  )
  return {
    motion,
    useInView: () => true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

// Mock child components
vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'scroll-to-top' }),
}))

vi.mock('@/lib/file-dates', () => ({
  getStaticPageDates: () => ({
    cookies: new Date('2025-01-01'),
    privacy: new Date('2025-01-01'),
    terms: new Date('2025-01-01'),
  }),
}))

import { render, screen } from '@testing-library/react'

import PrivacyPageClient from '@/app/[locale]/privacy/PrivacyPageClient'

describe('PrivacyPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page heading', () => {
    render(<PrivacyPageClient />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    render(<PrivacyPageClient />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders ScrollToTop', () => {
    render(<PrivacyPageClient />)

    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
  })

  it('renders section headings', () => {
    render(<PrivacyPageClient />)

    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.length).toBeGreaterThanOrEqual(7)
  })

  it('renders list items from translation arrays', () => {
    render(<PrivacyPageClient />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('renders main element with min-h-screen', () => {
    render(<PrivacyPageClient />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen')
  })

  it('renders contact email link', () => {
    render(<PrivacyPageClient />)

    const emailLink = screen.getByRole('link')
    expect(emailLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:')
    )
  })
})
