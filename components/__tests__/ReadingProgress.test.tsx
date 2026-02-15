import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ReadingProgress from '@/components/ReadingProgress'

describe('ReadingProgress', () => {
  let proseElement: HTMLDivElement

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      writable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
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
    const { container } = render(<ReadingProgress />)
    // The motion.div for the top progress bar has the gradient class
    const progressBar = container.querySelector('.from-primary-600')
    expect(progressBar).toBeInTheDocument()
  })

  it('does not render circular progress indicator', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    const { container } = render(<ReadingProgress />)
    fireEvent.scroll(window)
    // The circular indicator should not exist
    const percentage = container.querySelector('.text-xs.font-bold')
    expect(percentage).not.toBeInTheDocument()
  })

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ReadingProgress />)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
