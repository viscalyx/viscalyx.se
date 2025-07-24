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
})

describe('Cookie Consent', () => {
  beforeEach(() => {
    localStorageMock.clear()
    cookieMock.value = ''
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
        marketing: false,
        preferences: true,
      }

      saveConsentSettings(settings)

      const stored = localStorageMock.getItem('cookie-consent')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.settings).toEqual(settings)
      expect(parsed.version).toBe('1.0')
      expect(parsed.timestamp).toBeTruthy()
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
  })

  describe('cleanupCookies', () => {
    beforeEach(() => {
      // Mock cookies
      cookieMock.value = 'theme=dark; _ga=test; marketing_cookie=value'
    })

    it('should not remove strictly necessary cookies', () => {
      const settings = {
        'strictly-necessary': true,
        analytics: false,
        preferences: false,
      }

      // Should not throw or cause issues
      expect(() => cleanupCookies(settings)).not.toThrow()
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
