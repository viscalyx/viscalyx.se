import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BlogPostNotFound from '../not-found'

vi.mock('@/components/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page" />,
}))

describe('BlogPostNotFound', () => {
  it('renders NotFoundPage component', () => {
    render(<BlogPostNotFound />)
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })
})
