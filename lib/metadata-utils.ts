import { locales } from '@/i18n'
import { SITE_URL } from '@/lib/constants'

/**
 * Build the `alternates.languages` mapping for Next.js `Metadata`.
 *
 * @param path - The locale-relative page path, e.g. `"privacy"` or
 *   `"team/john-doe"`.
 * @returns An object keyed by locale with full URLs as values.
 */
export const buildLocalizedAlternates = (
  path: string,
): Record<string, string> =>
  Object.fromEntries(locales.map(l => [l, `${SITE_URL}/${l}/${path}`]))
