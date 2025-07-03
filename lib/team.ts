import {
  BlueskyIcon,
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from '@/components/SocialIcons'
import { Mail } from 'lucide-react'

export interface TeamMember {
  id: string
  name: string
  role: string
  image?: string
  bio: string
  location: string
  specialties: string[]
  socialLinks: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

// Type for the translation function (simplified approach to avoid next-intl internal types)
type TranslationFunction = {
  (key: string): string
  raw: (key: string) => unknown
}

// Get team member data with translations
export function getTeamMembers(t: TranslationFunction): TeamMember[] {
  return [
    {
      id: 'johlju',
      name: 'Johan Ljunggren',
      role: t('members.johlju.role'),
      image: '/johlju-profile.jpg',
      bio: t('members.johlju.bio'),
      location: 'Sweden',
      specialties: t.raw('members.johlju.specialties') as string[],
      socialLinks: [
        {
          name: 'Email',
          href: 'mailto:johan.ljunggren@viscalyx.se',
          icon: Mail,
        },
        {
          name: 'LinkedIn',
          href: 'https://linkedin.com/in/johlju',
          icon: LinkedInIcon,
        },
        {
          name: 'Bluesky',
          href: 'https://bsky.app/profile/johlju.bsky.social',
          icon: BlueskyIcon,
        },
        {
          name: 'Mastodon',
          href: 'https://mastodon.social/@johlju',
          icon: MastodonIcon,
        },
        {
          name: 'X',
          href: 'https://twitter.com/johlju',
          icon: XIcon,
        },
        {
          name: 'Discord',
          href: 'https://discord.com/users/562649782665871360',
          icon: DiscordIcon,
        },
        {
          name: 'GitHub',
          href: 'https://github.com/johlju',
          icon: GitHubIcon,
        },
      ],
    },
    {
      id: 'testsson',
      name: 'Test Testsson',
      role: t('members.sonja.role'),
      image: undefined, // No image available
      bio: t('members.sonja.bio'),
      location: 'Sweden',
      specialties: t.raw('members.sonja.specialties') as string[],
      socialLinks: [
        {
          name: 'Instagram',
          href: 'https://instagram.com/testtestsson99934201',
          icon: InstagramIcon,
        },
      ],
    },
  ]
}

// Find team member by ID
export function getTeamMemberById(
  id: string,
  t: TranslationFunction
): TeamMember | null {
  const teamMembers = getTeamMembers(t)
  return teamMembers.find(member => member.id === id) || null
}

// Find team member by name (for blog author matching)
export function getTeamMemberByName(
  name: string,
  t: TranslationFunction
): TeamMember | null {
  const teamMembers = getTeamMembers(t)
  return (
    teamMembers.find(
      member => member.name.toLowerCase() === name.toLowerCase()
    ) || null
  )
}

// Generate initials from a name
export function getAuthorInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) // Limit to 2 characters for better display
}
