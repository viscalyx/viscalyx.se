import { act, fireEvent, render, screen } from '@testing-library/react'
import Image from 'next/image'
import { useRef } from 'react'
import { vi } from 'vitest'
import ImageEnhancer from '../ImageEnhancer'

// Mock next-intl with a stable translator reference (matches production behavior)
vi.mock('next-intl', () => {
  const translator = (key: string, params?: Record<string, string>) => {
    if (params?.alt) return `${key}: ${params.alt}`
    return key
  }
  return { useTranslations: () => translator }
})

// Do NOT mock ImageModal — use the real component for integration tests

// Test component that provides a ref with blog content
const TestComponent = ({
  images,
}: {
  images?: Array<{ src: string; alt: string }>
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const defaultImages = images || [
    { src: '/test1.jpg', alt: 'Test Image 1' },
    { src: '/test2.jpg', alt: 'Test Image 2' },
  ]

  return (
    <div>
      <button data-testid="outside-button" type="button">
        Outside
      </button>
      <div className="blog-content" ref={contentRef}>
        {defaultImages.map(img => (
          <Image
            alt={img.alt}
            height={100}
            key={img.src}
            src={img.src}
            unoptimized
            width={100}
          />
        ))}
      </div>
      <ImageEnhancer contentRef={contentRef} />
    </div>
  )
}

describe('ImageEnhancer + ImageModal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens a dialog with correct aria attributes when image is clicked', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test Image 1')

    await act(async () => {
      fireEvent.click(image)
    })

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Test Image 1')
  })

  it('opens dialog via Enter key and focuses close button', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test Image 1') as HTMLImageElement

    await act(async () => {
      fireEvent.keyDown(image, { key: 'Enter' })
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()
  })

  it('opens dialog via Space key and focuses close button', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test Image 1') as HTMLImageElement

    await act(async () => {
      fireEvent.keyDown(image, { key: ' ' })
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()
  })

  it('traps focus within modal and closes with Escape', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test Image 1') as HTMLImageElement

    await act(async () => {
      fireEvent.click(image)
    })

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()

    // Tab should be trapped
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Tab' })
    })
    expect(closeButton).toHaveFocus()

    // Escape should close
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('restores focus to the clicked image after closing modal', async () => {
    render(<TestComponent />)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const image = screen.getByAltText('Test Image 1') as HTMLImageElement

    await act(async () => {
      fireEvent.click(image)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Close with Escape
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(image).toHaveFocus()
  })
})
