import React from 'react'
import { vi } from 'vitest'

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `translated:${key}`),
}))

// Mock child components
vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', { 'data-testid': 'header' }),
}))

vi.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () => React.createElement('section', { 'data-testid': 'hero' }),
}))

vi.mock('@/components/About', () => ({
  __esModule: true,
  default: () => React.createElement('section', { 'data-testid': 'about' }),
}))

vi.mock('@/components/OpenSource', () => ({
  __esModule: true,
  default: () =>
    React.createElement('section', { 'data-testid': 'open-source' }),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', { 'data-testid': 'footer' }),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'scroll-to-top' }),
}))

import { render, screen } from '@testing-library/react'

import Home, { generateMetadata } from '@/app/[locale]/page'

import type { Metadata } from 'next'

describe('Home', () => {
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
  })

  describe('Home component', () => {
    it('renders all sections', () => {
      render(<Home />)

      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('hero')).toBeInTheDocument()
      expect(screen.getByTestId('about')).toBeInTheDocument()
      expect(screen.getByTestId('open-source')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
    })

    it('renders main element with min-h-screen', () => {
      render(<Home />)

      const main = screen.getByRole('main')
      expect(main).toHaveClass('min-h-screen')
    })
  })
})
