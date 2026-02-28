import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n'
import { SITE_URL } from '@/lib/constants'
import { getStaticPageDates } from '@/lib/file-dates'
import TermsPageClient from './TermsPageClient'

const staticPageDates = getStaticPageDates()

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })

  const title = t('title')
  const description = t('subtitle')
  const ogLocale = locale === 'sv' ? 'sv_SE' : 'en_US'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: ogLocale,
      title,
      description,
      url: `${SITE_URL}/${locale}/terms`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms`,
      languages: Object.fromEntries(
        locales.map(l => [l, `${SITE_URL}/${l}/terms`]),
      ),
    },
  }
}

export default function TermsPage() {
  return <TermsPageClient lastUpdatedDate={staticPageDates.terms} />
}
