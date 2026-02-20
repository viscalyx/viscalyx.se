import { mockLoadingSpinner } from '@/test-utils/mocks/loading-spinner'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LocaleLoading from '../loading'

mockLoadingSpinner()

describe('LocaleLoading', () => {
  it('renders centered large LoadingSpinner', () => {
    const { container } = render(<LocaleLoading />)
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'data-size',
      'lg'
    )
    expect(container.firstChild).toHaveClass('flex')
    expect(container.firstChild).toHaveClass('items-center')
  })
})
