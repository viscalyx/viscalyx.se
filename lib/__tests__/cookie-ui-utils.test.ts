import { describe, expect, it } from 'vitest'
import { getCookiesForCategory } from '@/lib/cookie-ui-utils'

// The function uses the real cookieRegistry from cookie-consent
// We test against the actual registry to ensure correct filtering

describe('getCookiesForCategory', () => {
  it('returns cookies matching the given category', () => {
    const result = getCookiesForCategory('strictly-necessary')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(cookie => {
      expect(cookie.category).toBe('strictly-necessary')
    })
  })

  it('returns cookies for analytics category', () => {
    const result = getCookiesForCategory('analytics')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(cookie => {
      expect(cookie.category).toBe('analytics')
    })
  })

  it('returns cookies for preferences category', () => {
    const result = getCookiesForCategory('preferences')
    expect(result.length).toBeGreaterThan(0)
    result.forEach(cookie => {
      expect(cookie.category).toBe('preferences')
    })
  })

  it('returns each cookie with required properties', () => {
    const result = getCookiesForCategory('strictly-necessary')
    result.forEach(cookie => {
      expect(cookie).toHaveProperty('name')
      expect(cookie).toHaveProperty('category')
      expect(cookie).toHaveProperty('purposeKey')
      expect(cookie).toHaveProperty('durationKey')
    })
  })
})
