import {
  type CookieCategory,
  type CookieInfo,
  cookieRegistry,
} from '@/lib/cookie-consent'

/**
 * Get all cookies belonging to a specific category from the registry.
 * @param category - The cookie category to filter by
 * @returns Array of CookieInfo objects matching the category
 */
export const getCookiesForCategory = (
  category: CookieCategory,
): CookieInfo[] => {
  return cookieRegistry.filter(cookie => cookie.category === category)
}
