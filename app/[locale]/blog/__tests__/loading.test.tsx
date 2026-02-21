import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlogLoading from '../loading'

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size }: { size: string }) => (
    <div data-testid="loading-spinner" data-size={size} />
  ),
}))

describe('BlogLoading', () => {
  it('renders centered large LoadingSpinner', () => {
    const { container } = render(<BlogLoading />)
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
    expect(container.firstChild).toHaveClass('min-h-[50vh]')
  })
})
