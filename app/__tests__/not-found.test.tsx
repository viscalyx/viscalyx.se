import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(async () => 'en'),
  getTranslations: vi.fn(async () => (key: string) => key),
}))

// Async server component helper
async function renderAsync() {
  const RootNotFound = (await import('@/app/not-found')).default
  const element = await RootNotFound()
  render(element)
}

describe('Root not-found page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the 404 heading', async () => {
    await renderAsync()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders the page not found heading', async () => {
    await renderAsync()
    expect(screen.getByText('heading')).toBeInTheDocument()
  })

  it('renders a description message', async () => {
    await renderAsync()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders a link to the homepage with detected locale', async () => {
    await renderAsync()
    const link = screen.getByRole('link', { name: 'goHomeAriaLabel' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/en')
  })

  it('uses semantic main element', async () => {
    await renderAsync()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('uses the detected locale for the homepage link', async () => {
    const { getLocale } = await import('next-intl/server')
    vi.mocked(getLocale).mockResolvedValueOnce('sv')
    await renderAsync()
    const link = screen.getByRole('link', { name: 'goHomeAriaLabel' })
    expect(link).toHaveAttribute('href', '/sv')
  })
})
