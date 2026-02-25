import React from 'react'
import { vi } from 'vitest'

// Mock next-intl
vi.mock('next-intl', () => ({
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

import LegalPageLayout from '@/components/LegalPageLayout'

describe('LegalPageLayout', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    lastUpdatedLabel: 'Last updated',
    lastUpdatedDate: new Date('2025-01-01'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title as h1', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Test Title')
  })

  it('renders subtitle', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('renders last updated date', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    expect(screen.getByText(/Last updated.*Jan 1, 2025/)).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Child content here</p>
      </LegalPageLayout>,
    )

    expect(screen.getByText('Child content here')).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders ScrollToTop', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
  })

  it('renders main element with min-h-screen', () => {
    render(
      <LegalPageLayout {...defaultProps}>
        <p>Content</p>
      </LegalPageLayout>,
    )

    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen')
  })
})
