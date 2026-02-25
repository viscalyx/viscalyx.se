import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/structured-data'
import { locales } from '../../i18n'

// Dynamically import CookieConsentBanner to reduce initial bundle size
const CookieConsentBanner = dynamic(
  () => import('../../components/CookieConsentBanner'),
  {
    loading: () => null,
  },
)

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationJsonLd())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getWebSiteJsonLd())}
      </script>
      {children}
      <CookieConsentBanner />
    </NextIntlClientProvider>
  )
}
