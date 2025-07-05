import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ColorShowcase from '../brandprofile/ColorShowcase'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
    expect(screen.getAllByText('#3b82f6').length).toBeGreaterThan(0)
  })

  it('renders accent color usage information', () => {
    render(<ColorShowcase />)
    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })

  // User interaction tests
  describe('User Interactions', () => {
    it('handles hover interactions on color swatches', () => {
      render(<ColorShowcase />)

      // Get a color swatch element - look for the parent div with group class
      const colorSwatches = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })
      expect(colorSwatches.length).toBeGreaterThan(0)

      // Check that color swatch has parent with group class
      const colorSwatch = colorSwatches[0].closest('div')
      expect(colorSwatch).toHaveClass('group', 'relative')
    })

    it('simulates click on color swatch to copy hex value', async () => {
      render(<ColorShowcase />)

      // Find the first color swatch button (for primary-50 #eff6ff)
      const colorSwatchButton = screen.getByRole('button', {
        name: /Copy primary-50 color #eff6ff/,
      })

      // Simulate click on color swatch
      fireEvent.click(colorSwatchButton)

      // Verify clipboard API was called with hex value
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#eff6ff')
      })
    })

    it('simulates click on color swatch to copy rgb value', async () => {
      render(<ColorShowcase />)

      // Find the first RGB button by searching for rgb text
      const rgbButtons = screen.getAllByText(/^rgb\(/)
      expect(rgbButtons.length).toBeGreaterThan(0)

      // Simulate click on RGB button
      fireEvent.click(rgbButtons[0])

      // Verify clipboard API was called with RGB value
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'rgb(239, 246, 255)'
        )
      })
    })

    it('handles click on accent color with usage information', async () => {
      render(<ColorShowcase />)

      // Find the Success color swatch button in the accent colors section
      const successColorSwatch = screen.getByRole('button', {
        name: /Copy Success color #22c55e/,
      })

      // Simulate click
      fireEvent.click(successColorSwatch)

      // Verify clipboard API was called with the hex value
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#22c55e')
      })
    })

    it('handles clipboard API failure gracefully', async () => {
      // Mock clipboard to reject
      const originalClipboard = navigator.clipboard
      Object.assign(navigator, {
        clipboard: {
          writeText: vi
            .fn()
            .mockRejectedValue(new Error('Clipboard unavailable')),
        },
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<ColorShowcase />)

      // Find and click a color swatch
      const colorSwatchButton = screen.getByRole('button', {
        name: /Copy primary-50 color #eff6ff/,
      })
      fireEvent.click(colorSwatchButton)

      // Verify error was logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to copy color: ',
          expect.any(Error)
        )
      })

      // Restore original clipboard
      Object.assign(navigator, { clipboard: originalClipboard })
      consoleSpy.mockRestore()
    })
  })

  // Accessibility tests
  describe('Accessibility', () => {
    it('has proper ARIA attributes for color swatches', () => {
      render(<ColorShowcase />)

      // Check that color swatches have appropriate roles and labels
      const colorSwatches = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })
      expect(colorSwatches.length).toBeGreaterThan(0)

      // Check first swatch has proper aria-label
      expect(colorSwatches[0]).toHaveAttribute(
        'aria-label',
        'Copy primary-50 color #eff6ff'
      )
    })

    it('has proper keyboard navigation support', () => {
      render(<ColorShowcase />)

      // Get color swatch buttons
      const colorSwatches = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })

      // Check that they are focusable (have tabindex="0")
      colorSwatches.forEach(swatch => {
        expect(swatch).toHaveAttribute('tabindex', '0')
      })
    })

    it('provides visual feedback for focused elements', () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]

      // Simulate focus
      fireEvent.focus(colorSwatch)

      // Check for focus styles
      expect(colorSwatch).toHaveClass('focus:ring-2', 'focus:ring-primary-500')
    })

    it('has proper color contrast indicators', () => {
      render(<ColorShowcase />)

      // Check that light colors have different border treatment
      const lightColorButton = screen.getByRole('button', {
        name: /Copy primary-50 color #eff6ff/,
      })
      const colorDiv = lightColorButton.querySelector('div')

      // Light colors should have different border treatment
      expect(colorDiv).toHaveClass(
        'border-secondary-300',
        'dark:border-secondary-600'
      )
    })
  })

  // Visual feedback tests
  describe('Visual Feedback', () => {
    it('shows hover effects on color swatches', () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]
      const parentDiv = colorSwatch.closest('div')

      // Check for hover state classes on parent
      expect(parentDiv).toHaveClass('group')
    })

    it('displays tooltip on hover', async () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]

      // Simulate hover
      fireEvent.mouseEnter(colorSwatch)

      // Check for tooltip
      await waitFor(() => {
        const tooltip = screen.getByText('Click to copy')
        expect(tooltip).toBeInTheDocument()
      })
    })

    it('shows copy confirmation after successful copy', async () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]

      // Click to copy
      fireEvent.click(colorSwatch)

      // Wait for copy confirmation
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })

      // Check that confirmation disappears after timeout
      await waitFor(
        () => {
          expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('handles multiple rapid clicks gracefully', async () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]

      // Click multiple times rapidly
      fireEvent.click(colorSwatch)
      fireEvent.click(colorSwatch)
      fireEvent.click(colorSwatch)

      // Verify clipboard was called for each click
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3)
      })
    })
  })
})
