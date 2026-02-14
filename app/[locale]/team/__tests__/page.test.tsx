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
vi.mock('../TeamPageClient', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'team-page-client' }),
}))

import { render, screen } from '@testing-library/react'

import TeamPage, { generateMetadata } from '@/app/[locale]/team/page'

import type { Metadata } from 'next'

describe('TeamPage', () => {
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

      expect(metadata.alternates?.canonical).toContain('/en/team')
      expect(metadata.alternates?.languages).toHaveProperty('en')
      expect(metadata.alternates?.languages).toHaveProperty('sv')
    })

    it('includes team page URL in openGraph', async () => {
      const metadata: Metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      })

      expect(metadata.openGraph?.url).toContain('/en/team')
    })
  })

  describe('TeamPage component', () => {
    it('renders TeamPageClient', () => {
      render(<TeamPage />)

      expect(screen.getByTestId('team-page-client')).toBeInTheDocument()
    })
  })
})
