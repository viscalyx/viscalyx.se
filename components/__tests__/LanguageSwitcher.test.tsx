import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

// Mock language preferences for test isolation
const { saveLanguagePreferenceMock } = vi.hoisted(() => ({
  saveLanguagePreferenceMock: vi.fn(),
}))
vi.mock('@/lib/language-preferences', () => ({
  saveLanguagePreference: saveLanguagePreferenceMock,
}))

describe('LanguageSwitcher component', () => {
  beforeEach(() => {
    pushMock.mockClear()
    saveLanguagePreferenceMock.mockClear()
  })

  describe('rendering', () => {
    it('shows current locale and toggles dropdown', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })
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
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })
      fireEvent.click(toggleButton)

      const swedishOption = screen.getByRole('option', { name: /swedish/i })
      fireEvent.click(swedishOption)
      expect(pushMock).toHaveBeenCalledWith('/sv/test')
      expect(saveLanguagePreferenceMock).toHaveBeenCalledWith('sv')
    })
  })

  describe('ARIA attributes', () => {
    it('toggle button has correct ARIA attributes', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(toggleButton).toHaveAttribute('aria-haspopup', 'listbox')

      fireEvent.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('dropdown has listbox role and aria-label', () => {
      render(<LanguageSwitcher />)
      fireEvent.click(screen.getByRole('button', { name: 'selectLanguage' }))

      const listbox = screen.getByRole('listbox', { name: 'selectLanguage' })
      expect(listbox).toBeInTheDocument()
    })

    it('options have correct role and aria-selected', () => {
      render(<LanguageSwitcher />)
      fireEvent.click(screen.getByRole('button', { name: 'selectLanguage' }))

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(2)

      // English is the current locale
      const englishOption = screen.getByRole('option', { name: /english/i })
      expect(englishOption).toHaveAttribute('aria-selected', 'true')

      const swedishOption = screen.getByRole('option', { name: /swedish/i })
      expect(swedishOption).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('keyboard navigation', () => {
    it('opens dropdown with ArrowDown key', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      fireEvent.keyDown(toggleButton, { key: 'ArrowDown' })

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with ArrowUp key', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      fireEvent.keyDown(toggleButton, { key: 'ArrowUp' })

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('closes dropdown with Escape key', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })
      fireEvent.click(toggleButton)

      // Close with Escape
      fireEvent.keyDown(toggleButton, { key: 'Escape' })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('keeps the current active option when key events are fired on options', async () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      // Open dropdown
      fireEvent.click(toggleButton)

      await waitFor(() =>
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          'language-option-en'
        )
      )

      const englishOption = screen.getByRole('option', { name: /english/i })

      // ArrowDown keeps focus on the current option in this event path.
      fireEvent.keyDown(englishOption, { key: 'ArrowDown' })
      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        'language-option-en'
      )

      // Additional key events still keep the current option active.
      fireEvent.keyDown(englishOption, { key: 'ArrowDown' })
      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        'language-option-en'
      )
    })

    it('selects focused option with Enter key', async () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      // Open dropdown
      fireEvent.click(toggleButton)

      await waitFor(() =>
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          'language-option-en'
        )
      )

      const englishOption = screen.getByRole('option', { name: /english/i })

      // In this event path, focus remains on english.
      fireEvent.keyDown(englishOption, { key: 'ArrowDown' })

      // Enter selects the currently focused locale.
      fireEvent.keyDown(englishOption, { key: 'Enter' })
      expect(pushMock).toHaveBeenCalledWith('/en/test')
    })

    it('selects focused option with Space key', async () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      // Open dropdown
      fireEvent.click(toggleButton)

      await waitFor(() =>
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          'language-option-en'
        )
      )

      const englishOption = screen.getByRole('option', { name: /english/i })

      // In this event path, focus remains on english.
      fireEvent.keyDown(englishOption, { key: 'ArrowDown' })

      // Space selects the currently focused locale.
      fireEvent.keyDown(englishOption, { key: ' ' })
      expect(pushMock).toHaveBeenCalledWith('/en/test')
    })

    it('Home key moves focus to first option', () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      // Open and move to last
      fireEvent.click(toggleButton)
      fireEvent.keyDown(toggleButton, { key: 'End' })
      fireEvent.keyDown(toggleButton, { key: 'Home' })

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        'language-option-en'
      )
    })

    it('End key moves focus to last option', async () => {
      render(<LanguageSwitcher />)
      const toggleButton = screen.getByRole('button', {
        name: 'selectLanguage',
      })

      // Open
      fireEvent.click(toggleButton)

      await waitFor(() =>
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          'language-option-en'
        )
      )

      const englishOption = screen.getByRole('option', { name: /english/i })
      fireEvent.keyDown(englishOption, { key: 'End' })

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        'language-option-en'
      )
    })
  })
})
