import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LocaleLoading from '../loading'

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size }: { size: string }) => (
    <div data-testid="loading-spinner" data-size={size} />
  ),
}))

describe('LocaleLoading', () => {
  it('renders centered large LoadingSpinner', () => {
    const { container } = render(<LocaleLoading />)
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
    expect(container.firstChild).toHaveClass('flex')
    expect(container.firstChild).toHaveClass('items-center')
  })
})
