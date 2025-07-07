import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import DataVisualizationShowcase from '../brandprofile/AnalysisShowcase'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  BarChart3: ({ className }: any) => (
    <span data-testid="bar-chart3-icon" className={className} />
  ),
  Database: ({ className }: any) => (
    <span data-testid="database-icon" className={className} />
  ),
  PieChart: ({ className }: any) => (
    <span data-testid="pie-chart-icon" className={className} />
  ),
  Shield: ({ className }: any) => (
    <span data-testid="shield-icon" className={className} />
  ),
  Cloud: ({ className }: any) => (
    <span data-testid="cloud-icon" className={className} />
  ),
  Terminal: ({ className }: any) => (
    <span data-testid="terminal-icon" className={className} />
  ),
  Settings: ({ className }: any) => (
    <span data-testid="settings-icon" className={className} />
  ),
  GitBranch: ({ className }: any) => (
    <span data-testid="git-branch-icon" className={className} />
  ),
}))

describe('DataVisualizationShowcase', () => {
  it('renders the main heading', () => {
    render(<DataVisualizationShowcase />)
    expect(
      screen.getByText('Analysis & Data Visualization Colors')
    ).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<DataVisualizationShowcase />)
    expect(
      screen.getByText(/Specialized color palette designed for charts/)
    ).toBeInTheDocument()
  })

  it('renders analysis color swatches', () => {
    render(<DataVisualizationShowcase />)

    // Check for visualization color names
    expect(screen.getByText('Visualization 1')).toBeInTheDocument()
    expect(screen.getByText('Visualization 2')).toBeInTheDocument()
  })

  it('renders usage guidelines section', () => {
    render(<DataVisualizationShowcase />)
    expect(screen.getByText('Usage Guidelines')).toBeInTheDocument()
    expect(screen.getByText('Recommended Use Cases')).toBeInTheDocument()
    expect(screen.getByText('Color Accessibility')).toBeInTheDocument()
  })

  it('renders implementation example section', () => {
    render(<DataVisualizationShowcase />)
    expect(screen.getByText('Implementation Example')).toBeInTheDocument()
    expect(
      screen.getByText(/import { getDataVisualizationColors }/)
    ).toBeInTheDocument()
  })

  it('shows technology icons for each color', () => {
    render(<DataVisualizationShowcase />)

    // Check for specific icons for the colors we have in mock
    expect(screen.getByTestId('bar-chart3-icon')).toBeInTheDocument() // Visualization 1
    expect(screen.getByTestId('pie-chart-icon')).toBeInTheDocument() // Visualization 2
  })

  it('renders color hex values', () => {
    render(<DataVisualizationShowcase />)

    // Check that visualization colors are rendered (they appear in both color swatches and palette reference)
    expect(screen.getAllByText('#3b82f6').length).toBeGreaterThan(0) // Visualization 1 blue
    expect(screen.getAllByText('#6366f1').length).toBeGreaterThan(0) // Visualization 2 indigo
    expect(screen.getAllByText('#0ea5e9').length).toBeGreaterThan(0) // Visualization 3 sky
    expect(screen.getAllByText('#ef4444').length).toBeGreaterThan(0) // Visualization 5 red
    expect(screen.getAllByText('#22c55e').length).toBeGreaterThan(0) // Visualization 6 green
    expect(screen.getAllByText('#a855f7').length).toBeGreaterThan(0) // Visualization 7 purple
  })

  it('renders color RGB values', () => {
    render(<DataVisualizationShowcase />)

    // Check for RGB color values
    expect(screen.getByText('rgb(59, 130, 246)')).toBeInTheDocument() // Visualization 1 blue
    expect(screen.getByText('rgb(239, 68, 68)')).toBeInTheDocument() // Database red
    expect(screen.getByText('rgb(34, 197, 94)')).toBeInTheDocument() // Security green
  })

  it('renders usage descriptions for colors', () => {
    render(<DataVisualizationShowcase />)

    // Check for usage descriptions
    expect(
      screen.getByText('Primary data series, main categories')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Secondary data series, sub-categories')
    ).toBeInTheDocument()
  })

  it('renders interactive chart examples', () => {
    render(<DataVisualizationShowcase />)

    // Check for chart example titles
    expect(screen.getByText('Skills Assessment')).toBeInTheDocument()
    expect(screen.getByText('Performance Trends')).toBeInTheDocument()
    expect(screen.getByText('Growth Metrics')).toBeInTheDocument()
    expect(screen.getByText('Technology Stack')).toBeInTheDocument()
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument()
  })

  it('renders chart components with custom SVG implementations', () => {
    render(<DataVisualizationShowcase />)

    // Check for custom chart components that actually use our visualization colors
    expect(screen.getByText('Skills Assessment')).toBeInTheDocument()
    expect(screen.getByText('Performance Trends')).toBeInTheDocument()
    expect(screen.getByText('Growth Metrics')).toBeInTheDocument()
    expect(screen.getByText('Technology Stack')).toBeInTheDocument()

    // Check that SVG elements are present (our custom charts use SVG)
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('renders metrics with proper values', () => {
    render(<DataVisualizationShowcase />)

    // Check for metric values
    expect(screen.getByText('24')).toBeInTheDocument() // Active Projects
    expect(screen.getByText('98%')).toBeInTheDocument() // Success Rate
    expect(screen.getByText('4.9')).toBeInTheDocument() // Client Satisfaction
    expect(screen.getByText('1.2s')).toBeInTheDocument() // Response Time
  })

  it('renders pie chart with technology stack data', () => {
    render(<DataVisualizationShowcase />)

    // Check for technology stack labels in pie chart
    expect(screen.getByText(/React:/)).toBeInTheDocument()
    expect(screen.getByText(/TypeScript:/)).toBeInTheDocument()
    expect(screen.getByText(/Next.js:/)).toBeInTheDocument()
    expect(screen.getByText(/Vue.js:/)).toBeInTheDocument()
  })

  it('renders color palette reference', () => {
    render(<DataVisualizationShowcase />)

    expect(screen.getByText('Color Palette Reference')).toBeInTheDocument()
    expect(screen.getByText('Color 1')).toBeInTheDocument()
    expect(screen.getByText('Color 2')).toBeInTheDocument()
  })
})
