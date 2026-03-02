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

    const value = Number.parseInt(
      progressBar.getAttribute('aria-valuenow') ?? '0',
      10,
    )
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(100)
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
      value: 2200,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#author-bio" />)
    const progressBar = screen.getByRole('progressbar')

    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('handles invalid target CSS selector gracefully', () => {
    // Mock querySelector to throw for the invalid selector
    const originalQS = document.querySelector.bind(document)
    vi.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '[invalid') {
        throw new DOMException('Invalid selector', 'SyntaxError')
      }
      return originalQS(selector)
    })

    render(<ReadingProgress target="[invalid" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('handles invalid endTarget CSS selector gracefully', () => {
    const originalQS = document.querySelector.bind(document)
    vi.spyOn(document, 'querySelector').mockImplementation(selector => {
      if (selector === '[invalid-end') {
        throw new DOMException('Invalid selector', 'SyntaxError')
      }
      return originalQS(selector)
    })

    render(<ReadingProgress endTarget="[invalid-end" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('re-queries disconnected target element on scroll', () => {
    // Start with no prose element
    document.body.innerHTML = ''

    render(<ReadingProgress target=".late-prose" />)
    const progressBar = screen.getByRole('progressbar')

    // Now add the element after mount (simulating lazy rendering)
    const lateElement = document.createElement('div')
    lateElement.classList.add('late-prose')
    Object.defineProperty(lateElement, 'offsetHeight', { value: 1000 })
    lateElement.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 0,
      right: 800,
      bottom: 1000,
      width: 800,
      height: 1000,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(lateElement)

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
      configurable: true,
    })

    fireEvent.scroll(window)
    expect(progressBar).toBeInTheDocument()
  })

  it('re-queries disconnected endTarget element on scroll', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#late-bio" />)
    const progressBar = screen.getByRole('progressbar')

    // Now add the endTarget element after mount
    const lateEndElement = document.createElement('div')
    lateEndElement.id = 'late-bio'
    lateEndElement.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      left: 0,
      right: 800,
      bottom: 700,
      width: 800,
      height: 200,
      x: 0,
      y: 500,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(lateEndElement)

    fireEvent.scroll(window)
    expect(progressBar).toBeInTheDocument()
  })

  it('shows zero progress when total scroll height matches window height', () => {
    // Simulate totalHeight = 0 (scrollHeight === innerHeight)
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      configurable: true,
    })

    render(<ReadingProgress target=".missing-target" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('updates progress on resize events', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress />)
    fireEvent.resize(window)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('cancels animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount } = render(<ReadingProgress />)
    unmount()
    expect(cancelSpy).toHaveBeenCalled()
  })

  it('does not re-query invalid target selector on scroll', () => {
    // Mock querySelector to throw for the invalid selector
    const originalQS = document.querySelector.bind(document)
    const querySpy = vi
      .spyOn(document, 'querySelector')
      .mockImplementation(selector => {
        if (selector === '[bad-sel') {
          throw new DOMException('Invalid selector', 'SyntaxError')
        }
        return originalQS(selector)
      })

    render(<ReadingProgress target="[bad-sel" />)

    // Count initial calls for the invalid selector
    const initialCalls = querySpy.mock.calls.filter(
      c => c[0] === '[bad-sel',
    ).length
    expect(initialCalls).toBeGreaterThanOrEqual(1)

    // Clear call history and trigger scroll
    querySpy.mockClear()
    // Re-apply the same implementation after clear
    querySpy.mockImplementation(selector => {
      if (selector === '[bad-sel') {
        throw new DOMException('Invalid selector', 'SyntaxError')
      }
      return originalQS(selector)
    })
    fireEvent.scroll(window)

    // Should not have additional calls for the invalid selector
    const afterScrollCalls = querySpy.mock.calls.filter(
      c => c[0] === '[bad-sel',
    ).length
    expect(afterScrollCalls).toBe(0)
  })

  it('re-queries target when element is disconnected from DOM', () => {
    // Start with the prose element connected
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()

    // Remove the prose element - simulates it being disconnected
    document.body.removeChild(proseElement)

    // Create a new prose element to be found on re-query
    const newProse = document.createElement('div')
    newProse.classList.add('prose')
    Object.defineProperty(newProse, 'offsetHeight', { value: 1500 })
    newProse.getBoundingClientRect = vi.fn(() => ({
      top: -100,
      left: 0,
      right: 800,
      bottom: 1400,
      width: 800,
      height: 1500,
      x: 0,
      y: -100,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(newProse)

    // Scroll to trigger re-query
    fireEvent.scroll(window)
    expect(progressBar).toBeInTheDocument()
  })

  it('re-queries endTarget when element is disconnected from DOM', () => {
    const endElement = document.createElement('div')
    endElement.id = 'end-marker'
    endElement.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      left: 0,
      right: 0,
      bottom: 700,
      width: 0,
      height: 200,
      x: 0,
      y: 500,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(endElement)

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 300,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#end-marker" />)
    const progressBar = screen.getByRole('progressbar')

    // Remove the endTarget, then re-add it
    document.body.removeChild(endElement)

    const newEndElement = document.createElement('div')
    newEndElement.id = 'end-marker'
    newEndElement.getBoundingClientRect = vi.fn(() => ({
      top: 400,
      left: 0,
      right: 0,
      bottom: 600,
      width: 0,
      height: 200,
      x: 0,
      y: 400,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(newEndElement)

    fireEvent.scroll(window)
    expect(progressBar).toBeInTheDocument()
  })

  it('handles zero-range scroll area gracefully', () => {
    // Create a new element with zero height to test zero-range scenario
    document.body.removeChild(proseElement)
    const zeroHeightProse = document.createElement('div')
    zeroHeightProse.classList.add('prose')
    Object.defineProperty(zeroHeightProse, 'offsetHeight', {
      value: 0,
      configurable: true,
    })
    zeroHeightProse.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 0,
      right: 800,
      bottom: 0,
      width: 800,
      height: 0,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(zeroHeightProse)

    const endElement = document.createElement('div')
    endElement.id = 'zero-end'
    endElement.getBoundingClientRect = vi.fn(() => ({
      top: -800,
      left: 0,
      right: 0,
      bottom: -800,
      width: 0,
      height: 0,
      x: 0,
      y: -800,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(endElement)

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })

    render(<ReadingProgress endTarget="#zero-end" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('does not re-query invalid endTarget selector on scroll', () => {
    const originalQS = document.querySelector.bind(document)
    const querySpy = vi
      .spyOn(document, 'querySelector')
      .mockImplementation(selector => {
        if (selector === '[bad-end') {
          throw new DOMException('Invalid selector', 'SyntaxError')
        }
        return originalQS(selector)
      })

    render(<ReadingProgress endTarget="[bad-end" />)

    querySpy.mockClear()
    querySpy.mockImplementation(selector => {
      if (selector === '[bad-end') {
        throw new DOMException('Invalid selector', 'SyntaxError')
      }
      return originalQS(selector)
    })

    fireEvent.scroll(window)

    const afterScrollCalls = querySpy.mock.calls.filter(
      c => c[0] === '[bad-end',
    ).length
    expect(afterScrollCalls).toBe(0)
  })
})
