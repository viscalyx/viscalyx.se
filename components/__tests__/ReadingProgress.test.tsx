import ReadingProgress from '@/components/ReadingProgress'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('ReadingProgress', () => {
  let proseElement: HTMLDivElement

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    })
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(0)
        return 0
      }
    )

    // Set up a .prose element
    proseElement = document.createElement('div')
    proseElement.classList.add('prose')
    Object.defineProperty(proseElement, 'offsetHeight', { value: 2000 })
    proseElement.getBoundingClientRect = vi.fn(() => ({
      top: -200,
      left: 0,
      right: 0,
      bottom: 1800,
      width: 0,
      height: 2000,
      x: 0,
      y: -200,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(proseElement)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the top progress bar', () => {
    render(<ReadingProgress />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('has accessible aria-label from translations', () => {
    render(<ReadingProgress />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-label', 'ariaLabel')
  })

  it('does not render circular progress indicator', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })
    render(<ReadingProgress />)
    fireEvent.scroll(window)
    // Only the top bar progressbar should exist, no circular indicator
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars).toHaveLength(1)
  })

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ReadingProgress />)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
