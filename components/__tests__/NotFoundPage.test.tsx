import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NotFoundPage from '@/components/NotFoundPage'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
    expect(
      screen.getByRole('heading', { level: 1, name: '404' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'heading' })
    ).toBeInTheDocument()
  })
})
