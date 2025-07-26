import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { vi } from 'vitest'
import ImageEnhancer from '../ImageEnhancer'

interface MockImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
}

// Mock the ImageModal component
vi.mock('../ImageModal', () => ({
  default: ({ isOpen, onClose, imageSrc, imageAlt }: MockImageModalProps) =>
    isOpen ? (
      <div data-testid="image-modal">
        <button type="button" onClick={onClose}>
          Close
        </button>
        <img src={imageSrc} alt={imageAlt} />
        <span>{imageAlt}</span>
      </div>
    ) : null,
}))

// Test component that provides a ref with blog content
const TestComponent = ({ children }: { children?: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div ref={contentRef} className="blog-content">
        <img src="/test1.jpg" alt="Test 1" />
        <img src="/test2.jpg" alt="Test 2" />
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

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
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

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()

    // Close modal
    const closeButton = screen.getByText('Close')
    await act(async () => {
      fireEvent.click(closeButton)
    })

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument()
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

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
    expect(screen.getByText('Test 1')).toBeInTheDocument()

    // Close modal
    await act(async () => {
      fireEvent.click(screen.getByText('Close'))
    })

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument()

    // Click second image
    const image2 = screen.getByAltText('Test 2')
    await act(async () => {
      fireEvent.click(image2)
    })

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
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
})
