import { SITE_URL } from '@/lib/constants'
import { getStaticPageDates } from '@/lib/file-dates'
import { getTranslations } from 'next-intl/server'

import PrivacyPageClient from './PrivacyPageClient'

import type { Metadata } from 'next'

const staticPageDates = getStaticPageDates()

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })

  const title = t('privacy.title')
  const description = t('privacy.subtitle')
  const ogLocale = locale === 'sv' ? 'sv_SE' : 'en_US'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: ogLocale,
      title,
      description,
      url: `${SITE_URL}/${locale}/privacy`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        sv: `${SITE_URL}/sv/privacy`,
      },
    },
  }
}

export default function PrivacyPage() {
  return <PrivacyPageClient lastUpdatedDate={staticPageDates.privacy} />
}
