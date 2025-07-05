import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import React from 'react'
import BrandShowcase from '../BrandShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
}))

describe('BrandShowcase', () => {
  it('renders the main heading', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Viscalyx Brand Showcase')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<BrandShowcase />)
    expect(
      screen.getByText(/Visual style guide and component library/)
    ).toBeInTheDocument()
  })

  it('renders all tab options', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Animations')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
  })

  it('displays color section by default', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
    expect(
      screen.getByText('Secondary Colors (Gray Scale)')
    ).toBeInTheDocument()
    expect(screen.getByText('Accent Colors')).toBeInTheDocument()
  })

  it('displays primary color swatches', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('primary-600')).toBeInTheDocument()
    expect(screen.getByText('#2563eb')).toBeInTheDocument()
  })

  it('displays secondary color swatches', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('secondary-900')).toBeInTheDocument()
    expect(screen.getByText('#0f172a')).toBeInTheDocument()
  })

  it('displays accent colors with usage information', () => {
    render(<BrandShowcase />)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(
      screen.getByText('Success states, confirmations')
    ).toBeInTheDocument()
  })

  // User interaction tests
  describe('tab navigation', () => {
    it('switches to typography tab when typography button is clicked', () => {
      render(<BrandShowcase />)
      
      // Initially should show colors content
      expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
      
      // Click typography tab
      const typographyTab = screen.getByText('Typography')
      fireEvent.click(typographyTab)
      
      // Should show typography content
      expect(screen.getByText('Font Sizes & Hierarchy')).toBeInTheDocument()
      expect(screen.getAllByText('The quick brown fox jumps over the lazy dog')[0]).toBeInTheDocument()
      
      // Should not show colors content anymore
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()
    })

    it('switches to components tab when components button is clicked', () => {
      render(<BrandShowcase />)

      // Click components tab
      const componentsTab = screen.getByText('Components')
      fireEvent.click(componentsTab)

      // Should show components content
      expect(screen.getByText('Buttons')).toBeInTheDocument()
      expect(screen.getByText('Primary and secondary button styles with hover states')).toBeInTheDocument()
      expect(screen.getByText('Primary Button')).toBeInTheDocument()
      expect(screen.getByText('Secondary Button')).toBeInTheDocument()

      // Should not show colors content
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()
    })

    it('switches to animations tab when animations button is clicked', () => {
      render(<BrandShowcase />)
      
      // Click animations tab
      const animationsTab = screen.getByText('Animations')
      fireEvent.click(animationsTab)
      
      // Should show animations content
      expect(screen.getByText('Fade In Animation')).toBeInTheDocument()
      expect(screen.getByText('Smooth opacity transition for content reveals')).toBeInTheDocument()
      expect(screen.getByText('This element fades in smoothly')).toBeInTheDocument()
      
      // Should not show colors content
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()
    })

    it('switches to accessibility tab when accessibility button is clicked', () => {
      render(<BrandShowcase />)
      
      // Click accessibility tab
      const accessibilityTab = screen.getByText('Accessibility')
      fireEvent.click(accessibilityTab)
      
      // Should show accessibility content
      expect(screen.getByText('Focus States')).toBeInTheDocument()
      expect(screen.getByText('Clear focus indicators for keyboard navigation')).toBeInTheDocument()
      expect(screen.getByText('Color Contrast')).toBeInTheDocument()
      
      // Should not show colors content
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()
    })

    it('can navigate between different tabs multiple times', () => {
      render(<BrandShowcase />)

      // Start with colors (default)
      expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()

      // Go to typography
      fireEvent.click(screen.getByText('Typography'))
      expect(screen.getByText('Font Sizes & Hierarchy')).toBeInTheDocument()
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()

      // Go to components
      fireEvent.click(screen.getByText('Components'))
      expect(screen.getByText('Buttons')).toBeInTheDocument()
      expect(screen.queryByText('Font Sizes & Hierarchy')).not.toBeInTheDocument()

      // Go back to colors
      fireEvent.click(screen.getByText('Colors'))
      expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
      expect(screen.queryByText('Buttons')).not.toBeInTheDocument()
    })

    it('maintains correct tab visual state after clicking', () => {
      render(<BrandShowcase />)
      
      // Check that initial state shows colors content
      expect(screen.getByText('Primary Colors (Blue Scale)')).toBeInTheDocument()
      
      // Click typography tab
      const typographyTab = screen.getByText('Typography')
      fireEvent.click(typographyTab)
      
      // Typography content should now be shown
      expect(screen.getByText('Font Sizes & Hierarchy')).toBeInTheDocument()
      expect(screen.queryByText('Primary Colors (Blue Scale)')).not.toBeInTheDocument()
    })
  })
})
