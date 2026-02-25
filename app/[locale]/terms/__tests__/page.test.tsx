import React from 'react'
import { vi } from 'vitest'

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
  getRequestConfig: vi.fn(),
}))

// Mock child component
vi.mock('../TermsPageClient', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'terms-page-client' }),
}))

vi.mock('@/lib/file-dates', () => ({
  getStaticPageDates: () => ({
    home: new Date('2025-01-01'),
    blog: new Date('2025-01-01'),
    cookies: new Date('2025-01-01'),
    privacy: new Date('2025-01-01'),
    terms: new Date('2025-01-01'),
  }),
}))

import { render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import TermsPage, { generateMetadata } from '@/app/[locale]/terms/page'

describe('TermsPage', () => {
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

      expect(metadata.alternates?.canonical).toContain('/en/terms')
      expect(metadata.alternates?.languages).toHaveProperty('en')
      expect(metadata.alternates?.languages).toHaveProperty('sv')
    })

    it('includes terms page URL in openGraph', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.openGraph?.url).toContain('/en/terms')
    })
  })

  describe('TermsPage component', () => {
    it('renders TermsPageClient', () => {
      render(<TermsPage />)

      expect(screen.getByTestId('terms-page-client')).toBeInTheDocument()
    })
  })
})
