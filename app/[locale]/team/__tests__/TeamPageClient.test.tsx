import React from 'react'
import { vi } from 'vitest'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
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

vi.mock('@/components/Team', () => ({
  __esModule: true,
  default: () => React.createElement('section', { 'data-testid': 'team' }),
}))

import { render, screen } from '@testing-library/react'

import TeamPageClient from '@/app/[locale]/team/TeamPageClient'

describe('TeamPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders header and footer', () => {
    render(<TeamPageClient />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders Team component', () => {
    render(<TeamPageClient />)

    expect(screen.getByTestId('team')).toBeInTheDocument()
  })

  it('renders ScrollToTop', () => {
    render(<TeamPageClient />)

    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
  })

  it('renders main element with min-h-screen', () => {
    render(<TeamPageClient />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen')
  })
})
