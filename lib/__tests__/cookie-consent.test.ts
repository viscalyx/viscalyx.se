import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanupCookies,
  defaultConsentSettings,
  getConsentSettings,
  hasConsent,
  hasConsentChoice,
  resetConsent,
  saveConsentSettings,
} from '../cookie-consent'

// Don't mock cookie-utils, so we test the actual integration

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Mock document.cookie with operation tracking
const cookieMock = {
  value: '',
  operations: [] as string[], // Track all cookie operations
  get cookie() {
    return this.value
  },
  set cookie(val: string) {
    this.operations.push(val) // Capture all cookie writes
    this.value = val
  },
  reset() {
    this.value = ''
    this.operations = []
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(document, 'cookie', {
  get() {
    return cookieMock.cookie
  },
  set(val: string) {
    cookieMock.cookie = val
  },
  configurable: true,
})

describe('Cookie Consent', () => {
  beforeEach(() => {
    localStorageMock.clear()
    cookieMock.reset()
    vi.clearAllMocks()
  })

  describe('getConsentSettings', () => {
    it('should return null when no consent is stored', () => {
      expect(getConsentSettings()).toBeNull()
    })

    it('should return stored consent settings', () => {
      const settings = {
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      }

      const data = {
        version: '1.0',
        settings,
        timestamp: new Date().toISOString(),
      }

      localStorageMock.setItem('cookie-consent', JSON.stringify(data))

      expect(getConsentSettings()).toEqual(settings)
    })

    it('should return null for invalid JSON', () => {
      localStorageMock.setItem('cookie-consent', 'invalid-json')
      expect(getConsentSettings()).toBeNull()
    })

    it('should return null for wrong version', () => {
      const data = {
        version: '2.0',
        settings: defaultConsentSettings,
        timestamp: new Date().toISOString(),
      }

      localStorageMock.setItem('cookie-consent', JSON.stringify(data))
      expect(getConsentSettings()).toBeNull()
    })
  })

  describe('saveConsentSettings', () => {
    it('should save consent settings to localStorage', () => {
      const settings = {
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      }

      saveConsentSettings(settings)

      const stored = localStorageMock.getItem('cookie-consent')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.settings).toEqual(settings)
      expect(parsed.version).toBe('1.0')
      expect(parsed.timestamp).toBeTruthy()

      // Verify that the consent cookie is also set
      expect(document.cookie).toContain('cookie-consent=')

      // Verify the cookie contains the expected data structure
      const cookieMatch = document.cookie.match(/cookie-consent=([^;]+)/)
      expect(cookieMatch).toBeTruthy()

      const cookieData = JSON.parse(decodeURIComponent(cookieMatch![1]))
      expect(cookieData.settings).toEqual(settings)
      expect(cookieData.version).toBe('1.0')
      expect(cookieData.timestamp).toBeTruthy()
    })

    it('should include Secure attribute when served over HTTPS', () => {
      // Mock HTTPS location
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com',
        },
        writable: true,
      })

      const settings = {
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      }

      saveConsentSettings(settings)

      // Check if the cookie operation included the Secure attribute
      const lastCookieOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastCookieOperation).toContain('Secure')
      expect(lastCookieOperation).toContain('SameSite=Lax')
    })

    it('should not include Secure attribute when served over HTTP', () => {
      // Mock HTTP location
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'http:',
          hostname: 'localhost',
        },
        writable: true,
      })

      const settings = {
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      }

      saveConsentSettings(settings)

      // Check if the cookie operation did not include the Secure attribute
      const lastCookieOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastCookieOperation).not.toContain('Secure')
      expect(lastCookieOperation).toContain('SameSite=Lax')
    })
  })

  describe('hasConsent', () => {
    it('should always return true for strictly-necessary cookies', () => {
      expect(hasConsent('strictly-necessary')).toBe(true)
    })

    it('should return false when no consent is stored', () => {
      expect(hasConsent('analytics')).toBe(false)
      expect(hasConsent('preferences')).toBe(false)
    })

    it('should return correct consent status', () => {
      const settings = {
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      }

      saveConsentSettings(settings)

      expect(hasConsent('analytics')).toBe(true)
      expect(hasConsent('preferences')).toBe(true)
    })
  })

  describe('hasConsentChoice', () => {
    it('should return false when no consent is stored', () => {
      expect(hasConsentChoice()).toBe(false)
    })

    it('should return true when consent is stored', () => {
      saveConsentSettings(defaultConsentSettings)
      expect(hasConsentChoice()).toBe(true)
    })
  })

  describe('resetConsent', () => {
    it('should clear stored consent', () => {
      saveConsentSettings(defaultConsentSettings)
      expect(hasConsentChoice()).toBe(true)

      resetConsent()
      expect(hasConsentChoice()).toBe(false)
    })

    it('should remove localStorage and cookies after reset', () => {
      // Setup: Save consent settings
      const consentSettings = {
        'strictly-necessary': true,
        analytics: true,
        preferences: true,
      }
      saveConsentSettings(consentSettings)

      // Set up cookies that should be cleaned during reset
      cookieMock.value =
        'cookie-consent=test; theme=dark; language=en; session=123'

      // Verify initial state - consent is stored
      expect(localStorageMock.getItem('cookie-consent')).not.toBeNull()
      expect(hasConsentChoice()).toBe(true)
      expect(cookieMock.value).toContain('cookie-consent=test')

      // Clear previous operations to track only resetConsent operations
      cookieMock.operations = []

      // Act: Reset consent
      resetConsent()

      // Assert: Verify localStorage is cleared
      expect(localStorageMock.getItem('cookie-consent')).toBeNull()

      // Assert: Verify consent choice is false
      expect(hasConsentChoice()).toBe(false)

      // Assert: Verify getConsentSettings returns null after reset
      expect(getConsentSettings()).toBeNull()

      // Assert: Verify cookie deletion operations were performed
      expect(cookieMock.operations.length).toBeGreaterThan(0)

      // Assert: Verify consent cookie deletion was attempted
      const consentCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('cookie-consent=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(consentCookieDeletion).toBeDefined()

      // Assert: Verify preferences cookies are cleaned up (language cookie should be deleted since preferences=false in defaultConsentSettings)
      const languageCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('language=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(languageCookieDeletion).toBeDefined()
    })
  })

  describe('cleanupCookies', () => {
    beforeEach(() => {
      // Clear any previous cookie operations
      cookieMock.reset()
    })

    it('should not remove strictly necessary cookies', () => {
      // Setup: Add strictly necessary and other cookies
      cookieMock.value =
        'cookie-consent=test; session=abc123; theme=dark; cf-analytics=xyz'

      const settings = {
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      }

      // Clear operations to track only cleanupCookies operations
      cookieMock.operations = []

      // Act: Clean up cookies
      cleanupCookies(settings)

      // Assert: Should not throw
      expect(() => cleanupCookies(settings)).not.toThrow()

      // Assert: Strictly necessary cookies should not be deleted
      const sessionCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('session=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(sessionCookieDeletion).toBeUndefined()

      const consentCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('cookie-consent=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(consentCookieDeletion).toBeUndefined()
    })

    it('should remove analytics cookies when analytics consent is false', () => {
      // Setup: Add analytics and other cookies
      cookieMock.value =
        'cf-analytics=test123; blog-reading-analytics=data456; theme=dark; session=abc'

      const settings = {
        'strictly-necessary': true,
        analytics: false, // Analytics disabled
        preferences: true,
      }

      // Clear operations to track only cleanupCookies operations
      cookieMock.operations = []

      // Act: Clean up cookies
      cleanupCookies(settings)

      // Assert: Analytics cookies should be deleted
      const cfAnalyticsDeletion = cookieMock.operations.find(
        op =>
          op.includes('cf-analytics=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(cfAnalyticsDeletion).toBeDefined()

      const blogAnalyticsDeletion = cookieMock.operations.find(
        op =>
          op.includes('blog-reading-analytics=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(blogAnalyticsDeletion).toBeDefined()

      // Assert: Preference cookies should not be deleted (preferences=true)
      const themeCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('theme=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(themeCookieDeletion).toBeUndefined()
    })

    it('should remove preference cookies when preferences consent is false', () => {
      // Setup: Add preference and other cookies
      cookieMock.value =
        'theme=dark; language=en; cf-analytics=test; session=abc'

      const settings = {
        'strictly-necessary': true,
        analytics: true, // Analytics enabled
        preferences: false, // Preferences disabled
      }

      // Clear operations to track only cleanupCookies operations
      cookieMock.operations = []

      // Act: Clean up cookies
      cleanupCookies(settings)

      // Assert: Preference cookies should be deleted
      const themeCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('theme=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(themeCookieDeletion).toBeDefined()

      const languageCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('language=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(languageCookieDeletion).toBeDefined()

      // Assert: Analytics cookies should not be deleted (analytics=true)
      const analyticsCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('cf-analytics=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(analyticsCookieDeletion).toBeUndefined()
    })

    it('should preserve cookies when their category consent is true', () => {
      // Setup: Add cookies from all categories
      cookieMock.value =
        'theme=dark; language=en; cf-analytics=test; blog-reading-analytics=data; session=abc; cookie-consent=settings'

      const settings = {
        'strictly-necessary': true,
        analytics: true, // Analytics enabled
        preferences: true, // Preferences enabled
      }

      // Clear operations to track only cleanupCookies operations
      cookieMock.operations = []

      // Act: Clean up cookies
      cleanupCookies(settings)

      // Assert: No cookies should be deleted when all consent is given
      const themeCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('theme=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(themeCookieDeletion).toBeUndefined()

      const analyticsCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('cf-analytics=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(analyticsCookieDeletion).toBeUndefined()

      const languageCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('language=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(languageCookieDeletion).toBeUndefined()
    })

    it('should handle unknown cookies by not deleting them', () => {
      // Setup: Add unknown cookies not in the registry
      cookieMock.value =
        'unknown-cookie=value; another-unknown=test; theme=dark'

      const settings = {
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      }

      // Clear operations to track only cleanupCookies operations
      cookieMock.operations = []

      // Act: Clean up cookies
      cleanupCookies(settings)

      // Assert: Unknown cookies should not be deleted
      const unknownCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('unknown-cookie=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(unknownCookieDeletion).toBeUndefined()

      const anotherUnknownDeletion = cookieMock.operations.find(
        op =>
          op.includes('another-unknown=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(anotherUnknownDeletion).toBeUndefined()

      // Assert: Known preference cookies should be deleted (preferences=false)
      const themeCookieDeletion = cookieMock.operations.find(
        op =>
          op.includes('theme=;') &&
          op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      )
      expect(themeCookieDeletion).toBeDefined()
    })
  })

  describe('defaultConsentSettings', () => {
    it('should have strictly-necessary enabled and others disabled', () => {
      expect(defaultConsentSettings).toEqual({
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      })
    })
  })
})
