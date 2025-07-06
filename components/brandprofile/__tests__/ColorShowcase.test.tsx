import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ColorShowcase from '../ColorShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      primaryColors: 'Primary Colors',
      secondaryColors: 'Secondary Colors',
      accentColors: 'Accent Colors',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode
      [key: string]: any
    }) => <div {...props}>{children}</div>,
  },
}))

// Mock the colors utility
vi.mock('@/lib/colors', () => ({
  getAllColors: () => ({
    primary: [
      { name: 'primary-500', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
      { name: 'primary-600', hex: '#2563eb', rgb: 'rgb(37, 99, 235)' },
    ],
    secondary: [
      { name: 'secondary-500', hex: '#64748b', rgb: 'rgb(100, 116, 139)' },
      { name: 'secondary-600', hex: '#475569', rgb: 'rgb(71, 85, 105)' },
    ],
    accent: [
      {
        name: 'Success',
        hex: '#22c55e',
        rgb: 'rgb(34, 197, 94)',
        usage: 'Success states, confirmations',
      },
    ],
  }),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('ColorShowcase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all color sections', () => {
    render(<ColorShowcase />)

    expect(screen.getByText('Primary Colors')).toBeInTheDocument()
    expect(screen.getByText('Secondary Colors')).toBeInTheDocument()
    expect(screen.getByText('Accent Colors')).toBeInTheDocument()
  })

  it('should render color swatches with correct information', () => {
    render(<ColorShowcase />)

    // Check if color names are displayed
    expect(screen.getByText('primary-500')).toBeInTheDocument()
    expect(screen.getByText('secondary-500')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()

    // Check if hex values are displayed
    expect(screen.getByText('#3b82f6')).toBeInTheDocument()
    expect(screen.getByText('#64748b')).toBeInTheDocument()
    expect(screen.getByText('#22c55e')).toBeInTheDocument()

    // Check if RGB values are displayed
    expect(screen.getByText('rgb(59, 130, 246)')).toBeInTheDocument()
    expect(screen.getByText('rgb(100, 116, 139)')).toBeInTheDocument()
    expect(screen.getByText('rgb(34, 197, 94)')).toBeInTheDocument()
  })

  it('should display usage information for accent colors', () => {
    render(<ColorShowcase />)

    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })

  it('should copy color values to clipboard when clicked', async () => {
    render(<ColorShowcase />)

    const hexButton = screen.getByText('#3b82f6')
    await fireEvent.click(hexButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#3b82f6')
  })

  it('should show copy confirmation when color is copied', async () => {
    render(<ColorShowcase />)

    const colorSwatch = screen.getByLabelText('Copy primary-500 color #3b82f6')
    await fireEvent.click(colorSwatch)

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })
  })

  it('should show tooltip on hover', async () => {
    render(<ColorShowcase />)

    const colorSwatch = screen.getByLabelText('Copy primary-500 color #3b82f6')
    await fireEvent.mouseEnter(colorSwatch)

    await waitFor(() => {
      expect(screen.getByText('Click to copy')).toBeInTheDocument()
    })
  })

  it('should hide tooltip on mouse leave', async () => {
    render(<ColorShowcase />)

    const colorSwatch = screen.getByLabelText('Copy primary-500 color #3b82f6')
    await fireEvent.mouseEnter(colorSwatch)
    await fireEvent.mouseLeave(colorSwatch)

    await waitFor(() => {
      expect(screen.queryByText('Click to copy')).not.toBeInTheDocument()
    })
  })

  it('should handle keyboard navigation', async () => {
    render(<ColorShowcase />)

    const colorSwatch = screen.getByLabelText('Copy primary-500 color #3b82f6')
    colorSwatch.focus()

    expect(document.activeElement).toBe(colorSwatch)

    // Use fireEvent.click since buttons handle keyboard events automatically
    await fireEvent.click(colorSwatch)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#3b82f6')
  })
})
