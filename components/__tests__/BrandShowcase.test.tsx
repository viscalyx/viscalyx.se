import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import BrandShowcase from '../brandprofile/BrandShowcase'

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
  // Icons used by showcase components
  AlertCircle: ({ size }: any) => <span data-testid="alert-circle-icon" />,
  AlertTriangle: ({ size }: any) => <span data-testid="alert-triangle-icon" />,
  ArrowLeft: ({ size }: any) => <span data-testid="arrow-left-icon" />,
  ArrowRight: ({ size }: any) => <span data-testid="arrow-right-icon" />,
  ArrowUp: ({ size }: any) => <span data-testid="arrow-up-icon" />,
  Award: ({ size }: any) => <span data-testid="award-icon" />,
  BarChart: ({ size }: any) => <span data-testid="bar-chart-icon" />,
  BarChart3: ({ size }: any) => <span data-testid="bar-chart3-icon" />,
  Camera: ({ size }: any) => <span data-testid="camera-icon" />,
  Check: ({ size }: any) => <span data-testid="check-icon" />,
  CheckCircle: ({ size }: any) => <span data-testid="check-circle-icon" />,
  Circle: ({ size }: any) => <span data-testid="circle-icon" />,
  Clock: ({ size }: any) => <span data-testid="clock-icon" />,
  Cloud: ({ size }: any) => <span data-testid="cloud-icon" />,
  Code: ({ size }: any) => <span data-testid="code-icon" />,
  Database: ({ size }: any) => <span data-testid="database-icon" />,
  Download: ({ size }: any) => <span data-testid="download-icon" />,
  ExternalLink: ({ size }: any) => <span data-testid="external-link-icon" />,
  GitBranch: ({ size }: any) => <span data-testid="git-branch-icon" />,
  Globe: ({ size }: any) => <span data-testid="globe-icon" />,
  Heart: ({ size }: any) => <span data-testid="heart-icon" />,
  Info: ({ size }: any) => <span data-testid="info-icon" />,
  Layers: ({ size }: any) => <span data-testid="layers-icon" />,
  Lightbulb: ({ size }: any) => <span data-testid="lightbulb-icon" />,
  Loader2: ({ size }: any) => <span data-testid="loader2-icon" />,
  Mail: ({ size }: any) => <span data-testid="mail-icon" />,
  MapPin: ({ size }: any) => <span data-testid="map-pin-icon" />,
  Menu: ({ size }: any) => <span data-testid="menu-icon" />,
  MessageSquare: ({ size }: any) => <span data-testid="message-square-icon" />,
  Monitor: ({ size }: any) => <span data-testid="monitor-icon" />,
  Moon: ({ size }: any) => <span data-testid="moon-icon" />,
  Phone: ({ size }: any) => <span data-testid="phone-icon" />,
  Quote: ({ size }: any) => <span data-testid="quote-icon" />,
  Search: ({ size }: any) => <span data-testid="search-icon" />,
  Send: ({ size }: any) => <span data-testid="send-icon" />,
  Settings: ({ size }: any) => <span data-testid="settings-icon" />,
  Shield: ({ size }: any) => <span data-testid="shield-icon" />,
  Smartphone: ({ size }: any) => <span data-testid="smartphone-icon" />,
  Star: ({ size }: any) => <span data-testid="star-icon" />,
  Sun: ({ size }: any) => <span data-testid="sun-icon" />,
  Target: ({ size }: any) => <span data-testid="target-icon" />,
  TrendingUp: ({ size }: any) => <span data-testid="trending-up-icon" />,
  X: ({ size }: any) => <span data-testid="x-icon" />,
}))

// Mock the showcase components
vi.mock('../brandprofile/ColorShowcase', () => ({
  default: () => <div data-testid="color-showcase">Color Showcase Content</div>,
}))

vi.mock('../brandprofile/TypographyShowcase', () => ({
  default: () => (
    <div data-testid="typography-showcase">Typography Showcase Content</div>
  ),
}))

vi.mock('../brandprofile/ComponentsShowcase', () => ({
  default: () => (
    <div data-testid="components-showcase">Components Showcase Content</div>
  ),
}))

vi.mock('../brandprofile/IconsShowcase', () => ({
  default: () => <div data-testid="icons-showcase">Icons Showcase Content</div>,
}))

vi.mock('../brandprofile/AnimationsShowcase', () => ({
  default: () => (
    <div data-testid="animations-showcase">Animations Showcase Content</div>
  ),
}))

vi.mock('../brandprofile/AccessibilityShowcase', () => ({
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
