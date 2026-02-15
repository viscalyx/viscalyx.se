import LocaleNotFound from '@/app/[locale]/not-found'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page">NotFoundPage</div>,
}))

describe('Locale not-found page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the NotFoundPage component', () => {
    render(<LocaleNotFound />)
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument()
  })
})
