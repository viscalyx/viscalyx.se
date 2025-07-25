import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  deleteCookie,
  getCookie,
  getSecureAttribute,
  setCookie,
} from '../cookie-utils'

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

Object.defineProperty(document, 'cookie', {
  get() {
    return cookieMock.cookie
  },
  set(val: string) {
    cookieMock.cookie = val
  },
  configurable: true,
})

describe('Cookie Utils', () => {
  beforeEach(() => {
    cookieMock.reset()
    vi.clearAllMocks()
  })

  describe('getSecureAttribute', () => {
    it('should return "; Secure" when served over HTTPS', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com',
        },
        writable: true,
      })

      expect(getSecureAttribute()).toBe('; Secure')
    })

    it('should return empty string when served over HTTP', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'http:',
          hostname: 'localhost',
        },
        writable: true,
      })

      expect(getSecureAttribute()).toBe('')
    })

    it('should return empty string on server-side (no window)', () => {
      const originalWindow = global.window
      // @ts-expect-error - Testing server-side scenario
      delete global.window

      expect(getSecureAttribute()).toBe('')

      global.window = originalWindow
    })
  })

  describe('setCookie', () => {
    it('should set a cookie with default options', () => {
      setCookie('test', 'value')

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain('test=value')
      expect(lastOperation).toContain('path=/')
      expect(lastOperation).toContain('SameSite=Lax')
    })

    it('should URL encode cookie values', () => {
      setCookie('test', 'special value with spaces')

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain('test=special%20value%20with%20spaces')
    })

    it('should include maxAge when specified', () => {
      setCookie('test', 'value', { maxAge: 3600 })

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain('max-age=3600')
    })

    it('should include expires when specified', () => {
      const expires = 'Thu, 01 Jan 2025 00:00:00 GMT'
      setCookie('test', 'value', { expires })

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain(`expires=${expires}`)
    })

    it('should include domain when specified', () => {
      setCookie('test', 'value', { domain: '.example.com' })

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain('domain=.example.com')
    })

    it('should include Secure attribute over HTTPS', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com',
        },
        writable: true,
      })

      setCookie('test', 'value')

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).toContain('Secure')
    })

    it('should not include Secure attribute over HTTP', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'http:',
          hostname: 'localhost',
        },
        writable: true,
      })

      setCookie('test', 'value')

      const lastOperation =
        cookieMock.operations[cookieMock.operations.length - 1]
      expect(lastOperation).not.toContain('Secure')
    })
  })

  describe('deleteCookie', () => {
    it('should delete a cookie by setting it to expire in the past', () => {
      deleteCookie('test')

      const operations = cookieMock.operations
      expect(
        operations.some(
          op =>
            op.includes('test=;') &&
            op.includes('expires=Thu, 01 Jan 1970 00:00:00 GMT')
        )
      ).toBe(true)
    })

    it('should include Secure attribute when deleting over HTTPS', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'https:',
          hostname: 'example.com',
        },
        writable: true,
      })

      deleteCookie('test')

      const operations = cookieMock.operations
      expect(operations.some(op => op.includes('Secure'))).toBe(true)
    })

    it('should not include Secure attribute when deleting over HTTP', () => {
      Object.defineProperty(window, 'location', {
        value: {
          protocol: 'http:',
          hostname: 'localhost',
        },
        writable: true,
      })

      deleteCookie('test')

      const operations = cookieMock.operations
      expect(operations.every(op => !op.includes('Secure'))).toBe(true)
    })

    it('should delete for specified domain', () => {
      deleteCookie('test', { domain: '.example.com' })

      const operations = cookieMock.operations
      expect(operations.some(op => op.includes('domain=.example.com'))).toBe(
        true
      )
    })
  })

  describe('getCookie', () => {
    it('should return null when cookie does not exist', () => {
      cookieMock.value = 'other=value'
      expect(getCookie('test')).toBeNull()
    })

    it('should return cookie value when it exists', () => {
      cookieMock.value = 'test=value; other=different'
      expect(getCookie('test')).toBe('value')
    })

    it('should URL decode cookie values', () => {
      cookieMock.value = 'test=value%20with%20spaces'
      expect(getCookie('test')).toBe('value with spaces')
    })

    it('should handle cookies with special characters', () => {
      cookieMock.value = 'test=value%3Dwith%3Dequals' // cSpell: disable-line
      expect(getCookie('test')).toBe('value=with=equals')
    })

    it('should return null on server-side (no window)', () => {
      const originalWindow = global.window
      // @ts-expect-error - Testing server-side scenario
      delete global.window

      expect(getCookie('test')).toBeNull()

      global.window = originalWindow
    })
  })
})
