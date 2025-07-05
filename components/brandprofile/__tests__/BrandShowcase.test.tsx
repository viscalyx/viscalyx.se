import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import BrandShowcase from '../BrandShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Viscalyx Brand Showcase',
      description:
        'Visual style guide and component library for consistent brand experience',
      'tabs.colors': 'Colors',
      'tabs.typography': 'Typography',
      'tabs.components': 'Components',
      'tabs.icons': 'Icons',
      'tabs.animations': 'Animations',
      'tabs.accessibility': 'Accessibility',
    }
    return translations[key] || key
  },
}))

// Mock Header component
vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

// Mock Footer component
vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

// Mock ScrollToTop component
vi.mock('@/components/ScrollToTop', () => ({
  default: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <main {...props}>{children}</main>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Eye: ({ size }: any) => <span data-testid="eye-icon" />,
  MousePointer: ({ size }: any) => <span data-testid="mouse-pointer-icon" />,
  Palette: ({ size }: any) => <span data-testid="palette-icon" />,
  Square: ({ size }: any) => <span data-testid="square-icon" />,
  Type: ({ size }: any) => <span data-testid="type-icon" />,
  Sparkles: ({ size }: any) => <span data-testid="sparkles-icon" />,
}))

// Mock the showcase components
vi.mock('../ColorShowcase', () => ({
  default: () => <div data-testid="color-showcase">Color Showcase Content</div>,
}))

vi.mock('../TypographyShowcase', () => ({
  default: () => (
    <div data-testid="typography-showcase">Typography Showcase Content</div>
  ),
}))

vi.mock('../ComponentsShowcase', () => ({
  default: () => (
    <div data-testid="components-showcase">Components Showcase Content</div>
  ),
}))

vi.mock('../IconsShowcase', () => ({
  default: () => <div data-testid="icons-showcase">Icons Showcase Content</div>,
}))

vi.mock('../AnimationsShowcase', () => ({
  default: () => (
    <div data-testid="animations-showcase">Animations Showcase Content</div>
  ),
}))

vi.mock('../AccessibilityShowcase', () => ({
  default: () => (
    <div data-testid="accessibility-showcase">
      Accessibility Showcase Content
    </div>
  ),
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
    expect(screen.getByText('Icons')).toBeInTheDocument()
    expect(screen.getByText('Animations')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
  })

  it('displays color showcase by default', () => {
    render(<BrandShowcase />)
    expect(screen.getByTestId('color-showcase')).toBeInTheDocument()
  })

  // User interaction tests
  describe('tab navigation', () => {
    it('switches to typography tab when typography button is clicked', () => {
      render(<BrandShowcase />)

      // Initially should show colors content
      expect(screen.getByTestId('color-showcase')).toBeInTheDocument()

      // Click typography tab
      const typographyTab = screen.getByText('Typography')
      fireEvent.click(typographyTab)

      // Should show typography content
      expect(screen.getByTestId('typography-showcase')).toBeInTheDocument()

      // Should not show colors content anymore
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })

    it('switches to components tab when components button is clicked', () => {
      render(<BrandShowcase />)

      // Click components tab
      const componentsTab = screen.getByText('Components')
      fireEvent.click(componentsTab)

      // Should show components content
      expect(screen.getByTestId('components-showcase')).toBeInTheDocument()

      // Should not show colors content
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })

    it('switches to icons tab when icons button is clicked', () => {
      render(<BrandShowcase />)

      // Click icons tab
      const iconsTab = screen.getByText('Icons')
      fireEvent.click(iconsTab)

      // Should show icons content
      expect(screen.getByTestId('icons-showcase')).toBeInTheDocument()

      // Should not show colors content
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })

    it('switches to animations tab when animations button is clicked', () => {
      render(<BrandShowcase />)

      // Click animations tab
      const animationsTab = screen.getByText('Animations')
      fireEvent.click(animationsTab)

      // Should show animations content
      expect(screen.getByTestId('animations-showcase')).toBeInTheDocument()

      // Should not show colors content
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })

    it('switches to accessibility tab when accessibility button is clicked', () => {
      render(<BrandShowcase />)

      // Click accessibility tab
      const accessibilityTab = screen.getByText('Accessibility')
      fireEvent.click(accessibilityTab)

      // Should show accessibility content
      expect(screen.getByTestId('accessibility-showcase')).toBeInTheDocument()

      // Should not show colors content
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })

    it('can navigate between different tabs multiple times', () => {
      render(<BrandShowcase />)

      // Start with colors (default)
      expect(screen.getByTestId('color-showcase')).toBeInTheDocument()

      // Go to typography
      fireEvent.click(screen.getByText('Typography'))
      expect(screen.getByTestId('typography-showcase')).toBeInTheDocument()
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()

      // Go to icons
      fireEvent.click(screen.getByText('Icons'))
      expect(screen.getByTestId('icons-showcase')).toBeInTheDocument()
      expect(
        screen.queryByTestId('typography-showcase')
      ).not.toBeInTheDocument()

      // Go to components
      fireEvent.click(screen.getByText('Components'))
      expect(screen.getByTestId('components-showcase')).toBeInTheDocument()
      expect(screen.queryByTestId('icons-showcase')).not.toBeInTheDocument()

      // Go back to colors
      fireEvent.click(screen.getByText('Colors'))
      expect(screen.getByTestId('color-showcase')).toBeInTheDocument()
      expect(
        screen.queryByTestId('components-showcase')
      ).not.toBeInTheDocument()
    })

    it('maintains correct tab visual state after clicking', () => {
      render(<BrandShowcase />)

      // Check that initial state shows colors content
      expect(screen.getByTestId('color-showcase')).toBeInTheDocument()

      // Click typography tab
      const typographyTab = screen.getByText('Typography')
      fireEvent.click(typographyTab)

      // Typography content should now be shown
      expect(screen.getByTestId('typography-showcase')).toBeInTheDocument()
      expect(screen.queryByTestId('color-showcase')).not.toBeInTheDocument()
    })
  })
})
