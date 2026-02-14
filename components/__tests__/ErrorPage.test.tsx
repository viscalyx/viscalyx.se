import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ErrorPage from '../ErrorPage'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('ErrorPage', () => {
  const mockError = Object.assign(new Error('Test error'), {
    digest: 'test-digest',
  })
  const mockReset = vi.fn()

  it('renders the error heading', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('heading')).toBeInTheDocument()
  })

  it('renders the error description', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders the try again button', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const button = screen.getByRole('button', { name: 'tryAgain' })
    expect(button).toBeInTheDocument()
  })

  it('calls reset when try again button is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const button = screen.getByRole('button', { name: 'tryAgain' })
    await user.click(button)
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders a link to the homepage', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const link = screen.getByRole('link', { name: 'goHome' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/en')
  })

  it('uses semantic main element', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('logs the error on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(consoleSpy).toHaveBeenCalledWith('Application error:', mockError)
    consoleSpy.mockRestore()
  })

  it('uses proper heading hierarchy', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const h1 = screen.getByText('!')
    expect(h1.tagName).toBe('H1')

    const h2 = screen.getByText('heading')
    expect(h2.tagName).toBe('H2')
  })

  it('includes dark mode classes', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const heading = screen.getByText('heading')
    expect(heading.className).toContain('dark:')
  })
})
