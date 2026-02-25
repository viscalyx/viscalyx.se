import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SITE_URL } from '@/lib/constants'
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/structured-data'

describe('structured-data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds organization JSON-LD with expected canonical fields', () => {
    const data = getOrganizationJsonLd() as unknown as Record<string, unknown>

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.logo).toBe(`${SITE_URL}/viscalyx_logo_128x128.png`)
    expect(data.description).toBe(
      'Expert automation consulting specializing in PowerShell DSC, DevOps, and infrastructure automation.'
    )
    expect(data.sameAs).toEqual(
      expect.arrayContaining(['https://github.com/viscalyx'])
    )
  })

  it('builds website JSON-LD with supported languages', () => {
    const data = getWebSiteJsonLd() as unknown as Record<string, unknown>

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('WebSite')
    expect(data.name).toBe('Viscalyx')
    expect(data.url).toBe(SITE_URL)
    expect(data.inLanguage).toEqual(['en', 'sv'])
  })
})
