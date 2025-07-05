import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ComponentsShowcase from '../brandprofile/ComponentsShowcase'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className }: any) => (
    <span className={className} data-testid="alert-circle" />
  ),
  Check: ({ className }: any) => (
    <span className={className} data-testid="check" />
  ),
  Info: ({ className }: any) => (
    <span className={className} data-testid="info" />
  ),
  X: ({ className }: any) => <span className={className} data-testid="x" />,
}))

describe('ComponentsShowcase', () => {
  it('renders buttons section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Buttons')).toBeInTheDocument()
    expect(
      screen.getByText('Primary and secondary button styles with hover states')
    ).toBeInTheDocument()
  })

  it('renders button examples', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Primary Button')).toBeInTheDocument()
    expect(screen.getByText('Secondary Button')).toBeInTheDocument()
    expect(screen.getByText('Disabled Button')).toBeInTheDocument()
  })

  it('renders cards section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Cards')).toBeInTheDocument()
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Another Card')).toBeInTheDocument()
  })

  it('renders alerts section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders forms section', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByText('Forms')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('renders alert icons', () => {
    render(<ComponentsShowcase />)
    expect(screen.getByTestId('check')).toBeInTheDocument()
    expect(screen.getByTestId('alert-circle')).toBeInTheDocument()
    expect(screen.getByTestId('x')).toBeInTheDocument()
    expect(screen.getByTestId('info')).toBeInTheDocument()
  })
})
