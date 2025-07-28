import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ImageModal from '../ImageModal'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ImageModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    imageSrc: '/test-image.jpg',
    imageAlt: 'Test image alt text',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<ImageModal {...defaultProps} />)

    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByAltText('Test image alt text')).toBeInTheDocument()
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ImageModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<ImageModal {...defaultProps} />)

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<ImageModal {...defaultProps} />)

    // The backdrop is the outermost div with the click handler
    const backdrop =
      screen.getByRole('img').closest('[data-testid]') ||
      screen.getByRole('img').parentElement?.parentElement?.parentElement

    if (backdrop) {
      fireEvent.click(backdrop)
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    }
  })

  it('does not call onClose when image is clicked', () => {
    render(<ImageModal {...defaultProps} />)

    const image = screen.getByRole('img')
    fireEvent.click(image)

    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('displays image caption when alt text is provided', () => {
    render(<ImageModal {...defaultProps} />)

    expect(screen.getByText('Test image alt text')).toBeInTheDocument()
  })

  it('handles escape key press', () => {
    render(<ImageModal {...defaultProps} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('sets body overflow hidden when modal is open', () => {
    const originalOverflow = document.body.style.overflow

    render(<ImageModal {...defaultProps} />)

    expect(document.body.style.overflow).toBe('hidden')

    // Cleanup
    document.body.style.overflow = originalOverflow
  })
})
