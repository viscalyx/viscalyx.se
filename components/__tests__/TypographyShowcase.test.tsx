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

  // Enhanced accessibility tests
  it('has proper heading hierarchy', () => {
    render(<TypographyShowcase />)
    const headings = screen.getAllByRole('heading')

    // Should have 2 h2 headings (Font Sizes & Hierarchy, Font Weights)
    expect(headings).toHaveLength(2)

    // Check heading levels
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings).toHaveLength(2)

    // Verify heading text content
    expect(
      screen.getByRole('heading', { name: 'Font Sizes & Hierarchy' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Font Weights' })
    ).toBeInTheDocument()
  })

  it('has accessible structure with proper semantic elements', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for proper semantic structure
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('space-y-12')

    // Verify sections are properly structured
    const sections = container.querySelectorAll('div > div')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('applies correct font weight classes', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for all font weight classes
    const fontWeightClasses = [
      'font-light',
      'font-normal',
      'font-medium',
      'font-semibold',
      'font-bold',
      'font-extrabold',
    ]

    fontWeightClasses.forEach(weightClass => {
      const element = container.querySelector(`.${weightClass}`)
      expect(element).toBeInTheDocument()
    })
  })

  it('applies correct font size classes', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for all font size classes
    const fontSizeClasses = [
      'text-xs',
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl',
      'text-3xl',
      'text-4xl',
      'text-5xl',
    ]

    fontSizeClasses.forEach(sizeClass => {
      const element = container.querySelector(`.${sizeClass}`)
      expect(element).toBeInTheDocument()
    })
  })

  it('displays correct font size information', () => {
    render(<TypographyShowcase />)

    // Test specific font size entries
    expect(screen.getByText('text-xs')).toBeInTheDocument()
    expect(screen.getByText('12px')).toBeInTheDocument()
    expect(screen.getByText('Small labels')).toBeInTheDocument()

    expect(screen.getByText('text-5xl')).toBeInTheDocument()
    expect(screen.getByText('48px')).toBeInTheDocument()
    expect(screen.getByText('Hero headings')).toBeInTheDocument()
  })

  it('displays correct font weight information', () => {
    render(<TypographyShowcase />)

    // Test specific font weight entries
    expect(screen.getByText('Light (300)')).toBeInTheDocument()
    expect(screen.getByText('Subtle text')).toBeInTheDocument()

    expect(screen.getByText('Extrabold (800)')).toBeInTheDocument()
    expect(screen.getByText('Hero text')).toBeInTheDocument()
  })

  it('handles dark mode classes correctly', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for dark mode classes on headings
    const headings = container.querySelectorAll('h2')
    headings.forEach(heading => {
      expect(heading).toHaveClass(
        'text-secondary-900',
        'dark:text-secondary-100'
      )
    })

    // Check for dark mode classes on sample text
    const sampleTexts = container.querySelectorAll(
      '[class*="text-secondary-900"][class*="dark:text-secondary-100"]'
    )
    expect(sampleTexts.length).toBeGreaterThan(0)

    // Check for dark mode classes on labels
    const labels = container.querySelectorAll(
      '[class*="text-secondary-600"][class*="dark:text-secondary-400"]'
    )
    expect(labels.length).toBeGreaterThan(0)
  })

  it('maintains responsive design structure', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for responsive layout classes
    const flexContainers = container.querySelectorAll(
      '.flex.items-center.space-x-6'
    )
    expect(flexContainers.length).toBeGreaterThan(0)

    // Verify flex layout structure is maintained
    flexContainers.forEach(flexContainer => {
      expect(flexContainer).toHaveClass('flex', 'items-center', 'space-x-6')
    })
  })

  it('provides proper text contrast for accessibility', () => {
    const { container } = render(<TypographyShowcase />)

    // Check main text colors provide proper contrast
    const mainTextElements = container.querySelectorAll('.text-secondary-900')
    expect(mainTextElements.length).toBeGreaterThan(0)

    // Check secondary text colors
    const secondaryTextElements = container.querySelectorAll(
      '.text-secondary-600'
    )
    expect(secondaryTextElements.length).toBeGreaterThan(0)

    // Check muted text colors
    const mutedTextElements = container.querySelectorAll('.text-secondary-500')
    expect(mutedTextElements.length).toBeGreaterThan(0)
  })

  it('maintains consistent spacing and layout', () => {
    const { container } = render(<TypographyShowcase />)

    // Check main container spacing
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toHaveClass('space-y-12')

    // Check section spacing
    const fontSizeSection = container.querySelector('.space-y-6')
    expect(fontSizeSection).toBeInTheDocument()

    const fontWeightSection = container.querySelector('.space-y-4')
    expect(fontWeightSection).toBeInTheDocument()
  })

  it('displays all required typography examples', () => {
    render(<TypographyShowcase />)

    // Verify all font sizes are displayed
    const expectedFontSizes = [
      'text-xs',
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl',
      'text-3xl',
      'text-4xl',
      'text-5xl',
    ]
    expectedFontSizes.forEach(fontSize => {
      expect(screen.getByText(fontSize)).toBeInTheDocument()
    })

    // Verify all font weights are displayed
    const expectedFontWeights = [
      'Light (300)',
      'Regular (400)',
      'Medium (500)',
      'Semibold (600)',
      'Bold (700)',
      'Extrabold (800)',
    ]
    expectedFontWeights.forEach(fontWeight => {
      expect(screen.getByText(fontWeight)).toBeInTheDocument()
    })
  })
})
