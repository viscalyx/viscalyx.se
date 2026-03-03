import { locales } from '@/i18n'

export function getHrefUrl(
  href: string,
  locale: string,
  allowedLocales: readonly string[] = locales,
) {
  // Enhanced absolute URL detection using regex to cover all protocols
  const absoluteUrlRegex = /^[a-z][a-z0-9+.-]*:/i

  // Check if it's an absolute URL (external link) or special protocols
  if (absoluteUrlRegex.test(href) || href.startsWith('//')) {
    return href
  }

  if (href.startsWith('#')) {
    // For section links, link to home page with hash
    return `/${locale}${href}`
  }

  // Regular page navigation - preserve locale
  const cleanHref = href.startsWith('/') ? href : `/${href}`

  // Check if the path already starts with a locale prefix to avoid duplication
  const pathSegments = cleanHref.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]

  // Normalize the first segment by converting to lowercase and trimming slashes
  const normalizedFirstSegment = firstSegment?.toLowerCase().replace(/\/$/, '')

  if (
    normalizedFirstSegment &&
    allowedLocales.includes(normalizedFirstSegment)
  ) {
    // Path already has a locale, return as-is
    return cleanHref
  }

  // Add locale prefix, ensuring no double slashes
  return `/${locale}${cleanHref}`
}
