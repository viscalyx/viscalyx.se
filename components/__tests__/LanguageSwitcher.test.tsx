import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import LanguageSwitcher from '../LanguageSwitcher'

// Mock next-intl translations and locale
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next/navigation
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/en/test',
}))

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

    const swedishButton = screen.getByRole('button', { name: /Swedish/i })
    fireEvent.click(swedishButton)
    expect(pushMock).toHaveBeenCalledWith('/sv/test')
  })
})
