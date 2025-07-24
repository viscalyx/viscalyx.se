import { beforeEach, describe, expect, it, vi } from 'vitest'
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

// Mock document.cookie
const cookieMock = {
  value: '',
  get cookie() {
    return this.value
  },
  set cookie(val: string) {
    this.value = val
  },
}

Object.defineProperty(document, 'cookie', {
  get() {
    return cookieMock.cookie
  },
  set(val: string) {
    cookieMock.cookie = val
  },
})

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US',
})

describe('Language Preferences', () => {
  beforeEach(() => {
    cookieMock.value = ''
    vi.clearAllMocks()
  })

  describe('getLanguagePreference', () => {
    it('should return null when no language cookie exists', () => {
      expect(getLanguagePreference()).toBeNull()
    })

    it('should return language from cookie', () => {
      cookieMock.value = 'language=sv'
      expect(getLanguagePreference()).toBe('sv')
    })

    it('should return null when preferences consent is not given', async () => {
      const { hasConsent } = await import('../cookie-consent')
      vi.mocked(hasConsent).mockReturnValue(false)

      cookieMock.value = 'language=sv'
      expect(getLanguagePreference()).toBeNull()
    })

    it('should handle URL encoded values', () => {
      cookieMock.value = 'language=en%2DUS'
      expect(getLanguagePreference()).toBe('en-US')
    })
  })

  describe('saveLanguagePreference', () => {
    it('should save language preference when consent is given', () => {
      saveLanguagePreference('sv')
      expect(document.cookie).toContain('language=sv')
    })

    it('should not save when preferences consent is not given', async () => {
      const { hasConsent } = await import('../cookie-consent')
      vi.mocked(hasConsent).mockReturnValue(false)

      saveLanguagePreference('sv')
      expect(document.cookie).not.toContain('language=sv')
    })

    it('should URL encode language values', () => {
      saveLanguagePreference('en-US')
      expect(document.cookie).toContain('language=en%2DUS')
    })
  })

  describe('clearLanguagePreference', () => {
    it('should clear language preference cookie', () => {
      cookieMock.value = 'language=sv'
      clearLanguagePreference()
      expect(document.cookie).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
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
