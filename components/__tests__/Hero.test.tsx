import Hero from '@/components/Hero'

import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockHandleNavigation = vi.fn()
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/en',
}))

vi.mock('@/lib/use-section-navigation', () => ({
  useSectionNavigation: () => ({
    handleNavigation: mockHandleNavigation,
  }),
}))

// Mock next-intl translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('Hero component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses hero-section class instead of min-h-screen for portrait height cap', () => {
    const { container } = render(<Hero />)

    const section = container.querySelector('section')
    expect(section).toHaveClass('hero-section')
    expect(section).not.toHaveClass('min-h-screen')
  })

  it('renders badge, title and navigation elements', () => {
    render(<Hero />)

    expect(screen.getByText('badge')).toBeInTheDocument()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('title')
    expect(heading).toHaveTextContent('titleHighlight')
    expect(heading).toHaveTextContent('titleEnd')

    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByText('buttons.learnMore')).toBeInTheDocument()
  })

  it('navigates to about section when Learn More is clicked', () => {
    render(<Hero />)

    fireEvent.click(screen.getByRole('button', { name: 'buttons.learnMore' }))

    expect(mockHandleNavigation).toHaveBeenCalledWith('#about')
  })

  it('renders hero images', () => {
    render(<Hero />)

    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(4)
    expect(images[0]).toHaveAttribute(
      'src',
      expect.stringContaining('calm-productive-engineering-culture')
    )
  })

  it('updates active indicator when an indicator button is clicked', () => {
    render(<Hero />)

    const indicator = screen.getByRole('button', { name: 'Show image 3 of 4' })
    fireEvent.click(indicator)

    expect(indicator).toHaveClass('bg-white', 'shadow-lg')
  })

  it('shows image fallback UI when image loading fails', () => {
    render(<Hero />)

    const firstImage = screen.getAllByRole('img')[0]
    fireEvent.error(firstImage)

    expect(screen.getByText('errorFallback')).toBeInTheDocument()
  })

  it('hides the loading placeholder once image has loaded', () => {
    const { container } = render(<Hero />)

    const initialSpinnerCount =
      container.querySelectorAll('.animate-spin').length
    expect(initialSpinnerCount).toBeGreaterThan(0)

    const firstImage = screen.getAllByRole('img')[0]
    fireEvent.load(firstImage)

    expect(firstImage).toHaveClass('opacity-100')
    expect(container.querySelectorAll('.animate-spin')).toHaveLength(
      initialSpinnerCount - 1
    )
  })

  it('cycles active image over time', () => {
    try {
      vi.useFakeTimers()
      render(<Hero />)

      const secondIndicator = screen.getByRole('button', {
        name: 'Show image 2 of 4',
      })
      expect(secondIndicator).toHaveClass('bg-white/50')

      act(() => {
        vi.advanceTimersByTime(4000)
      })

      expect(secondIndicator).toHaveClass('bg-white', 'shadow-lg')
    } finally {
      vi.useRealTimers()
    }
  })
})
