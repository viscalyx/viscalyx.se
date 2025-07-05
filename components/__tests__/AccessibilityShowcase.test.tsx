import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import AccessibilityShowcase from '../brandprofile/AccessibilityShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (key: string) => {
    const translations: Record<string, any> = {
      'brandProfile.accessibility': {
        'focusStates.title': 'Focus States',
        'focusStates.description':
          'Clear focus indicators for keyboard navigation',
        'focusStates.buttonText': 'Focusable Button',
        'focusStates.inputPlaceholder': 'Focus me with Tab',
        'focusStates.linkText': 'Focusable Link',
        'colorContrast.title': 'Color Contrast',
        'colorContrast.description': 'WCAG AA compliant color combinations',
        'colorContrast.goodContrast': 'Good Contrast',
        'colorContrast.screenReaderSupport': 'Screen Reader Support',
        'colorContrast.contrastText':
          'This text has sufficient contrast ratio (4.5:1+)',
        'colorContrast.whiteOnPrimary': 'White text on primary background',
        'colorContrast.ariaText':
          'All interactive elements include proper ARIA labels',
        'colorContrast.downloadLabel': 'Download brand guidelines document',
        'colorContrast.downloadText': 'Download',
        'semanticHtml.title': 'Semantic HTML',
        'semanticHtml.description':
          'Proper heading hierarchy and semantic elements',
        'semanticHtml.heading1': 'Heading 1 (Main Title)',
        'semanticHtml.heading2': 'Heading 2 (Section Title)',
        'semanticHtml.heading3': 'Heading 3 (Subsection)',
        'semanticHtml.paragraphText':
          'Regular paragraph text with proper hierarchy and semantic structure.',
      },
    }
    return (translationKey: string) => {
      const keys = translationKey.split('.')
      let value: any = translations[key]
      for (const k of keys) {
        value = value?.[k]
      }
      return value || translationKey
    }
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Download: ({ className }: React.SVGProps<SVGSVGElement>) => (
    <span className={className} data-testid="download" />
  ),
}))

describe('AccessibilityShowcase', () => {
  it('renders component with proper structure', () => {
    render(<AccessibilityShowcase />)

    // Check for the presence of translation keys (since our mock returns the keys)
    expect(screen.getByText('focusStates.title')).toBeInTheDocument()
    expect(screen.getByText('colorContrast.title')).toBeInTheDocument()
    expect(screen.getByText('semanticHtml.title')).toBeInTheDocument()
  })

  it('renders interactive elements', () => {
    render(<AccessibilityShowcase />)

    // Check for buttons, inputs, and links
    expect(
      screen.getByRole('button', { name: 'focusStates.buttonText' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'colorContrast.downloadLabel' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'focusStates.linkText' })
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders content with proper translation keys', () => {
    render(<AccessibilityShowcase />)

    // Check for various translation keys being used
    expect(screen.getByText('focusStates.buttonText')).toBeInTheDocument()
    expect(screen.getByText('colorContrast.downloadText')).toBeInTheDocument()
    expect(screen.getByText('semanticHtml.heading1')).toBeInTheDocument()
    expect(screen.getByText('semanticHtml.heading2')).toBeInTheDocument()
    expect(screen.getByText('semanticHtml.heading3')).toBeInTheDocument()
  })

  it('renders proper semantic HTML structure', () => {
    render(<AccessibilityShowcase />)

    // Check for heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(5)
  })

  it('renders download icon', () => {
    render(<AccessibilityShowcase />)
    expect(screen.getByTestId('download')).toBeInTheDocument()
  })
})
