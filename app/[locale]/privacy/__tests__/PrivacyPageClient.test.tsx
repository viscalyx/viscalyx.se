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

import { render, screen } from '@testing-library/react'

import PrivacyPageClient from '@/app/[locale]/privacy/PrivacyPageClient'

const defaultProps = {
  lastUpdatedDate: new Date('2025-01-01'),
}

describe('PrivacyPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page heading', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders ScrollToTop', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
  })

  it('renders section headings', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.length).toBeGreaterThanOrEqual(7)
  })

  it('renders list items from translation arrays', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('renders main element with min-h-screen', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen')
  })

  it('renders contact email link', () => {
    render(<PrivacyPageClient {...defaultProps} />)

    const emailLink = screen.getByRole('link')
    expect(emailLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    )
  })
})
