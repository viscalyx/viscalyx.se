import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import RechartsComparison from '../brandprofile/RechartsComparison'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    if (namespace === 'brandProfile.analysisShowcase.rechartsComparison') {
      const translations: Record<string, string> = {
        title: 'Recharts Implementation Comparison',
        description:
          "Here's how the same data visualizations look using the Recharts library, maintaining our brand color palette and design consistency.",
      }
      return translations[key] || key
    }
    return key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock recharts
vi.mock('recharts', () => ({
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: any) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  PieChart: ({ children }: any) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}))

// Mock the colors module
vi.mock('@/lib/colors', () => ({
  getDataVisualizationColors: () => [
    { name: 'Visualization 1', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
    { name: 'Visualization 2', hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)' },
    { name: 'Visualization 3', hex: '#06b6d4', rgb: 'rgb(6, 182, 212)' },
    { name: 'Visualization 4', hex: '#10b981', rgb: 'rgb(16, 185, 129)' },
    { name: 'Visualization 5', hex: '#f59e0b', rgb: 'rgb(245, 158, 11)' },
    { name: 'Visualization 6', hex: '#ef4444', rgb: 'rgb(239, 68, 68)' },
    { name: 'Visualization 7', hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)' },
    { name: 'Visualization 8', hex: '#6b7280', rgb: 'rgb(107, 114, 128)' },
  ],
}))

describe('RechartsComparison', () => {
  it('renders the main heading', () => {
    render(<RechartsComparison />)
    expect(
      screen.getByText('Recharts Implementation Comparison')
    ).toBeInTheDocument()
  })

  it('renders comparison sections for all chart types', () => {
    render(<RechartsComparison />)

    expect(screen.getByText('Bar Chart Comparison')).toBeInTheDocument()
    expect(screen.getByText('Line Chart Comparison')).toBeInTheDocument()
    expect(screen.getByText('Area Chart Comparison')).toBeInTheDocument()
    expect(screen.getByText('Pie Chart Comparison')).toBeInTheDocument()
  })

  it('renders recharts components', () => {
    render(<RechartsComparison />)

    // Check for recharts elements
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders responsive containers for all charts', () => {
    render(<RechartsComparison />)

    const containers = screen.getAllByTestId('responsive-container')
    expect(containers).toHaveLength(4) // One for each chart type
  })

  it('displays performance analysis section', () => {
    render(<RechartsComparison />)

    expect(
      screen.getByText('Performance & Bundle Size Analysis')
    ).toBeInTheDocument()
    expect(screen.getByText('~160KB')).toBeInTheDocument()
    expect(screen.getByText('Recharts Bundle Size')).toBeInTheDocument()
    expect(screen.getByText('~0KB')).toBeInTheDocument()
    expect(screen.getByText('Custom SVG Overhead')).toBeInTheDocument()
  })

  it('shows implementation recommendations', () => {
    render(<RechartsComparison />)

    expect(
      screen.getByText('Implementation Recommendation')
    ).toBeInTheDocument()
    expect(screen.getByText('Use Recharts when:')).toBeInTheDocument()
    expect(screen.getByText('Use Custom SVG when:')).toBeInTheDocument()
  })

  it('displays benefits and drawbacks comparison', () => {
    render(<RechartsComparison />)

    expect(screen.getByText('Custom SVG Implementation')).toBeInTheDocument()
    expect(screen.getByText('Recharts Benefits')).toBeInTheDocument()

    // Check for specific benefits/drawbacks
    expect(
      screen.getByText('✅ Full control over styling and animations')
    ).toBeInTheDocument()
    expect(
      screen.getByText('✅ Built-in responsive behavior')
    ).toBeInTheDocument()
    expect(
      screen.getByText('❌ Additional bundle size (~160KB)')
    ).toBeInTheDocument()
  })

  it('shows color consistency information', () => {
    render(<RechartsComparison />)

    expect(screen.getByText('Color Consistency')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Color Palette Accuracy')).toBeInTheDocument()
  })

  it('renders chart titles with recharts suffix', () => {
    render(<RechartsComparison />)

    expect(screen.getByText('Skills Assessment (Recharts)')).toBeInTheDocument()
    expect(
      screen.getByText('Performance Trends (Recharts)')
    ).toBeInTheDocument()
    expect(screen.getByText('Growth Metrics (Recharts)')).toBeInTheDocument()
    expect(screen.getByText('Technology Stack (Recharts)')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <RechartsComparison className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
