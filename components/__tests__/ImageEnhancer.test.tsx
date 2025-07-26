import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { vi } from 'vitest'
import ImageEnhancer from '../ImageEnhancer'

// Mock the ImageModal component
vi.mock('../ImageModal', () => ({
  default: ({ isOpen, onClose, imageSrc, imageAlt }: any) =>
    isOpen ? (
      <div data-testid="image-modal">
        <button onClick={onClose}>Close</button>
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
        <img src="/test1.jpg" alt="Test image 1" />
        <img src="/test2.jpg" alt="Test image 2" />
        {children}
      </div>
      <ImageEnhancer contentRef={contentRef} />
    </div>
  )
}

describe('ImageEnhancer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<TestComponent />)
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test image 2')).toBeInTheDocument()
  })

  it('opens modal when image is clicked', () => {
    render(<TestComponent />)

    const image = screen.getByAltText('Test image 1')
    fireEvent.click(image)

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
    expect(screen.getByText('Test image 1')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<TestComponent />)

    // Open modal
    const image = screen.getByAltText('Test image 1')
    fireEvent.click(image)

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()

    // Close modal
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument()
  })

  it('shows correct image in modal when different images are clicked', () => {
    render(<TestComponent />)

    // Click first image
    const image1 = screen.getByAltText('Test image 1')
    fireEvent.click(image1)

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
    expect(screen.getByText('Test image 1')).toBeInTheDocument()

    // Close modal
    fireEvent.click(screen.getByText('Close'))

    // Click second image
    const image2 = screen.getByAltText('Test image 2')
    fireEvent.click(image2)

    expect(screen.getByTestId('image-modal')).toBeInTheDocument()
    expect(screen.getByText('Test image 2')).toBeInTheDocument()
  })

  it('marks images as enhanced to prevent duplicate handlers', () => {
    render(<TestComponent />)

    const image = screen.getByAltText('Test image 1') as HTMLImageElement
    expect(image.dataset.enhanced).toBe('true')
  })

  it('applies hover effects on mouse enter and leave', () => {
    render(<TestComponent />)

    const image = screen.getByAltText('Test image 1') as HTMLImageElement

    // Mouse enter
    fireEvent.mouseEnter(image)
    expect(image.style.transform).toContain('translateY(-5px)')
    expect(image.style.filter).toBe('brightness(1.05)')

    // Mouse leave
    fireEvent.mouseLeave(image)
    expect(image.style.transform).toContain('translateY(0)')
    expect(image.style.filter).toBe('brightness(1)')
  })
})
