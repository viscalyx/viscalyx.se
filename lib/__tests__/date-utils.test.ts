import { vi } from 'vitest'
import { getCurrentDateISO, isValidDate, normalizeDate } from '../date-utils'

describe('date-utils', () => {
  describe('isValidDate', () => {
    it('returns true for valid ISO date string', () => {
      expect(isValidDate('2024-12-10')).toBe(true)
    })

    it('returns true for valid date string with whitespace', () => {
      expect(isValidDate(' 2024-01-01 ')).toBe(true)
    })

    it('returns false for invalid date string', () => {
      expect(isValidDate('invalid-date')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidDate('')).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false)
    })

    it('returns false for whitespace string only', () => {
      expect(isValidDate('   ')).toBe(false)
    })
  })

  describe('normalizeDate', () => {
    it('returns the input when valid', () => {
      expect(normalizeDate('2024-12-10')).toBe('2024-12-10')
    })

    it('returns default fallback for invalid input', () => {
      expect(normalizeDate('invalid-date')).toBe('1970-01-01')
    })

    it('returns default fallback for undefined', () => {
      expect(normalizeDate(undefined)).toBe('1970-01-01')
    })

    it('returns custom fallback for empty string', () => {
      expect(normalizeDate('', '2024-01-01')).toBe('2024-01-01')
    })

    it('returns custom fallback string as is when fallback is not a valid date', () => {
      expect(normalizeDate('', 'not-a-date')).toBe('not-a-date')
    })

    it('returns ISO string of Date fallback for invalid input when fallback is Date object', () => {
      const fallbackDate = new Date('2024-01-01')
      expect(normalizeDate('invalid', fallbackDate)).toBe('2024-01-01')
    })
  })

  describe('getCurrentDateISO', () => {
    const systemDate = new Date('2025-06-09T00:00:00Z')

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(systemDate)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns mocked current date in ISO format', () => {
      expect(getCurrentDateISO()).toBe('2025-06-09')
    })
  })
})
