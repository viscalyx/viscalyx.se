import { SITE_URL } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'

import TermsPageClient from './TermsPageClient'

import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })

  const title = t('terms.title')
  const description = t('terms.subtitle')
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
      languages: {
        en: `${SITE_URL}/en/terms`,
        sv: `${SITE_URL}/sv/terms`,
      },
    },
  }
}

export default function TermsPage() {
  return <TermsPageClient />
}
