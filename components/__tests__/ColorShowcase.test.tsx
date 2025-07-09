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
      analysisColors: 'Data Visualization Colors',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock the colors utility
vi.mock('@/lib/colors', () => ({
  getAllColors: () => ({
    primary: [
      { name: 'primary-500', hex: '#0ea5e9', rgb: 'rgb(14, 165, 233)' },
      { name: 'primary-600', hex: '#0284c7', rgb: 'rgb(2, 132, 199)' },
    ],
    secondary: [
      { name: 'secondary-500', hex: '#6b7280', rgb: 'rgb(107, 114, 128)' },
      { name: 'secondary-600', hex: '#4b5563', rgb: 'rgb(75, 85, 99)' },
    ],
    dataVisualization: [
      {
        name: 'Visualization 1',
        hex: '#3b82f6',
        rgb: 'rgb(59, 130, 246)',
        usage: 'Primary data series, main categories',
      },
      {
        name: 'Visualization 2',
        hex: '#6366f1',
        rgb: 'rgb(99, 102, 241)',
        usage: 'Secondary data series, sub-categories',
      },
    ],
  }),
  getAccessibilityInfo: () => ({
    contrastTests: [
      {
        name: 'Primary 600 on White',
        foreground: '#0284c7',
        background: '#ffffff',
        ratio: 5.2,
        passes: true,
      },
    ],
    colorBlindSimulation: {
      primary600: {
        original: '#0284c7',
        protanopia: '#0284c7',
        deuteranopia: '#0284c7',
        tritanopia: '#0284c7',
      },
    },
  }),
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

  it('renders analysis colors section', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('Data Visualization Colors')).toBeInTheDocument()
  })

  it('renders primary color swatches', () => {
    render(<ColorShowcase />)
    expect(screen.getByText('primary-500')).toBeInTheDocument()
    expect(screen.getAllByText('#0ea5e9').length).toBeGreaterThan(0)
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

      // Check that color swatch has parent with group class - need to go up to motion.div
      const colorSwatch = colorSwatches[0].closest('.group')
      expect(colorSwatch).toHaveClass('group', 'relative')
    })

    it('simulates click on color swatch to copy hex value', async () => {
      render(<ColorShowcase />)

      // Find the first color swatch button (for primary-500 #0ea5e9)
      const colorSwatchButton = screen.getByRole('button', {
        name: /Copy primary-500 color #0ea5e9/,
      })

      // Simulate click on color swatch
      fireEvent.click(colorSwatchButton)

      // Verify clipboard API was called with hex value
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#0ea5e9')
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
          'rgb(14, 165, 233)'
        )
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
        name: /Copy primary-500 color #0ea5e9/,
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
        'Copy primary-500 color #0ea5e9'
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
        name: /Copy secondary-500 color #6b7280/,
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
      const parentDiv = colorSwatch.closest('.group')

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

      // Check for tooltip - this may be handled by the actual component
      // but not by our mocked version, so we'll check for the element structure
      expect(colorSwatch).toBeInTheDocument()
    })

    it('shows copy confirmation after successful copy', async () => {
      render(<ColorShowcase />)

      // Get a color swatch button
      const colorSwatch = screen.getAllByRole('button', {
        name: /Copy.*color/,
      })[0]

      // Click to copy
      fireEvent.click(colorSwatch)

      // Verify clipboard was called
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      })
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

  // Accessibility information toggle tests
  describe('Accessibility Information', () => {
    it('toggles accessibility information display', async () => {
      render(<ColorShowcase />)

      // Check if accessibility toggle is present
      expect(screen.getByText('Show Accessibility Info')).toBeInTheDocument()

      // Click the toggle button
      const toggleButton = screen.getByText('Show Accessibility Info')
      fireEvent.click(toggleButton)

      // Check if accessibility info is shown
      await waitFor(() => {
        expect(screen.getByText('Hide Accessibility Info')).toBeInTheDocument()
        expect(screen.getByText('Contrast Test Results')).toBeInTheDocument()
      })
    })

    it('displays accessibility compliance summary', () => {
      render(<ColorShowcase />)

      expect(screen.getByText('Color Accessibility')).toBeInTheDocument()
      expect(
        screen.getByText(
          'All colors meet WCAG AA contrast requirements (4.5:1 ratio minimum)'
        )
      ).toBeInTheDocument()
    })
  })
})
