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

    // Check for hex color values
    expect(screen.getByText('#3b82f6')).toBeInTheDocument() // Visualization 1 blue
    expect(screen.getByText('#6366f1')).toBeInTheDocument() // Configuration indigo
    expect(screen.getByText('#0ea5e9')).toBeInTheDocument() // Cloud sky
    expect(screen.getByText('#ef4444')).toBeInTheDocument() // Database red
    expect(screen.getByText('#22c55e')).toBeInTheDocument() // Security green
    expect(screen.getByText('#a855f7')).toBeInTheDocument() // Performance purple
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
})
