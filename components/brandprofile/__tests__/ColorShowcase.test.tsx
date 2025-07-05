import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import ColorShowcase from '../ColorShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      primaryColors: 'Primary Colors (Blue Scale)',
      secondaryColors: 'Secondary Colors (Gray Scale)',
      accentColors: 'Accent Colors',
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

describe('ColorShowcase', () => {
  it('renders the color showcase component', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
  })

  it('displays primary color swatches', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('primary-500')).toBeInTheDocument()
    expect(screen.getAllByText('#3b82f6')).toHaveLength(2) // Allow multiple instances
  })

  it('displays secondary color swatches', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('secondary-900')).toBeInTheDocument()
    expect(screen.getByText('#0f172a')).toBeInTheDocument()
  })

  it('displays accent colors with usage information', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })
})
