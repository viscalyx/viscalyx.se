import LoadingScreen from '@/components/LoadingScreen'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/components/LoadingSpinner', () => ({
  default: ({ size, color }: { size: string; color: string }) => (
    <div data-testid="loading-spinner" data-color={color} data-size={size} />
  ),
}))

describe('LoadingScreen', () => {
  it('renders the default loading message', () => {
    render(<LoadingScreen />)

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('renders the redirecting message when type is redirecting', () => {
    render(<LoadingScreen type="redirecting" />)

    expect(screen.getByText('redirecting')).toBeInTheDocument()
  })

  it('renders a custom message when provided', () => {
    render(<LoadingScreen message="Preparing dashboard..." />)

    expect(screen.getByText('Preparing dashboard...')).toBeInTheDocument()
    expect(screen.queryByText('loading')).not.toBeInTheDocument()
  })

  it('renders main layout and passes expected props to LoadingSpinner', () => {
    render(<LoadingScreen />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-color',
      'primary'
    )
  })
})
