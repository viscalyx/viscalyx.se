import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LocaleError from '@/app/[locale]/error'

vi.mock('@/components/ErrorPage', () => ({
  default: ({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) => (
    <div data-testid="error-page">
      <span data-testid="error-message">{error.message}</span>
      <button onClick={reset}>Reset</button>
    </div>
  ),
}))

describe('Locale error page', () => {
  const mockError = Object.assign(new Error('Test error'), {
    digest: 'test-digest',
  })
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the ErrorPage component', () => {
    render(<LocaleError error={mockError} reset={mockReset} />)
    expect(screen.getByTestId('error-page')).toBeInTheDocument()
  })

  it('passes error prop to ErrorPage', () => {
    render(<LocaleError error={mockError} reset={mockReset} />)
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')
  })

  it('passes reset prop to ErrorPage', async () => {
    render(<LocaleError error={mockError} reset={mockReset} />)
    const button = screen.getByRole('button', { name: 'Reset' })
    button.click()
    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})
