import { SITE_URL } from '@/lib/constants'
import { describe, expect, it } from 'vitest'
import { getOrganizationJsonLd, getWebSiteJsonLd } from '../structured-data'

describe('structured-data', () => {
  it('builds organization JSON-LD with expected canonical fields', () => {
    const data = getOrganizationJsonLd()

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.logo).toBe(`${SITE_URL}/logo.png`)
    expect(data.sameAs).toContain('https://github.com/viscalyx')
  })

  it('builds website JSON-LD with supported languages', () => {
    const data = getWebSiteJsonLd()

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('WebSite')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.inLanguage).toEqual(['en', 'sv'])
  })
})
