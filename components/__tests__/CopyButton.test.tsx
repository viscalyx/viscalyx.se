import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
})
