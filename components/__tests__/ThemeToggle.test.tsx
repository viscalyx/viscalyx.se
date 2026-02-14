import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ThemeToggle from '../ThemeToggle'

const setThemeMock = vi.fn()

// Mock theme context
vi.mock('@/lib/theme-context', () => ({
  useTheme: () => ({ theme: 'light', setTheme: setThemeMock }),
}))

describe('ThemeToggle component', () => {
  beforeEach(() => {
    setThemeMock.mockClear()
  })

  it('renders three theme buttons with correct aria-labels', () => {
    render(<ThemeToggle />)

    const lightButton = screen.getByLabelText('Switch to Light theme')
    const darkButton = screen.getByLabelText('Switch to Dark theme')
    const systemButton = screen.getByLabelText('Switch to System theme')

    expect(lightButton).toBeInTheDocument()
    expect(darkButton).toBeInTheDocument()
    expect(systemButton).toBeInTheDocument()
  })

  it('calls setTheme with correct value on button click', () => {
    render(<ThemeToggle />)

    const darkButton = screen.getByLabelText('Switch to Dark theme')
    fireEvent.click(darkButton)
    expect(setThemeMock).toHaveBeenCalledWith('dark')

    const systemButton = screen.getByLabelText('Switch to System theme')
    fireEvent.click(systemButton)
    expect(setThemeMock).toHaveBeenCalledWith('system')

    const lightButton = screen.getByLabelText('Switch to Light theme')
    fireEvent.click(lightButton)
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })
})
