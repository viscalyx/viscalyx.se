import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/constants'
import TeamPageClient from './TeamPageClient'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'team' })

  const title = t('title')
  const description = t('description')
  const ogLocale = locale === 'sv' ? 'sv_SE' : 'en_US'

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: ogLocale,
      title,
      description,
      url: `${SITE_URL}/${locale}/team`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/team`,
      languages: {
        en: `${SITE_URL}/en/team`,
        sv: `${SITE_URL}/sv/team`,
      },
    },
  }
}

export default function TeamPage() {
  return <TeamPageClient />
}
