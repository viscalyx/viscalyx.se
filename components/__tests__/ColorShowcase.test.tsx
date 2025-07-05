import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ColorShowcase from '../brandprofile/ColorShowcase'

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
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ColorShowcase', () => {
  it('renders primary colors section', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
  })

  it('renders secondary colors section', () => {
    render(<ColorShowcase />)
    expect(
      screen.getByText('Secondary Colors (Gray Scale)')
    ).toBeInTheDocument()
  })

  it('renders accent colors section', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('Accent Colors')).toBeInTheDocument()
  })

  it('renders primary color swatches', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('primary-500')).toBeInTheDocument()
    expect(screen.getByText('#3b82f6')).toBeInTheDocument()
  })

  it('renders accent color usage information', () => {
    render(<ColorShowcase />)
    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })
})
