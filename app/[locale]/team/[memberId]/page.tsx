import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import TeamMemberClient from '@/app/[locale]/team/[memberId]/TeamMemberClient'
import { locales } from '@/i18n'
import { SITE_URL } from '@/lib/constants'
import { getSerializableTeamMemberById, getTeamMemberIds } from '@/lib/team'

type Props = {
  params: Promise<{ locale: string; memberId: string }>
}

export function generateStaticParams() {
  const memberIds = getTeamMemberIds()
  return locales.flatMap(locale =>
    memberIds.map(memberId => ({ locale, memberId })),
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
      languages: Object.fromEntries(
        locales.map(l => [l, `${SITE_URL}/${l}/team/${memberId}`]),
      ),
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
