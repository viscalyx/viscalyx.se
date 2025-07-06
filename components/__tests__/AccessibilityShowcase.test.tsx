import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { vi } from 'vitest'
import AccessibilityShowcase from '../brandprofile/AccessibilityShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    // Define typed translations for accessibility showcase
    const translations: Record<string, string> = {
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
    }

    return (key: string): string => translations[key] || key
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

    // Check for the actual rendered text values
    expect(screen.getByText('Focus States')).toBeInTheDocument()
    expect(screen.getByText('Color Contrast')).toBeInTheDocument()
    expect(screen.getByText('Semantic HTML')).toBeInTheDocument()
  })

  it('renders interactive elements', () => {
    render(<AccessibilityShowcase />)

    // Check for buttons, inputs, and links using their actual text content
    expect(
      screen.getByRole('button', { name: 'Focusable Button' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Download brand guidelines document' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Focusable Link' })
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders content with proper translation keys', () => {
    render(<AccessibilityShowcase />)

    // Check for various translated text content
    expect(screen.getByText('Focusable Button')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Heading 1 (Main Title)')).toBeInTheDocument()
    expect(screen.getByText('Heading 2 (Section Title)')).toBeInTheDocument()
    expect(screen.getByText('Heading 3 (Subsection)')).toBeInTheDocument()
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

  describe('User Interactions', () => {
    it('should handle button clicks', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      const focusableButton = screen.getByRole('button', {
        name: 'Focusable Button',
      })
      const downloadButton = screen.getByRole('button', {
        name: 'Download brand guidelines document',
      })

      // Click the focusable button
      await user.click(focusableButton)
      expect(focusableButton).toHaveFocus()

      // Click the download button
      await user.click(downloadButton)
      expect(downloadButton).toHaveFocus()
    })

    it('should handle keyboard navigation through interactive elements', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      // Get all interactive elements in expected tab order
      const focusableButton = screen.getByRole('button', {
        name: 'Focusable Button',
      })
      const textInput = screen.getByRole('textbox')
      const focusableLink = screen.getByRole('link', {
        name: 'Focusable Link',
      })
      const downloadButton = screen.getByRole('button', {
        name: 'Download brand guidelines document',
      })

      // Start from the first interactive element
      await user.click(focusableButton)
      expect(focusableButton).toHaveFocus()

      // Tab to the next element (text input)
      await user.tab()
      expect(textInput).toHaveFocus()

      // Tab to the next element (link)
      await user.tab()
      expect(focusableLink).toHaveFocus()

      // Tab to the next element (download button)
      await user.tab()
      expect(downloadButton).toHaveFocus()
    })

    it('should handle input field interactions', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      const textInput = screen.getByRole('textbox')

      // Focus the input field
      await user.click(textInput)
      expect(textInput).toHaveFocus()

      // Type in the input field
      await user.type(textInput, 'Test input text')
      expect(textInput).toHaveValue('Test input text')

      // Clear the input field
      await user.clear(textInput)
      expect(textInput).toHaveValue('')
    })

    it('should handle link interactions', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      const focusableLink = screen.getByRole('link', {
        name: 'Focusable Link',
      })

      // Focus the link via keyboard
      await user.click(focusableLink)
      expect(focusableLink).toHaveFocus()

      // Verify link attributes
      expect(focusableLink).toHaveAttribute('href', '#')
    })

    it('should handle keyboard navigation in reverse order with shift+tab', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      // Get interactive elements
      const focusableButton = screen.getByRole('button', {
        name: 'Focusable Button',
      })
      const textInput = screen.getByRole('textbox')
      const focusableLink = screen.getByRole('link', {
        name: 'Focusable Link',
      })
      const downloadButton = screen.getByRole('button', {
        name: 'Download brand guidelines document',
      })

      // Start from the last interactive element
      await user.click(downloadButton)
      expect(downloadButton).toHaveFocus()

      // Shift+Tab to previous element (link)
      await user.tab({ shift: true })
      expect(focusableLink).toHaveFocus()

      // Shift+Tab to previous element (text input)
      await user.tab({ shift: true })
      expect(textInput).toHaveFocus()

      // Shift+Tab to previous element (button)
      await user.tab({ shift: true })
      expect(focusableButton).toHaveFocus()
    })

    it('should handle enter key press on buttons', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      const focusableButton = screen.getByRole('button', {
        name: 'Focusable Button',
      })
      const downloadButton = screen.getByRole('button', {
        name: 'Download brand guidelines document',
      })

      // Focus and press enter on focusable button
      await user.click(focusableButton)
      await user.keyboard('{Enter}')
      expect(focusableButton).toHaveFocus()

      // Focus and press enter on download button
      await user.click(downloadButton)
      await user.keyboard('{Enter}')
      expect(downloadButton).toHaveFocus()
    })

    it('should handle space key press on buttons', async () => {
      const user = userEvent.setup()
      render(<AccessibilityShowcase />)

      const focusableButton = screen.getByRole('button', {
        name: 'Focusable Button',
      })
      const downloadButton = screen.getByRole('button', {
        name: 'Download brand guidelines document',
      })

      // Focus and press space on focusable button
      await user.click(focusableButton)
      await user.keyboard(' ')
      expect(focusableButton).toHaveFocus()

      // Focus and press space on download button
      await user.click(downloadButton)
      await user.keyboard(' ')
      expect(downloadButton).toHaveFocus()
    })
  })
})
