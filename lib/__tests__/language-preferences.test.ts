import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hasConsent } from '../cookie-consent'
import { setCookie, deleteCookie, getCookie } from '../cookie-utils'
import {
  clearLanguagePreference,
  getDefaultLanguage,
  getLanguagePreference,
  saveLanguagePreference,
} from '../language-preferences'

// Mock the cookie consent check
vi.mock('../cookie-consent', () => ({
  hasConsent: vi.fn(() => true), // Default to having consent
}))

// Mock cookie utilities
vi.mock('../cookie-utils', () => ({
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
  })

  describe('saveLanguagePreference', () => {
    it('should save language preference when consent is given', () => {
      const mockSetCookie = vi.mocked(setCookie)
      
      saveLanguagePreference('sv')
      
      expect(mockSetCookie).toHaveBeenCalledWith(
        'language',
        'sv',
        { maxAge: 365 * 24 * 60 * 60 }
      )
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
      
      expect(mockSetCookie).toHaveBeenCalledWith(
        'language',
        'en-US',
        { maxAge: 365 * 24 * 60 * 60 }
      )
    })

    it('should include Secure attribute when served over HTTPS', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).toHaveBeenCalledWith(
        'language',
        'sv',
        { maxAge: 365 * 24 * 60 * 60 }
      )
    })

    it('should not include Secure attribute when served over HTTP', () => {
      const mockSetCookie = vi.mocked(setCookie)

      saveLanguagePreference('sv')

      expect(mockSetCookie).toHaveBeenCalledWith(
        'language',
        'sv',
        { maxAge: 365 * 24 * 60 * 60 }
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
  })
})
