import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LocaleLayout, { generateStaticParams } from '@/app/[locale]/layout'

const mockNotFound = vi.fn()
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
}
const { dynamicMock } = vi.hoisted(() => ({
  dynamicMock: vi.fn((_loader, _options) => {
    const DynamicComponent = () => <aside aria-label="cookie consent banner" />
    return DynamicComponent
  }),
}))

vi.mock('@/i18n', () => ({
  locales: ['en', 'sv'],
}))

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/en',
  notFound: () => mockNotFound(),
}))

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn(async () => ({ test: 'message' })),
  getTranslations: vi.fn(async () => (key: string) => key),
  getFormatter: vi.fn(async () => ({
    dateTime: (d: string | number | Date) => new Date(d).toISOString(),
  })),
}))

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  NextIntlClientProvider: ({
    children,
    locale,
  }: {
    children: ReactNode
    locale: string
  }) => <section aria-label={`provider ${locale}`}>{children}</section>,
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

  it('renders provider and cookie banner for valid locale', async () => {
    const ui = await LocaleLayout({
      children: <main aria-label="layout child">child</main>,
      params: Promise.resolve({ locale: 'en' }),
    })
    render(ui)

    expect(
      screen.getByRole('region', { name: 'provider en' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('main', { name: 'layout child' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('complementary', { name: 'cookie consent banner' }),
    ).toBeInTheDocument()
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
      await import('@/app/[locale]/layout')

      expect(dynamicMock).toHaveBeenCalledTimes(1)

      const loader = dynamicMock.mock.calls[0][0] as () => Promise<{
        default: unknown
      }>
      const loadedModule = await loader()
      expect(loadedModule).toHaveProperty('default')
    })
  })
})
