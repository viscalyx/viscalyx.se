import { SITE_URL } from '@/lib/constants'
import { getSerializableTeamMemberById, getTeamMemberIds } from '@/lib/team'
import { locales } from '@/i18n'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import TeamMemberClient from './TeamMemberClient'

import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string; memberId: string }>
}

export function generateStaticParams() {
  const memberIds = getTeamMemberIds()
  return locales.flatMap(locale =>
    memberIds.map(memberId => ({ locale, memberId }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, memberId } = await params
  const t = await getTranslations({ locale, namespace: 'team' })

  const member = getSerializableTeamMemberById(memberId, t)
  if (!member) return {}

  const title = `${member.name} — ${member.role}`
  const description = member.bio

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      ...(member.image && {
        images: [
          {
            url: `${SITE_URL}${member.image}`,
            width: 400,
            height: 400,
            alt: member.name,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/team/${memberId}`,
      languages: {
        en: `${SITE_URL}/en/team/${memberId}`,
        sv: `${SITE_URL}/sv/team/${memberId}`,
      },
    },
  }
}

export default async function TeamMemberPage({ params }: Props) {
  const { locale, memberId } = await params
  const tGlobal = await getTranslations({ locale, namespace: 'team' })

  const member = getSerializableTeamMemberById(memberId, tGlobal)

  if (!member) {
    notFound()
  }

  return <TeamMemberClient member={member} />
}
