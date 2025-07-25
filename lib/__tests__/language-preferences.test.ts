import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hasConsent } from '../cookie-consent'
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

// Mock document.cookie with proper cookie parsing and storage
const cookieMock = {
  cookies: new Map<string, string>(),
  lastSet: '', // Track what was set for assertions

  get cookie() {
    // Convert stored cookies back to cookie string format
    const cookieStrings = Array.from(this.cookies.entries()).map(
      ([name, value]) => `${name}=${value}`
    )
    return cookieStrings.join('; ')
  },

  set cookie(val: string) {
    this.lastSet = val // Store the actual set value for testing

    // Parse the cookie string to extract name, value, and options
    const [nameValuePair, ...options] = val.split(';').map(part => part.trim())
    const [name, value = ''] = nameValuePair.split('=')

    // Check if this is a cookie deletion (expires in the past)
    const isExpired = options.some(
      option =>
        option.includes('expires=Thu, 01 Jan 1970') ||
        option.includes('max-age=0') ||
        option.includes('max-age=-')
    )

    if (isExpired) {
      // Remove the cookie
      this.cookies.delete(name)
    } else {
      // Set/update the cookie
      this.cookies.set(name, value)
    }
  },

  reset() {
    this.cookies.clear()
    this.lastSet = ''
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
    cookieMock.reset()
    vi.clearAllMocks()
  })

  describe('getLanguagePreference', () => {
    it('should return null when no language cookie exists', () => {
      expect(getLanguagePreference()).toBeNull()
    })

    it('should return language from cookie', () => {
      cookieMock.cookies.set('language', 'sv')
      expect(getLanguagePreference()).toBe('sv')
    })

    it('should return null when preferences consent is not given', () => {
      vi.mocked(hasConsent).mockReturnValue(false)

      cookieMock.cookies.set('language', 'sv')
      expect(getLanguagePreference()).toBeNull()

      // Reset to default
      vi.mocked(hasConsent).mockReturnValue(true)
    })

    it('should handle URL encoded values', () => {
      cookieMock.cookies.set('language', 'en%2DUS')
      expect(getLanguagePreference()).toBe('en-US')
    })
  })

  describe('saveLanguagePreference', () => {
    it('should save language preference when consent is given', () => {
      saveLanguagePreference('sv')
      expect(document.cookie).toContain('language=sv')
    })

    it('should not save when preferences consent is not given', () => {
      vi.mocked(hasConsent).mockReturnValue(false)

      const initialCookie = document.cookie
      saveLanguagePreference('sv')
      expect(document.cookie).toBe(initialCookie)

      // Reset to default
      vi.mocked(hasConsent).mockReturnValue(true)
    })

    it('should URL encode language values', () => {
      saveLanguagePreference('en-US')
      expect(cookieMock.lastSet).toContain('language=en-US')
    })
  })

  describe('clearLanguagePreference', () => {
    it('should clear language preference cookie', () => {
      cookieMock.cookies.set('language', 'sv')
      clearLanguagePreference()
      expect(cookieMock.lastSet).toContain(
        'expires=Thu, 01 Jan 1970 00:00:00 GMT'
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
  })
})
