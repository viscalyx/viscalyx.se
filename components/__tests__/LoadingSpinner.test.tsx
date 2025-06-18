import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {

  it('renders an accessible spinner', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { name: /loading/i })
    expect(spinner).toBeInTheDocument()
  })

  it('renders with default props (medium size and primary color)', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    const icon = spinner.querySelector('svg')
    
    expect(spinner).toBeInTheDocument()
    expect(icon).toHaveClass('w-6', 'h-6', 'text-primary-600', 'animate-spin')
  })

  describe('size prop', () => {
    it('renders small spinner when size is sm', () => {
      render(<LoadingSpinner size="sm" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('renders medium spinner when size is md', () => {
      render(<LoadingSpinner size="md" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('w-6', 'h-6')
    })

    it('renders large spinner when size is lg', () => {
      render(<LoadingSpinner size="lg" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('w-8', 'h-8')
    })
  })

  describe('color prop', () => {
    it('renders primary color by default', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('text-primary-600')
    })

    it('renders white color when color is white', () => {
      render(<LoadingSpinner color="white" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('text-white')
    })

    it('renders secondary color when color is secondary', () => {
      render(<LoadingSpinner color="secondary" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('text-secondary-600')
    })
  })

  describe('loading states', () => {
    it('is present in DOM when rendered (loading state)', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      
      expect(spinner).toBeInTheDocument()
    })

    it('can be conditionally rendered based on loading state', () => {
      const { rerender } = render(
        <div data-testid="container">
          {true && <LoadingSpinner />}
        </div>
      )
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      
      rerender(
        <div data-testid="container">
          {false && <LoadingSpinner />}
        </div>
      )
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('unmounts correctly when removed from DOM', () => {
      const { unmount } = render(<LoadingSpinner />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      
      unmount()
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      
      expect(spinner).toHaveAttribute('role', 'status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
    })

    it('is announced by screen readers', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByLabelText(/loading/i)
      
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('styling and animation', () => {
    it('has correct container classes', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      
      expect(spinner).toHaveClass('flex', 'items-center', 'justify-center')
    })

    it('has spinning animation on the icon', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('animate-spin')
    })

    it('renders with Lucide Loader2 icon', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toBeInTheDocument()
      expect(icon).toBeInstanceOf(SVGElement)
    })
  })

  describe('prop combinations', () => {
    it('renders correctly with both size and color props', () => {
      render(<LoadingSpinner size="lg" color="white" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('w-8', 'h-8', 'text-white', 'animate-spin')
    })

    it('renders correctly with small size and secondary color', () => {
      render(<LoadingSpinner size="sm" color="secondary" />)
      const spinner = screen.getByRole('status')
      const icon = spinner.querySelector('svg')
      
      expect(icon).toHaveClass('w-4', 'h-4', 'text-secondary-600', 'animate-spin')
    })
  })
})
