import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CopyButton from '../CopyButton'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockWriteText = vi.fn<() => Promise<void>>()

// mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('CopyButton', () => {
  const text = 'hello world'

  beforeEach(() => {
    vi.clearAllMocks()
    mockWriteText.mockResolvedValue(undefined)
  })

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
    render(<CopyButton text={text} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      expect(button).toHaveAttribute('title', 'copied')
    })

    await waitFor(
      () => {
        expect(button).toHaveAttribute('title', 'copyToClipboard')
      },
      { timeout: 3000 },
    )
  })

  it('falls back to document.execCommand when clipboard API fails', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('clipboard unavailable'))
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const originalExecCommand = document.execCommand
    if (!('execCommand' in document)) {
      Object.defineProperty(document, 'execCommand', {
        value: () => false,
        configurable: true,
        writable: true,
      })
    }
    const execSpy = vi
      .spyOn(document, 'execCommand')
      .mockImplementation(() => true)

    try {
      render(<CopyButton text={text} />)
      const button = screen.getByRole('button')

      fireEvent.click(button)

      await waitFor(() => {
        expect(execSpy).toHaveBeenCalledWith('copy')
        expect(button).toHaveAttribute('title', 'copied')
      })
    } finally {
      execSpy.mockRestore()
      if (originalExecCommand === undefined) {
        Reflect.deleteProperty(document, 'execCommand')
      }
      consoleErrorSpy.mockRestore()
    }
  })

  it('logs fallback errors when both copy methods fail', async () => {
    const outerErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockWriteText.mockRejectedValueOnce(new Error('clipboard unavailable'))

    render(<CopyButton text={text} />)

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation(() => {
        throw new Error('cannot create textarea')
      })

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(outerErrorSpy).toHaveBeenCalledWith(
        'Failed to copy text: ',
        expect.any(Error),
      )
      expect(outerErrorSpy).toHaveBeenCalledWith(
        'Fallback copy failed: ',
        expect.any(Error),
      )
    })

    createElementSpy.mockRestore()
    outerErrorSpy.mockRestore()
  })
})
