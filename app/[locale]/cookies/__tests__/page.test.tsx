import React from 'react'
import { vi } from 'vitest'

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
  getFormatter: vi.fn().mockResolvedValue({
    dateTime: () => 'Jan 1, 2025',
  }),
}))

// Mock constants
vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://example.com',
}))

// Mock child components
vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'scroll-to-top' }),
}))

vi.mock('@/components/CookieSettingsWrapper', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'cookie-settings-wrapper' }),
}))

vi.mock('@/lib/file-dates', () => ({
  getStaticPageDates: () => ({
    cookies: new Date('2025-01-01'),
    privacy: new Date('2025-01-01'),
    terms: new Date('2025-01-01'),
  }),
}))

import { render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import CookiesPage, { generateMetadata } from '@/app/[locale]/cookies/page'

describe('CookiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateMetadata', () => {
    it('returns metadata for English locale', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.title).toBeDefined()
      expect(metadata.description).toBeDefined()
      expect(metadata.openGraph?.locale).toBe('en_US')
    })

    it('returns metadata for Swedish locale', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'sv' }),
      })

      expect(metadata.openGraph?.locale).toBe('sv_SE')
    })

    it('includes OG type website', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.openGraph).toMatchObject({ type: 'website' })
    })

    it('includes twitter card metadata', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
      })
      expect(metadata.twitter?.title).toBeDefined()
      expect(metadata.twitter?.description).toBeDefined()
    })

    it('includes alternates with canonical and languages', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.alternates?.canonical).toContain('/en/cookies')
      expect(metadata.alternates?.languages).toHaveProperty('en')
      expect(metadata.alternates?.languages).toHaveProperty('sv')
    })

    it('includes cookies page URL in openGraph', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.openGraph?.url).toContain('/en/cookies')
    })
  })

  describe('CookiesPage component', () => {
    it('renders page heading', async () => {
      render(await CookiesPage({ params: Promise.resolve({ locale: 'en' }) }))

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders header and footer', async () => {
      render(await CookiesPage({ params: Promise.resolve({ locale: 'en' }) }))

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })
})
