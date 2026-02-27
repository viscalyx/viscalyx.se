import fs from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getStaticPageDates } from '@/lib/file-dates'

describe('file-dates', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns Date objects for all static pages', () => {
    const dates = getStaticPageDates()

    expect(dates.home).toBeInstanceOf(Date)
    expect(dates.blog).toBeInstanceOf(Date)
    expect(dates.privacy).toBeInstanceOf(Date)
    expect(dates.terms).toBeInstanceOf(Date)
    expect(dates.cookies).toBeInstanceOf(Date)
  })

  it('returns valid dates for all pages', () => {
    const dates = getStaticPageDates()

    expect(Number.isNaN(dates.home.getTime())).toBe(false)
    expect(Number.isNaN(dates.blog.getTime())).toBe(false)
    expect(Number.isNaN(dates.privacy.getTime())).toBe(false)
    expect(Number.isNaN(dates.terms.getTime())).toBe(false)
    expect(Number.isNaN(dates.cookies.getTime())).toBe(false)
  })

  it('uses fallback dates when page-dates.json is missing', () => {
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    const readSpy = vi.spyOn(fs, 'readFileSync')

    const dates = getStaticPageDates()

    expect(existsSpy).toHaveBeenCalled()
    expect(readSpy).not.toHaveBeenCalled()
    expect(dates.home.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.blog.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.privacy.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.terms.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.cookies.toISOString()).toBe('2024-01-01T00:00:00.000Z')
  })

  it('uses fallback dates when page-dates.json is malformed', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => '{')

    const dates = getStaticPageDates()

    expect(dates.home.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.blog.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.privacy.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.terms.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.cookies.toISOString()).toBe('2024-01-01T00:00:00.000Z')
  })

  it('falls back only invalid fields when page-dates.json has partial invalid data', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readFileSync').mockImplementation(() =>
      JSON.stringify({
        home: '2025-01-02T00:00:00.000Z',
        blog: 'invalid-date',
        privacy: '2025-01-03T00:00:00.000Z',
        terms: 42,
        cookies: null,
      }),
    )

    const dates = getStaticPageDates()

    expect(dates.home.toISOString()).toBe('2025-01-02T00:00:00.000Z')
    expect(dates.blog.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.privacy.toISOString()).toBe('2025-01-03T00:00:00.000Z')
    expect(dates.terms.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    expect(dates.cookies.toISOString()).toBe('2024-01-01T00:00:00.000Z')
  })
})
