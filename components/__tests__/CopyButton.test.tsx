import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import CopyButton from '../CopyButton'

// mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

describe('CopyButton', () => {
  const text = 'hello world'

  it('renders with a copy icon', () => {
    render(<CopyButton text={text} />)
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('copies text to clipboard on click', async () => {
    render(<CopyButton text={text} />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })
  })

  it('shows "Copied!" state after click', async () => {
    render(<CopyButton text={text} />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
    })
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'Copied!')
    expect(button).toHaveAttribute('aria-label', 'Copied to clipboard')
  })

  it('resets to original state after 2 seconds', async () => {
    jest.useFakeTimers()
    render(<CopyButton text={text} />)
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
    // Fast-forward 2 seconds inside act
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Copy to clipboard')
      expect(button).toHaveAttribute('aria-label', 'Copy code to clipboard')
    })
    jest.useRealTimers()
  })
})
