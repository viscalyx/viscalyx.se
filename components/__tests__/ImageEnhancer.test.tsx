import { act, fireEvent, render, screen } from '@testing-library/react'
import Image from 'next/image'
import { useRef } from 'react'
import { vi } from 'vitest'
import ImageEnhancer from '@/components/ImageEnhancer'

// Mock next-intl with a stable translator reference (matches production behavior)
vi.mock('next-intl', () => {
  const translator = (key: string, params?: Record<string, string>) => {
    if (params?.alt) return `${key}: ${params.alt}`
    return key
  }
  return { useTranslations: () => translator }
})

interface MockImageModalProps {
  imageAlt: string
  imageSrc: string
  isOpen: boolean
  onClose: () => void
  triggerElement?: HTMLElement | null
}

// Mock the ImageModal component
vi.mock('@/components/ImageModal', () => ({
  default: ({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
    triggerElement,
  }: MockImageModalProps) =>
    isOpen ? (
      <div
        data-testid="image-modal"
        data-trigger={triggerElement?.tagName}
        role="dialog"
      >
        <button onClick={onClose} type="button">
          Close
        </button>
        <div aria-label={imageAlt} data-src={imageSrc} role="img" />
        <span>{imageAlt}</span>
      </div>
    ) : null,
}))

// Test component that provides a ref with blog content
const TestComponent = ({ children }: { children?: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div className="blog-content" ref={contentRef}>
        <Image
          alt="Test 1"
          height={100}
          src="/test1.jpg"
          unoptimized
          width={100}
        />
        <Image
          alt="Test 2"
          height={100}
          src="/test2.jpg"
          unoptimized
          width={100}
        />
        {children}
      </div>
      <ImageEnhancer contentRef={contentRef} />
    </div>
  )
}

describe('ImageEnhancer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    render(<TestComponent />)
    expect(screen.getByAltText('Test 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test 2')).toBeInTheDocument()
  })

  it('opens modal when image is clicked', async () => {
    render(<TestComponent />)

    // Fast-forward the timer to trigger the enhancement
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1')

    await act(async () => {
      fireEvent.click(image)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test 1')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    render(<TestComponent />)

    // Fast-forward the timer to trigger the enhancement
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    // Open modal
    const image = screen.getByAltText('Test 1')
    await act(async () => {
      fireEvent.click(image)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close modal
    const closeButton = screen.getByText('Close')
    await act(async () => {
      fireEvent.click(closeButton)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows correct image in modal when different images are clicked', async () => {
    render(<TestComponent />)

    // Fast-forward the timer to trigger the enhancement
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    // Click first image
    const image1 = screen.getByAltText('Test 1')
    await act(async () => {
      fireEvent.click(image1)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test 1')).toBeInTheDocument()

    // Close modal
    await act(async () => {
      fireEvent.click(screen.getByText('Close'))
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Click second image
    const image2 = screen.getByAltText('Test 2')
    await act(async () => {
      fireEvent.click(image2)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
  })

  it('marks images as enhanced to prevent duplicate handlers', async () => {
    render(<TestComponent />)

    // Fast-forward the timer to trigger the enhancement
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement
    expect(image.dataset.enhanced).toBe('true')
  })

  it('applies hover effects on mouse enter and leave', async () => {
    render(<TestComponent />)

    // Fast-forward the timer to trigger the enhancement
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement

    // Mouse enter
    await act(async () => {
      fireEvent.mouseEnter(image)
    })
    expect(image.style.transform).toContain('translateY(-5px)')
    expect(image.style.filter).toBe('brightness(1.05)')

    // Mouse leave
    await act(async () => {
      fireEvent.mouseLeave(image)
    })
    expect(image.style.transform).toContain('translateY(0)')
    expect(image.style.filter).toBe('brightness(1)')
  })

  it('adds role="button" and tabindex="0" to enhanced images', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement
    expect(image).toHaveAttribute('role', 'button')
    expect(image).toHaveAttribute('tabindex', '0')
  })

  it('adds aria-label with alt text to enhanced images', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement
    expect(image).toHaveAttribute(
      'aria-label',
      'accessibility.image.viewFullImage: Test 1',
    )
  })

  it('adds generic aria-label when image has no alt text', async () => {
    const NoAltComponent = () => {
      const contentRef = useRef<HTMLDivElement>(null)
      return (
        <div>
          <div className="blog-content" ref={contentRef}>
            <Image
              alt=""
              height={100}
              src="/no-alt.jpg"
              unoptimized
              width={100}
            />
          </div>
          <ImageEnhancer contentRef={contentRef} />
        </div>
      )
    }

    render(<NoAltComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByRole('button') as HTMLImageElement
    expect(image).toHaveAttribute('aria-label', 'accessibility.image.viewImage')
  })

  it('adds cursor pointer to enhanced images', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement
    expect(image.style.cursor).toBe('pointer')
  })

  it('opens modal on Enter key', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement

    await act(async () => {
      fireEvent.keyDown(image, { key: 'Enter' })
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('opens modal on Space key', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement

    await act(async () => {
      fireEvent.keyDown(image, { key: ' ' })
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not open modal on other keys', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement

    await act(async () => {
      fireEvent.keyDown(image, { key: 'a' })
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('skips images wrapped in anchor tags', async () => {
    const LinkedImageComponent = () => {
      const contentRef = useRef<HTMLDivElement>(null)
      return (
        <div>
          <div className="blog-content" ref={contentRef}>
            <a href="/some-link">
              <Image
                alt="Linked"
                height={100}
                src="/linked.jpg"
                unoptimized
                width={100}
              />
            </a>
            <Image
              alt="Standalone"
              height={100}
              src="/standalone.jpg"
              unoptimized
              width={100}
            />
          </div>
          <ImageEnhancer contentRef={contentRef} />
        </div>
      )
    }

    render(<LinkedImageComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    // Linked image should NOT be enhanced
    const linkedImage = screen.getByAltText('Linked') as HTMLImageElement
    expect(linkedImage).not.toHaveAttribute('role', 'button')
    expect(linkedImage.dataset.enhanced).toBeUndefined()

    // Standalone image SHOULD be enhanced
    const standaloneImage = screen.getByAltText(
      'Standalone',
    ) as HTMLImageElement
    expect(standaloneImage).toHaveAttribute('role', 'button')
    expect(standaloneImage.dataset.enhanced).toBe('true')
  })

  it('passes triggerElement to ImageModal', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement

    await act(async () => {
      fireEvent.click(image)
    })

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('data-trigger', 'IMG')
  })

  it('cleans up accessibility attributes on unmount', async () => {
    const { unmount } = render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test 1') as HTMLImageElement
    expect(image).toHaveAttribute('role', 'button')

    unmount()

    expect(image).not.toHaveAttribute('role')
    expect(image).not.toHaveAttribute('tabindex')
    expect(image).not.toHaveAttribute('aria-label')
    expect(image.style.cursor).toBe('')
    expect(image.dataset.enhanced).toBeUndefined()
  })
})
