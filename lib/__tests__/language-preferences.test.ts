import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hasConsent } from '@/lib/cookie-consent'
import { deleteCookie, getCookie, setCookie } from '@/lib/cookie-utils'
import {
  clearLanguagePreference,
  getDefaultLanguage,
  getLanguagePreference,
  saveLanguagePreference,
} from '@/lib/language-preferences'

// Mock the cookie consent check
vi.mock('@/lib/cookie-consent', () => ({
  hasConsent: vi.fn(() => true), // Default to having consent
}))

// Mock cookie utilities
vi.mock('@/lib/cookie-utils', () => ({
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  getCookie: vi.fn(() => null),
  getSecureAttribute: vi.fn(() => ''), // Default to no secure attribute (HTTP)
}))

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US',
})

describe('Language Preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getLanguagePreference', () => {
    it('should return null when no language cookie exists', () => {
      vi.mocked(getCookie).mockReturnValue(null)
      expect(getLanguagePreference()).toBeNull()
    })

    it('should return language from cookie', () => {
      vi.mocked(getCookie).mockReturnValue('sv')
      expect(getLanguagePreference()).toBe('sv')
    })

    it('should return null when preferences consent is not given', () => {
      vi.mocked(hasConsent).mockReturnValue(false)
      vi.mocked(getCookie).mockReturnValue('sv')

      expect(getLanguagePreference()).toBeNull()

      // Reset to default
      vi.mocked(hasConsent).mockReturnValue(true)
    })

    it('should handle URL encoded values', () => {
      vi.mocked(getCookie).mockReturnValue('en-US')
      expect(getLanguagePreference()).toBe('en-US')
    })

    it('should return null if reading cookie throws', () => {
      vi.mocked(getCookie).mockImplementationOnce(() => {
        throw new Error('cookie read failed')
      })

      expect(getLanguagePreference()).toBeNull()
    })
  })

  describe('saveLanguagePreference', () => {
    it('should save language preference when consent is given', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).toHaveBeenCalledWith('language', 'sv', {
        maxAge: 365 * 24 * 60 * 60,
      })
    })

    it('should not save when preferences consent is not given', () => {
      vi.mocked(hasConsent).mockReturnValue(false)
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).not.toHaveBeenCalled()

      // Reset to default
      vi.mocked(hasConsent).mockReturnValue(true)
    })

    it('should URL encode language values', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('en-US')

      expect(mockSetCookie).toHaveBeenCalledWith('language', 'en-US', {
        maxAge: 365 * 24 * 60 * 60,
      })
    })

    it('should include Secure attribute when served over HTTPS', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).toHaveBeenCalledWith('language', 'sv', {
        maxAge: 365 * 24 * 60 * 60,
      })
    })

    it('should not include Secure attribute when served over HTTP', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).toHaveBeenCalledWith('language', 'sv', {
        maxAge: 365 * 24 * 60 * 60,
      })
    })

    it('should handle save errors gracefully', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      vi.mocked(setCookie).mockImplementationOnce(() => {
        throw new Error('cookie write failed')
      })

      saveLanguagePreference('sv')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save language preference:',
        expect.any(Error),
      )
    })
  })

  describe('clearLanguagePreference', () => {
    it('should clear language preference cookie', () => {
      const mockDeleteCookie = vi.mocked(deleteCookie)

      clearLanguagePreference()

      expect(mockDeleteCookie).toHaveBeenCalledWith('language')
    })

    it('should include Secure attribute when clearing cookie over HTTPS', () => {
      const mockDeleteCookie = vi.mocked(deleteCookie)

      clearLanguagePreference()

      expect(mockDeleteCookie).toHaveBeenCalledWith('language')
    })

    it('should not include Secure attribute when clearing cookie over HTTP', () => {
      const mockDeleteCookie = vi.mocked(deleteCookie)

      clearLanguagePreference()

      expect(mockDeleteCookie).toHaveBeenCalledWith('language')
    })

    it('should handle clear errors gracefully', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      vi.mocked(deleteCookie).mockImplementationOnce(() => {
        throw new Error('cookie delete failed')
      })

      clearLanguagePreference()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to clear language preference:',
        expect.any(Error),
      )
    })
  })

  describe('getDefaultLanguage', () => {
    it('should return "sv" for Swedish browser language', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'sv-SE',
      })
      expect(getDefaultLanguage()).toBe('sv')
    })

    it('should return "en" for English browser language', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'en-US',
      })
      expect(getDefaultLanguage()).toBe('en')
    })

    it('should return "en" for unsupported languages', () => {
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'de-DE',
      })
      expect(getDefaultLanguage()).toBe('en')
    })

    it('should return "en" as fallback when navigator is unavailable', () => {
      const originalNavigator = global.navigator
      // @ts-expect-error - Testing edge case
      delete global.navigator

      expect(getDefaultLanguage()).toBe('en')

      global.navigator = originalNavigator
    })

    it('should use navigator.languages when navigator.language is empty', () => {
      const originalLanguage = navigator.language
      const originalLanguages = navigator.languages

      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: '',
      })
      Object.defineProperty(navigator, 'languages', {
        writable: true,
        value: ['sv-FI'],
      })

      try {
        expect(getDefaultLanguage()).toBe('sv')
      } finally {
        Object.defineProperty(navigator, 'language', {
          writable: true,
          value: originalLanguage,
        })
        Object.defineProperty(navigator, 'languages', {
          writable: true,
          value: originalLanguages,
        })
      }
    })

    it('should return fallback when navigator access throws', () => {
      const originalNavigator = global.navigator
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        get: () => {
          throw new Error('navigator unavailable')
        },
      })

      try {
        expect(getDefaultLanguage()).toBe('en')
      } finally {
        Object.defineProperty(global, 'navigator', {
          configurable: true,
          value: originalNavigator,
        })
      }
    })
  })
})
