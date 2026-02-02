import { getSerializableTeamMemberById } from '@/lib/team'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import TeamMemberClient from './TeamMemberClient'

// Export dynamic configuration to allow dynamic rendering
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; memberId: string }>
}

export default async function TeamMemberPage({ params }: Props) {
  const resolvedParams = await params
  const tGlobal = await getTranslations('team')

  const member = getSerializableTeamMemberById(resolvedParams.memberId, tGlobal)

  if (!member) {
    notFound()
  }

  return <TeamMemberClient member={member} />
}
