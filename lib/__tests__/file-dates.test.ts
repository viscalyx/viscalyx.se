import { describe, expect, it } from 'vitest'
import { getStaticPageDates } from '@/lib/file-dates'

describe('file-dates', () => {
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
})
