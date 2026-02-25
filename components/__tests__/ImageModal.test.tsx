import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ImageModal from '@/components/ImageModal'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('ImageModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    imageSrc: '/test-image.jpg',
    imageAlt: 'Test image alt text',
    triggerElement: null as HTMLElement | null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<ImageModal {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByAltText('Test image alt text')).toBeInTheDocument()
    expect(
      screen.getByLabelText('accessibility.image.closeImagePreview'),
    ).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ImageModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<ImageModal {...defaultProps} />)

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    fireEvent.click(closeButton)

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<ImageModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
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

  it('has role="dialog" and aria-modal="true"', () => {
    render(<ImageModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-label from image alt text', () => {
    render(<ImageModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Test image alt text')
  })

  it('uses fallback aria-label when no alt text', () => {
    render(<ImageModal {...defaultProps} imageAlt="" />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute(
      'aria-label',
      'accessibility.image.imagePreview',
    )
  })

  it('focuses close button when modal opens', () => {
    render(<ImageModal {...defaultProps} />)

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()
  })

  it('traps Tab key within modal', () => {
    render(<ImageModal {...defaultProps} />)

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()

    // Tab should not move focus away from close button
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(closeButton).toHaveFocus()
  })

  it('traps Shift+Tab key within modal', () => {
    render(<ImageModal {...defaultProps} />)

    const closeButton = screen.getByLabelText(
      'accessibility.image.closeImagePreview',
    )
    expect(closeButton).toHaveFocus()

    // Shift+Tab should not move focus away
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(closeButton).toHaveFocus()
  })

  it('restores focus to trigger element on close', () => {
    // Create a trigger button in the DOM
    const triggerButton = document.createElement('button')
    triggerButton.textContent = 'Trigger'
    document.body.appendChild(triggerButton)
    triggerButton.focus()

    const { rerender } = render(
      <ImageModal {...defaultProps} triggerElement={triggerButton} />,
    )

    // Close the modal
    rerender(
      <ImageModal
        {...defaultProps}
        isOpen={false}
        triggerElement={triggerButton}
      />,
    )

    expect(triggerButton).toHaveFocus()

    // Cleanup
    document.body.removeChild(triggerButton)
  })

  it('restores focus to previously active element when no triggerElement', () => {
    // Create and focus a button before opening modal
    const activeButton = document.createElement('button')
    activeButton.textContent = 'Active'
    document.body.appendChild(activeButton)
    activeButton.focus()

    const { rerender } = render(
      <ImageModal {...defaultProps} triggerElement={null} />,
    )

    // Close the modal
    rerender(
      <ImageModal {...defaultProps} isOpen={false} triggerElement={null} />,
    )

    expect(activeButton).toHaveFocus()

    // Cleanup
    document.body.removeChild(activeButton)
  })
})
