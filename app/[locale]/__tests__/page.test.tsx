import React from 'react'
import { vi } from 'vitest'

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue(
    Object.assign((key: string) => `translated:${key}`, {
      rich: (key: string) => `translated:${key}`,
    }),
  ),
}))

vi.mock('@/lib/constants', () => ({
  SITE_URL: 'https://example.com',
}))

// Mock child components
vi.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => React.createElement('header', null),
}))

vi.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () =>
    React.createElement('section', { 'aria-label': 'hero' }, 'Hero'),
}))

vi.mock('@/components/About', () => ({
  __esModule: true,
  default: () =>
    React.createElement('section', { 'aria-label': 'about' }, 'About'),
}))

vi.mock('@/components/OpenSource', () => ({
  __esModule: true,
  default: () =>
    React.createElement(
      'section',
      { 'aria-label': 'open-source' },
      'OpenSource',
    ),
}))

vi.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => React.createElement('footer', null),
}))

vi.mock('@/components/ScrollToTop', () => ({
  __esModule: true,
  default: () =>
    React.createElement(
      'button',
      { type: 'button', 'aria-label': 'scroll to top' },
      'ScrollToTop',
    ),
}))

import { render, screen } from '@testing-library/react'
import Home, { generateMetadata } from '@/app/[locale]/page'

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all child components', async () => {
    const page = await Home()
    render(page)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /hero/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /about/i })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /open-source/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /scroll to top/i }),
    ).toBeInTheDocument()
  })

  it('renders main element with fade-in animation class', async () => {
    const page = await Home()
    const { container } = render(page)

    const main = container.querySelector('main')
    expect(main).toHaveClass('min-h-screen')
    expect(main).toHaveClass('animate-fade-in')
  })
})

describe('generateMetadata', () => {
  it('returns metadata for English locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata.title).toBe(
      'translated:title translated:titleHighlight translated:titleEnd',
    )
    expect(metadata.description).toBe('translated:description')
    expect(metadata.openGraph?.locale).toBe('en_US')
  })

  it('returns metadata for Swedish locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'sv' }),
    })

    expect(metadata.openGraph?.locale).toBe('sv_SE')
  })

  it('includes OG image with correct locale', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    const images = metadata.openGraph?.images as Array<{ url: string }>
    expect(images[0].url).toContain('og-home-en.png')
  })

  it('includes OG image alt text', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    const images = metadata.openGraph?.images as Array<{
      url: string
      alt: string
    }>
    expect(images[0].alt).toBe('translated:og.imageAlt')
  })

  it('includes twitter card metadata', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    const twitter = metadata.twitter as {
      card: string
      title: string
      description: string
    }
    expect(twitter.card).toBe('summary_large_image')
    expect(twitter.title).toBeDefined()
    expect(twitter.description).toBeDefined()
  })

  it('includes alternates with canonical and language URLs', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })

    expect(metadata.alternates?.canonical).toBe('https://example.com/en')
    expect(metadata.alternates?.languages).toEqual({
      en: 'https://example.com/en',
      sv: 'https://example.com/sv',
    })
  })
})
