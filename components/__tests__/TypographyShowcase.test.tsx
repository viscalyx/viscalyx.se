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

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => <>{children}</>,
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
    // Check that the sample text is present (flexible approach)
    const sampleTextElements = screen.getAllByText(
      'The quick brown fox jumps over the lazy dog'
    )
    expect(sampleTextElements.length).toBeGreaterThan(0)

    // Verify each element is properly rendered
    sampleTextElements.forEach(element => {
      expect(element).toBeInTheDocument()
    })
  })

  // Accessibility tests for font sizes
  it('meets minimum font size accessibility standards', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for presence of accessible font sizes
    const textSmElements = container.querySelectorAll('.text-sm')
    expect(textSmElements.length).toBeGreaterThan(0)

    // Verify text-xs is present (though not ideal, it's sometimes used for labels)
    const textXsElements = container.querySelectorAll('.text-xs')
    expect(textXsElements.length).toBeGreaterThan(0)

    // Ensure base text size is present for body content
    const textBaseElements = container.querySelectorAll('.text-base')
    expect(textBaseElements.length).toBeGreaterThan(0)
  })

  it('provides adequate font size hierarchy for accessibility', () => {
    const { container } = render(<TypographyShowcase />)

    // Check for proper font size progression
    const fontSizeClasses = [
      'text-xs', // 12px - small labels
      'text-sm', // 14px - small text
      'text-base', // 16px - standard body text
      'text-lg', // 18px - large text
      'text-xl', // 20px - extra large
      'text-2xl', // 24px - heading sizes
      'text-3xl', // 30px
      'text-4xl', // 36px
      'text-5xl', // 48px
    ]

    fontSizeClasses.forEach(sizeClass => {
      const elements = container.querySelectorAll(`.${sizeClass}`)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('has proper semantic heading hierarchy for accessibility', () => {
    render(<TypographyShowcase />)

    // Verify h2 headings are present (section titles + example)
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings.length).toBe(5) // Typography Colors, Font Sizes, Font Weights, Typography Examples + Section Heading example

    // Verify h1 heading in examples section
    const h1Headings = screen.getAllByRole('heading', { level: 1 })
    expect(h1Headings.length).toBe(1) // Large Heading example

    // Verify h3 headings in examples section
    const h3Headings = screen.getAllByRole('heading', { level: 3 })
    expect(h3Headings.length).toBe(1) // Subsection Heading example

    // Ensure all headings have proper structure
    const allHeadings = screen.getAllByRole('heading')
    expect(allHeadings.length).toBe(7) // 5 h2 + 1 h1 + 1 h3 = 7 total
  })

  it('maintains proper heading structure for screen readers', () => {
    render(<TypographyShowcase />)

    // Check that main section headings are h2 level
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Typography Colors & Interactive Preview',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Font Sizes & Hierarchy' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Font Weights' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Typography Examples' })
    ).toBeInTheDocument()

    // Verify heading content is descriptive
    const headings = screen.getAllByRole('heading')
    headings.forEach(heading => {
      expect(heading.textContent).toBeTruthy()
      expect(heading.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  // Enhanced accessibility tests
  it('has proper heading hierarchy', () => {
    render(<TypographyShowcase />)
    const headings = screen.getAllByRole('heading')

    // Should have 7 total headings (4 h2 section headings + 3 example headings)
    expect(headings).toHaveLength(7)

    // Check main section heading levels
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings).toHaveLength(5) // 4 section headings + 1 example heading

    // Check example heading levels
    const h1Headings = screen.getAllByRole('heading', { level: 1 })
    expect(h1Headings).toHaveLength(1) // 1 large heading example

    const h3Headings = screen.getAllByRole('heading', { level: 3 })
    expect(h3Headings).toHaveLength(1) // 1 subsection heading example

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

    // Check for custom text color classes on headings
    const headings = container.querySelectorAll('h2')
    headings.forEach(heading => {
      expect(heading).toHaveClass('text-primary-content')
    })

    // Check for custom text color classes on sample text
    const sampleTexts = container.querySelectorAll(
      '[class*="text-primary-content"]'
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

    // Check main text colors provide proper contrast (using our new custom classes)
    const mainTextElements = container.querySelectorAll('.text-primary-content')
    expect(mainTextElements.length).toBeGreaterThan(0)

    // Check secondary text colors (still using Tailwind for labels/captions)
    const secondaryTextElements = container.querySelectorAll(
      '.text-secondary-600'
    )
    expect(secondaryTextElements.length).toBeGreaterThan(0)

    // Check muted text colors (still using Tailwind for subtle text)
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
