import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlogLoading from '../loading'

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size }: { size: string }) => (
    <output data-size={size}>Loading...</output>
  ),
}))

describe('BlogLoading', () => {
  it('renders centered large LoadingSpinner', () => {
    const { container } = render(<BlogLoading />)
    expect(screen.getByRole('status')).toHaveAttribute('data-size', 'lg')
    expect(container.firstChild).toHaveClass('min-h-[50vh]')
  })
})
