import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ReadingProgress from '@/components/ReadingProgress'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('ReadingProgress', () => {
  let proseElement: HTMLDivElement
  let originalScrollHeightDescriptor: PropertyDescriptor | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    originalScrollHeightDescriptor = Object.getOwnPropertyDescriptor(
      document.documentElement,
      'scrollHeight',
    )
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
      },
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
    if (originalScrollHeightDescriptor) {
      Object.defineProperty(
        document.documentElement,
        'scrollHeight',
        originalScrollHeightDescriptor,
      )
    } else {
      // Remove test-defined override and fall back to jsdom's default behavior.
      Reflect.deleteProperty(document.documentElement, 'scrollHeight')
    }
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

  it('falls back to full-page progress when target selector is missing', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 600,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress target=".missing-target" />)
    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '27') // 600 / (3000 - 800) ~= 27%
  })

  it('sets progress to 0 before reaching the tracked content start', () => {
    proseElement.getBoundingClientRect = vi.fn(() => ({
      top: 1200,
      left: 0,
      right: 0,
      bottom: 3200,
      width: 0,
      height: 2000,
      x: 0,
      y: 1200,
      toJSON: vi.fn(),
    }))
    render(<ReadingProgress />)
    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('reaches 100% when endTarget has been passed', () => {
    const endElement = document.createElement('div')
    endElement.id = 'author-bio'
    endElement.getBoundingClientRect = vi.fn(() => ({
      top: -1000,
      left: 0,
      right: 0,
      bottom: -800,
      width: 0,
      height: 200,
      x: 0,
      y: -1000,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(endElement)

    Object.defineProperty(window, 'scrollY', {
      value: 4000,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#author-bio" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('does not jump to 100% when endTarget is already in the viewport', () => {
    const endElement = document.createElement('div')
    endElement.id = 'author-bio'
    endElement.getBoundingClientRect = vi.fn(() => ({
      top: 200,
      left: 0,
      right: 0,
      bottom: 400,
      width: 0,
      height: 200,
      x: 0,
      y: 200,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(endElement)

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#author-bio" />)
    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '83')
  })

  it('reaches 100% at page bottom even when endTarget is below max scroll', () => {
    const endElement = document.createElement('div')
    endElement.id = 'author-bio'
    endElement.getBoundingClientRect = vi.fn(() => ({
      top: 2800,
      left: 0,
      right: 0,
      bottom: 3000,
      width: 0,
      height: 200,
      x: 0,
      y: 2800,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(endElement)

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 2199,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#author-bio" />)
    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })
})
