import {
  BlueskyIcon,
  DiscordIcon,
  GitHubIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from '@/components/SocialIcons'
import { Mail } from 'lucide-react'

// Icon name type for serializable data
export type SocialIconName =
  | 'Email'
  | 'LinkedIn'
  | 'Bluesky'
  | 'Mastodon'
  | 'X'
  | 'Discord'
  | 'GitHub'

// Map of icon names to components (for client-side resolution)
export const socialIconMap: Record<
  SocialIconName,
  React.ComponentType<{ className?: string }>
> = {
  Email: Mail,
  LinkedIn: LinkedInIcon,
  Bluesky: BlueskyIcon,
  Mastodon: MastodonIcon,
  X: XIcon,
  Discord: DiscordIcon,
  GitHub: GitHubIcon,
}

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

// Serializable version of TeamMember for Server-to-Client Component data passing
export interface SerializableTeamMember {
  id: string
  name: string
  role: string
  image?: string
  bio: string
  location: string
  specialties: string[]
  socialLinks: Array<{
    name: SocialIconName
    href: string
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
        // {
        //   name: 'Stack Overflow',
        //   href: 'https://stackoverflow.com/users/2397355/johan-ljunggren',
        //   icon: StackOverflowIcon,
        // },
        // {
        //   name: 'YouTube',
        //   href: 'https://youtube.com/@johlju',
        //   icon: YouTubeIcon,
        // },
        // {
        //   name: 'Slack',
        //   href: 'https://dsccommunity.slack.com',
        //   icon: SlackIcon,
        // },
      ],
    },
    // {
    //   id: 'testsson',
    //   name: 'Test Testsson',
    //   role: t('members.testsson.role'),
    //   image: undefined, // No image available
    //   bio: t('members.testsson.bio'),
    //   location: 'Sweden',
    //   specialties: t.raw('members.testsson.specialties') as string[],
    //   socialLinks: [
    //     {
    //       name: 'Instagram',
    //       href: 'https://instagram.com/testtestsson99934201',
    //       icon: InstagramIcon,
    //     },
    //   ],
    // },
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

// Convert a TeamMember to its serializable form (strips icon components)
function toSerializable(member: TeamMember): SerializableTeamMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    image: member.image,
    bio: member.bio,
    location: member.location,
    specialties: member.specialties,
    socialLinks: member.socialLinks.map(link => ({
      name: link.name as SocialIconName,
      href: link.href,
    })),
  }
}

// Find team member by ID and return serializable version (for Server Components)
export function getSerializableTeamMemberById(
  id: string,
  t: TranslationFunction
): SerializableTeamMember | null {
  const member = getTeamMemberById(id, t)
  if (!member) return null
  return toSerializable(member)
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

// Find team member by name and return serializable version (for Server Components)
export function getSerializableTeamMemberByName(
  name: string,
  t: TranslationFunction
): SerializableTeamMember | null {
  const member = getTeamMemberByName(name, t)
  if (!member) return null
  return toSerializable(member)
}

// Get all team member IDs without requiring translations (for generateStaticParams)
export function getTeamMemberIds(): string[] {
  return ['johlju']
}

// Generate initials from a name
export function getAuthorInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) // Limit to 2 characters for better display
}
