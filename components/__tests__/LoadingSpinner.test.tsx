import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders an accessible spinner', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { name: /loading/i })
    expect(spinner).toBeInTheDocument()
  })
})
