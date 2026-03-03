import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TeamMemberNotFound from '@/app/[locale]/team/[memberId]/not-found'

vi.mock('@/components/NotFoundPage', () => ({
  default: () => <main />,
}))

describe('TeamMemberNotFound page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders NotFoundPage component', () => {
    render(<TeamMemberNotFound />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
