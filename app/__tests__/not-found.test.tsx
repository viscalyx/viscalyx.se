import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RootNotFound from '@/app/not-found'

describe('Root not-found page', () => {
  it('renders the 404 heading', () => {
    render(<RootNotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders the page not found heading', () => {
    render(<RootNotFound />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('renders a description message', () => {
    render(<RootNotFound />)
    expect(
      screen.getByText(/the page you are looking for does not exist/)
    ).toBeInTheDocument()
  })

  it('renders a link to the English homepage', () => {
    render(<RootNotFound />)
    const link = screen.getByRole('link', { name: /go to homepage/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/en')
  })

  it('uses semantic main element', () => {
    render(<RootNotFound />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders with hardcoded English content (no locale context)', () => {
    // Root not-found has no locale context, so text is hardcoded English.
    // This is intentional — the root layout has no i18n provider.
    render(<RootNotFound />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
