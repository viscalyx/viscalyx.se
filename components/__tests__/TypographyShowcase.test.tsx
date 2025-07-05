import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import TypographyShowcase from '../brandprofile/TypographyShowcase'

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

describe('TypographyShowcase', () => {
  it('renders font sizes section', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('Font Sizes & Hierarchy')).toBeInTheDocument()
  })

  it('renders font weights section', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('Font Weights')).toBeInTheDocument()
  })

  it('renders font size examples', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('text-base')).toBeInTheDocument()
    expect(screen.getByText('16px')).toBeInTheDocument()
    expect(screen.getAllByText('Body text')).toHaveLength(2) // Allow multiple instances
  })

  it('renders font weight examples', () => {
    render(<TypographyShowcase />)
    expect(screen.getByText('Bold (700)')).toBeInTheDocument()
    expect(screen.getByText('Headings')).toBeInTheDocument()
  })

  it('renders the sample text', () => {
    render(<TypographyShowcase />)
    expect(
      screen.getAllByText('The quick brown fox jumps over the lazy dog')
    ).toHaveLength(9)
  })
})
