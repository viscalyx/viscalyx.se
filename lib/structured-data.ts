import { SITE_URL } from '@/lib/constants'

import type { Organization, WebSite, WithContext } from 'schema-dts'

/**
 * Generate JSON-LD structured data for the Organization.
 * Used on the root layout to provide Google with business metadata.
 */
export function getOrganizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Viscalyx',
    url: SITE_URL,
    logo: `${SITE_URL}/viscalyx_logo_128x128.png`,
    description:
      'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation.',
    sameAs: ['https://github.com/viscalyx'],
  }
}

/**
 * Generate JSON-LD structured data for the WebSite.
 * Helps search engines understand the site structure.
 */
export function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Viscalyx',
    url: SITE_URL,
    inLanguage: ['en', 'sv'],
  }
}
