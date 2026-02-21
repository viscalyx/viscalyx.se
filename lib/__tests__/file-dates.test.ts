import { describe, expect, it } from 'vitest'
import { getStaticPageDates } from '@/lib/file-dates'
import pageDatesData from '@/lib/page-dates.json'

describe('file-dates', () => {
  it('returns Date objects for all static pages', () => {
    const dates = getStaticPageDates()

    expect(dates.home).toBeInstanceOf(Date)
    expect(dates.blog).toBeInstanceOf(Date)
    expect(dates.privacy).toBeInstanceOf(Date)
    expect(dates.terms).toBeInstanceOf(Date)
    expect(dates.cookies).toBeInstanceOf(Date)
  })

  it('maps values from page-dates.json without mutation', () => {
    const dates = getStaticPageDates()

    expect(dates.home.toISOString()).toBe(pageDatesData.home)
    expect(dates.blog.toISOString()).toBe(pageDatesData.blog)
    expect(dates.privacy.toISOString()).toBe(pageDatesData.privacy)
    expect(dates.terms.toISOString()).toBe(pageDatesData.terms)
    expect(dates.cookies.toISOString()).toBe(pageDatesData.cookies)
  })
})
