import { fireEvent, render, screen } from '@testing-library/react'
import { Trash2 } from 'lucide-react'
import { vi } from 'vitest'
import ConfirmationModal from '../ConfirmationModal'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'closeAriaLabel' ? 'Close modal' : key,
}))

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Modal',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<ConfirmationModal {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to proceed?'),
    ).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.click(screen.getByText('Confirm'))
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button (X) is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.click(screen.getByLabelText('Close modal'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside the modal content', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('dialog'))
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('handles escape key press', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when confirmLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} confirmLoading={true} />)

    expect(screen.getByText('Cancel')).toBeDisabled()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled()
  })

  it('shows loading state in confirm button', () => {
    render(<ConfirmationModal {...defaultProps} confirmLoading={true} />)

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveTextContent('Confirm')
    expect(confirmButton.querySelector('.animate-spin')).toBeInTheDocument()
  })

  describe('variants', () => {
    it('applies danger variant styles', () => {
      render(<ConfirmationModal {...defaultProps} variant="danger" />)

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      expect(confirmButton).toHaveClass('bg-red-600')
    })

    it('applies warning variant styles', () => {
      render(<ConfirmationModal {...defaultProps} variant="warning" />)

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      expect(confirmButton).toHaveClass('bg-orange-600')
    })

    it('applies info variant styles', () => {
      render(<ConfirmationModal {...defaultProps} variant="info" />)

      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      expect(confirmButton).toHaveClass('bg-blue-600')
    })
  })

  it('has proper accessibility attributes', () => {
    render(<ConfirmationModal {...defaultProps} />)

    const modal = screen.getByRole('dialog')
    const title = screen.getByText('Test Modal')
    const description = screen.getByText('Are you sure you want to proceed?')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby')
    expect(modal).toHaveAttribute('aria-describedby')
    expect(title).toHaveAttribute('id', modal.getAttribute('aria-labelledby'))
    expect(description).toHaveAttribute(
      'id',
      modal.getAttribute('aria-describedby'),
    )
  })

  it('renders with custom confirm icon when provided', () => {
    const customIcon = (
      <Trash2 className="w-4 h-4" data-testid="custom-confirm-icon" />
    )
    render(<ConfirmationModal {...defaultProps} confirmIcon={customIcon} />)

    expect(screen.getByTestId('custom-confirm-icon')).toBeInTheDocument()
  })

  it('renders without icon when confirmIcon is not provided', () => {
    render(<ConfirmationModal {...defaultProps} />)

    // The confirm button should still be present but without the icon
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.queryByTestId('custom-confirm-icon')).not.toBeInTheDocument()
  })
})
