import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import TypographyShowcase from '../TypographyShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      fontSizes: 'Font Sizes & Hierarchy',
      fontWeights: 'Font Weights',
      sampleText: 'The quick brown fox jumps over the lazy dog',
      brandText: 'Viscalyx - Modern Web Development',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

describe('TypographyShowcase', () => {
  it('renders the typography showcase component', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('Font Sizes & Hierarchy')).toBeInTheDocument()
  })

  it('displays font samples', () => {
    render(<TypographyShowcase />)
    expect(
      screen.getAllByText('The quick brown fox jumps over the lazy dog')[0]
    ).toBeInTheDocument()
  })

  it('displays different heading levels', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('text-4xl')).toBeInTheDocument()
    expect(screen.getByText('text-3xl')).toBeInTheDocument()
    expect(screen.getByText('text-2xl')).toBeInTheDocument()
  })
})
