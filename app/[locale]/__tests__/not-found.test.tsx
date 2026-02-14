import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LocaleNotFound from '@/app/[locale]/not-found'

vi.mock('@/components/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page">NotFoundPage</div>,
}))

describe('Locale not-found page', () => {
  it('renders the NotFoundPage component', () => {
    render(<LocaleNotFound />)
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })

  it('renders the NotFoundPage text', () => {
    render(<LocaleNotFound />)
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument()
  })
})
