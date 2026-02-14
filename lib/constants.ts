/**
 * Canonical site URL used for metadata, OG images, sitemaps, etc.
 *
 * On preview deploys, set the `NEXT_PUBLIC_SITE_URL` environment variable
 * so that OG images, sitemaps, and canonical URLs point to the correct host.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://viscalyx.se'
