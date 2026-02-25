import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ScrollToTop from '@/components/ScrollToTop'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })
    window.scrollTo = vi.fn()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(0)
        return 0
      }
    )
  })

  it('is hidden when scrollY is below threshold', () => {
    render(<ScrollToTop />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('appears when scrollY exceeds 300', () => {
    render(<ScrollToTop />)
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has correct aria-label from translations', () => {
    render(<ScrollToTop />)
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'ariaLabel'
    )
  })

  it('includes dark mode variants in className', () => {
    render(<ScrollToTop />)
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    const button = screen.getByRole('button')
    expect(button.className).toContain('dark:bg-primary-500')
    expect(button.className).toContain('dark:hover:bg-primary-600')
  })

  it('scrolls to top when clicked', () => {
    render(<ScrollToTop />)
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    fireEvent.click(screen.getByRole('button'))
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('hides when scrolling back to top', () => {
    render(<ScrollToTop />)
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    expect(screen.getByRole('button')).toBeInTheDocument()

    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
      configurable: true,
    })
    fireEvent.scroll(window)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ScrollToTop />)
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    })
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
