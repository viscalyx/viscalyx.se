import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlogPostLoading from '../loading'

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size }: { size?: string }) => (
    <output data-testid="loading-spinner" data-size={size} aria-live="polite">
      Loading...
    </output>
  ),
}))

describe('Blog post loading page', () => {
  it('renders the LoadingSpinner component', () => {
    render(<BlogPostLoading />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('passes size="lg" to LoadingSpinner', () => {
    render(<BlogPostLoading />)
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
  })

  it('renders with an accessible loading status', () => {
    render(<BlogPostLoading />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with centered layout', () => {
    const { container } = render(<BlogPostLoading />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('flex')
    expect(wrapper?.className).toContain('items-center')
    expect(wrapper?.className).toContain('justify-center')
    expect(wrapper?.className).toContain('min-h-[50vh]')
  })
})
