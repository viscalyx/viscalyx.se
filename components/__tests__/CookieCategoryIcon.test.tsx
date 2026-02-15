import CookieCategoryIcon from '@/components/CookieCategoryIcon'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('CookieCategoryIcon', () => {
  it('renders Shield icon for strictly-necessary category', () => {
    const { container } = render(
      <CookieCategoryIcon category="strictly-necessary" />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-green-600')
  })

  it('renders BarChart3 icon for analytics category', () => {
    const { container } = render(<CookieCategoryIcon category="analytics" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-blue-600')
  })

  it('renders Palette icon for preferences category', () => {
    const { container } = render(<CookieCategoryIcon category="preferences" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-purple-600')
  })

  it('renders all icons with consistent w-5 h-5 sizing', () => {
    const categories = [
      'strictly-necessary',
      'analytics',
      'preferences',
    ] as const

    categories.forEach(category => {
      const { container, unmount } = render(
        <CookieCategoryIcon category={category} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-5', 'h-5')
      unmount()
    })
  })
})
