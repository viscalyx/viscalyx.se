import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TeamMemberLoading from '@/app/[locale]/team/[memberId]/loading'

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size }: { size: string }) => (
    <div data-testid="loading-spinner" data-size={size} />
  ),
}))

describe('TeamMemberLoading page', () => {
  it('renders centered large LoadingSpinner', () => {
    const { container } = render(<TeamMemberLoading />)
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
    expect(container.firstChild).toHaveClass('justify-center')
  })
})
