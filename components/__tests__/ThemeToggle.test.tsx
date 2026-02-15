import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ThemeToggle from '../ThemeToggle'

const setThemeMock = vi.fn()

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
}))

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

    const lightButton = screen.getByLabelText('switchToTheme:{"theme":"light"}')
    const darkButton = screen.getByLabelText('switchToTheme:{"theme":"dark"}')
    const systemButton = screen.getByLabelText(
      'switchToTheme:{"theme":"system"}'
    )

    expect(lightButton).toBeInTheDocument()
    expect(darkButton).toBeInTheDocument()
    expect(systemButton).toBeInTheDocument()
  })

  it('calls setTheme with correct value on button click', () => {
    render(<ThemeToggle />)

    const darkButton = screen.getByLabelText('switchToTheme:{"theme":"dark"}')
    fireEvent.click(darkButton)
    expect(setThemeMock).toHaveBeenCalledWith('dark')

    const systemButton = screen.getByLabelText(
      'switchToTheme:{"theme":"system"}'
    )
    fireEvent.click(systemButton)
    expect(setThemeMock).toHaveBeenCalledWith('system')

    const lightButton = screen.getByLabelText('switchToTheme:{"theme":"light"}')
    fireEvent.click(lightButton)
    expect(setThemeMock).toHaveBeenCalledWith('light')
  })
})
