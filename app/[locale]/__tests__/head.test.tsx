import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Head from '../head'

const mockGetOrganizationJsonLd = vi.fn(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Viscalyx',
}))

const mockGetWebSiteJsonLd = vi.fn(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Viscalyx Site',
}))

vi.mock('@/lib/structured-data', () => ({
  getOrganizationJsonLd: () => mockGetOrganizationJsonLd(),
  getWebSiteJsonLd: () => mockGetWebSiteJsonLd(),
}))

describe('locale head', () => {
  it('renders two JSON-LD script tags with organization and website payloads', () => {
    const { container } = render(<Head />)

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    )
    expect(scripts).toHaveLength(2)

    expect(mockGetOrganizationJsonLd).toHaveBeenCalledTimes(1)
    expect(mockGetWebSiteJsonLd).toHaveBeenCalledTimes(1)

    expect(scripts[0].textContent).toBe(
      JSON.stringify(mockGetOrganizationJsonLd.mock.results[0].value),
    )
    expect(scripts[1].textContent).toBe(
      JSON.stringify(mockGetWebSiteJsonLd.mock.results[0].value),
    )
  })
})
