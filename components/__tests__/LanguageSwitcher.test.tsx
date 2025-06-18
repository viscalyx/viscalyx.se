import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import LanguageSwitcher from '../LanguageSwitcher'

// Mock next-intl translations and locale
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next/navigation
const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/en/test',
}))

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      button: ({
        children,
        initial,
        animate,
        exit,
        whileHover,
        whileTap,
        ...props
      }: any) => <button {...props}>{children}</button>,
      div: ({
        children,
        initial,
        animate,
        exit,
        whileHover,
        whileTap,
        ...props
      }: any) => <div {...props}>{children}</div>,
    },
  }
})

describe('LanguageSwitcher component', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('shows current locale and toggles dropdown', () => {
    render(<LanguageSwitcher />)
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toHaveTextContent('🇺🇸 EN')

    // Dropdown hidden initially
    expect(screen.queryByText('swedish')).not.toBeInTheDocument()

    // Open dropdown
    fireEvent.click(toggleButton)
    expect(screen.getByText('🇸🇪')).toBeInTheDocument()
    expect(screen.getByText('swedish')).toBeInTheDocument()
  })

  it('navigates to selected language path', () => {
    render(<LanguageSwitcher />)
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    const swedishButton = screen.getAllByRole('button')[2]
    fireEvent.click(swedishButton)
    expect(pushMock).toHaveBeenCalledWith('/sv/test')
  })
})
