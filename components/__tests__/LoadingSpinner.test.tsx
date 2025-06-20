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
    test.each<{ size: 'sm' | 'md' | 'lg'; classes: string[] }>([
      { size: 'sm', classes: ['w-4', 'h-4'] },
      { size: 'md', classes: ['w-6', 'h-6'] },
      { size: 'lg', classes: ['w-8', 'h-8'] },
    ])(
      'renders spinner with correct classes for size %s',
      ({ size, classes }) => {
        render(<LoadingSpinner size={size} />)
        const spinner = screen.getByRole('status')
        const icon = spinner.querySelector('svg')

        expect(icon).toHaveClass(...classes)
      }
    )
  })

  describe('color prop', () => {
    test.each([
      { propColor: undefined, expectedClass: 'text-primary-600' },
      { propColor: 'white', expectedClass: 'text-white' },
      { propColor: 'secondary', expectedClass: 'text-secondary-600' },
    ])(
      'renders $expectedClass when color is $propColor',
      ({ propColor, expectedClass }) => {
        const props: Record<string, unknown> = {}
        if (propColor) props.color = propColor
        render(<LoadingSpinner {...props} />)
        const spinner = screen.getByRole('status')
        const icon = spinner.querySelector('svg')

        expect(icon).toHaveClass(expectedClass)
      }
    )
  })

  describe('loading states', () => {
    it('is present in DOM when rendered (loading state)', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')

      expect(spinner).toBeInTheDocument()
    })

    it('can be conditionally rendered based on loading state', () => {
      const { rerender } = render(
        <div data-testid="container">{true && <LoadingSpinner />}</div>
      )

      rerender(<div data-testid="container">{false && <LoadingSpinner />}</div>)

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('unmounts correctly when removed from DOM', () => {
      const { unmount } = render(<LoadingSpinner />)

      unmount()

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes and is announced to screen readers', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status', { name: /loading/i })

      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveAttribute('role', 'status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
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
      expect(icon).toHaveAttribute('data-icon', 'loader-2')
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

      expect(icon).toHaveClass(
        'w-4',
        'h-4',
        'text-secondary-600',
        'animate-spin'
      )
    })
  })
})
