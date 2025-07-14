import pageDatesData from './page-dates.json'

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
export function getStaticPageDates() {
  return {
    home: new Date(pageDatesData.home),
    blog: new Date(pageDatesData.blog),
    privacy: new Date(pageDatesData.privacy),
    terms: new Date(pageDatesData.terms),
  }
}
