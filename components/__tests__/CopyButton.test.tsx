import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CopyButton from '../CopyButton'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
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
    expect(button).toHaveAttribute('title', 'copied')
    expect(button).toHaveAttribute('aria-label', 'copiedToClipboard')
  })

  it('resets to original state after timeout', async () => {
    // Use real timers for this test since it involves React state updates
    render(<CopyButton text={text} />)

    const button = screen.getByRole('button')

    // Click the button
    fireEvent.click(button)

    // Wait for clipboard to be called and verify copied state
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      expect(button).toHaveAttribute('title', 'copied')
    })

    // Wait for the timeout to reset the state (2 seconds + buffer)
    await waitFor(
      () => {
        expect(button).toHaveAttribute('title', 'copyToClipboard')
      },
      { timeout: 3000 }
    )
  })
})
