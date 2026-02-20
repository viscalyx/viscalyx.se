import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LocaleLayout, { generateStaticParams } from '../layout'

const mockNotFound = vi.fn()
const { dynamicMock } = vi.hoisted(() => ({
  dynamicMock: vi.fn((_loader, _options) => {
    const DynamicComponent = () => <div data-testid="cookie-consent-banner" />
    return DynamicComponent
  }),
}))

vi.mock('@/i18n', () => ({
  locales: ['en', 'sv'],
}))

vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn(async () => ({ test: 'message' })),
}))

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({
    children,
    locale,
  }: {
    children: ReactNode
    locale: string
  }) => <div data-testid={`provider-${locale}`}>{children}</div>,
}))

vi.mock('@/lib/structured-data', () => ({
  getOrganizationJsonLd: () => ({ '@type': 'Organization' }),
  getWebSiteJsonLd: () => ({ '@type': 'WebSite' }),
}))

vi.mock('next/dynamic', () => ({
  default: dynamicMock,
}))

describe('LocaleLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns static params for supported locales', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'en' }, { locale: 'sv' }])
  })

  it('renders provider, structured-data scripts and cookie banner for valid locale', async () => {
    const ui = await LocaleLayout({
      children: <div data-testid="child">child</div>,
      params: Promise.resolve({ locale: 'en' }),
    })
    const { container } = render(ui)

    expect(screen.getByTestId('provider-en')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('cookie-consent-banner')).toBeInTheDocument()
    expect(
      container.querySelectorAll('script[type="application/ld+json"]')
    ).toHaveLength(2)
  })

  it('calls notFound for unsupported locale', async () => {
    const ui = await LocaleLayout({
      children: <div>child</div>,
      params: Promise.resolve({ locale: 'de' }),
    })
    render(ui)

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  describe('dynamic import wiring', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('uses a dynamic loader that resolves CookieConsentBanner module', async () => {
      await import('../layout')

      expect(dynamicMock).toHaveBeenCalledTimes(1)

      const loader = dynamicMock.mock.calls[0][0] as () => Promise<{
        default: unknown
      }>
      const loadedModule = await loader()
      expect(loadedModule).toHaveProperty('default')
    })
  })
})
