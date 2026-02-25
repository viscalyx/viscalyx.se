import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TeamMemberNotFound from '../not-found'

vi.mock('@/components/NotFoundPage', () => ({
  default: () => <main data-testid="not-found-page" />,
}))

describe('TeamMemberNotFound page', () => {
  it('renders NotFoundPage component', () => {
    render(<TeamMemberNotFound />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
