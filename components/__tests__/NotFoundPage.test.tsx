import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NotFoundPage from '../NotFoundPage'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('NotFoundPage', () => {
  it('renders the 404 heading', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders the not found heading with translation key', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('heading')).toBeInTheDocument()
  })

  it('renders the description with translation key', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders a link to the homepage', () => {
    render(<NotFoundPage />)
    const link = screen.getByRole('link', { name: 'goHome' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/en')
  })

  it('uses semantic main element', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('uses proper heading hierarchy', () => {
    render(<NotFoundPage />)
    const h1 = screen.getByText('404')
    expect(h1.tagName).toBe('H1')

    const h2 = screen.getByText('heading')
    expect(h2.tagName).toBe('H2')
  })

  it('includes dark mode classes', () => {
    render(<NotFoundPage />)
    const heading = screen.getByText('heading')
    expect(heading.className).toContain('dark:')
  })
})
