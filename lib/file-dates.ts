import fs from 'node:fs'
import path from 'node:path'

interface StaticPageDateMap {
  blog: string
  cookies: string
  home: string
  privacy: string
  terms: string
}

const FALLBACK_PAGE_DATES: StaticPageDateMap = {
  home: '2024-01-01T00:00:00.000Z',
  blog: '2024-01-01T00:00:00.000Z',
  privacy: '2024-01-01T00:00:00.000Z',
  terms: '2024-01-01T00:00:00.000Z',
  cookies: '2024-01-01T00:00:00.000Z',
}

function isValidISODate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  return !Number.isNaN(Date.parse(value))
}

function loadPageDatesData(): StaticPageDateMap {
  const pageDatesPath = path.join(process.cwd(), 'lib', 'page-dates.json')

  try {
    if (!fs.existsSync(pageDatesPath)) {
      return FALLBACK_PAGE_DATES
    }

    const raw = fs.readFileSync(pageDatesPath, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StaticPageDateMap>

    const sanitized = {} as StaticPageDateMap
    const keys = Object.keys(FALLBACK_PAGE_DATES) as Array<
      keyof StaticPageDateMap
    >

    for (const key of keys) {
      sanitized[key] = isValidISODate(parsed[key])
        ? parsed[key]
        : FALLBACK_PAGE_DATES[key]
    }

    return sanitized
  } catch {
    return FALLBACK_PAGE_DATES
  }
}

export interface StaticPageDates {
  blog: Date
  cookies: Date
  home: Date
  privacy: Date
  terms: Date
}

/**
 * Get last modified dates for specific static pages
 * These dates are automatically generated from Git history during build time
 * via the scripts/build-page-dates.js script
 *
 * To update these dates:
 * 1. Run: npm run build:page-dates
 * 2. This will read Git commit history and update lib/page-dates.json
 * 3. The updated dates will be used in the sitemap and pages
 */
export function getStaticPageDates(): StaticPageDates {
  const pageDatesData = loadPageDatesData()

  return {
    home: new Date(pageDatesData.home),
    blog: new Date(pageDatesData.blog),
    privacy: new Date(pageDatesData.privacy),
    terms: new Date(pageDatesData.terms),
    cookies: new Date(pageDatesData.cookies),
  }
}
