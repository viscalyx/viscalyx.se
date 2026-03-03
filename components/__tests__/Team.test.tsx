import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Team from '@/components/Team'

const mockGetTeamMembers = vi.fn()

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string, values?: { name?: string }) => {
      if (key === 'viewProfileFallback' && values?.name) {
        return `View profile for ${values.name}`
      }
      return key
    }
    t.raw = (key: string) => {
      if (key === 'members.johlju.specialties') {
        return ['PowerShell', 'DevOps', 'DSC']
      }
      return []
    }
    return t
  },
  useLocale: () => 'en',
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
}))

// Mock @/lib/team
vi.mock('@/lib/team', () => ({
  getTeamMembers: (...args: unknown[]) => mockGetTeamMembers(...args),
  socialIconTranslationKeyMap: {
    Email: 'email',
    LinkedIn: 'linkedin',
    Bluesky: 'bluesky',
    Mastodon: 'mastodon',
    X: 'x',
    Discord: 'discord',
    GitHub: 'github',
  },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <svg aria-label="Arrow right" className={className} role="img" />
  ),
  Camera: ({ className }: { className?: string }) => (
    <svg aria-label="Camera" className={className} role="img" />
  ),
  MapPin: ({ className }: { className?: string }) => (
    <svg aria-label="Map pin" className={className} role="img" />
  ),
}))

describe('Team', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetTeamMembers.mockReturnValue([
      {
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: 'members.johlju.role',
        image: '/johlju-profile.jpg',
        bio: 'members.johlju.bio',
        location: 'Sweden',
        specialties: ['PowerShell', 'DevOps', 'DSC'],
        socialLinks: [
          {
            name: 'Email',
            href: 'mailto:test@example.com',
            icon: ({ className }: { className?: string }) => (
              <svg className={className} data-testid="email-icon" />
            ),
          },
          {
            name: 'GitHub',
            href: 'https://github.com/test',
            icon: ({ className }: { className?: string }) => (
              <svg className={className} data-testid="github-icon" />
            ),
          },
        ],
      },
    ])
  })

  it('renders the team section', () => {
    render(<Team />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('renders team member cards', () => {
    render(<Team />)
    expect(screen.getByText('Johan Ljunggren')).toBeInTheDocument()
    expect(screen.getByText('members.johlju.role')).toBeInTheDocument()
    expect(screen.getByText('members.johlju.bio')).toBeInTheDocument()
  })

  it('renders the badge text', () => {
    render(<Team />)
    expect(screen.getByText('badge')).toBeInTheDocument()
  })

  it('renders member location with map pin icon', () => {
    render(<Team />)
    expect(screen.getByText('Sweden')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Map pin' })).toBeInTheDocument()
  })

  it('renders member specialties', () => {
    render(<Team />)
    expect(screen.getByText('PowerShell')).toBeInTheDocument()
    expect(screen.getByText('DevOps')).toBeInTheDocument()
    expect(screen.getByText('DSC')).toBeInTheDocument()
  })

  it('renders specialties heading', () => {
    render(<Team />)
    expect(screen.getByText('specialties')).toBeInTheDocument()
  })

  it('renders member profile image', () => {
    render(<Team />)
    const img = screen.getByAltText('Johan Ljunggren')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/johlju-profile.jpg')
  })

  it('renders social links with correct attributes', () => {
    render(<Team />)
    const emailLink = screen.getByLabelText('Email')
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')
    expect(emailLink).toHaveAttribute('target', '_self')
    expect(emailLink).not.toHaveAttribute('rel')

    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('falls back to raw social name when translation key mapping is missing', () => {
    mockGetTeamMembers.mockReturnValueOnce([
      {
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: 'members.johlju.role',
        image: '/johlju-profile.jpg',
        bio: 'members.johlju.bio',
        location: 'Sweden',
        specialties: ['PowerShell', 'DevOps', 'DSC'],
        socialLinks: [
          {
            name: 'UnknownNetwork',
            href: 'https://example.com/profile',
            icon: ({
              className,
              title,
            }: {
              className?: string
              title?: string
            }) => (
              <span
                aria-label={`${title} icon`}
                className={className}
                role="img"
                title={title}
              />
            ),
          },
        ],
      },
    ])

    render(<Team />)

    const unknownLink = screen.getByLabelText('UnknownNetwork')
    expect(unknownLink).toHaveAttribute('href', 'https://example.com/profile')
    expect(
      screen.getByRole('img', { name: 'UnknownNetwork icon' }),
    ).toHaveAttribute('title', 'UnknownNetwork')
  })

  it('renders a view profile link for each member', () => {
    render(<Team />)
    const profileLink = screen.getByRole('link', {
      name: 'View profile for Johan Ljunggren',
    })
    expect(profileLink).toHaveAttribute('href', '/en/team/johlju')
  })

  it('view profile link is accessible via keyboard', () => {
    render(<Team />)
    const profileLink = screen.getByRole('link', {
      name: 'View profile for Johan Ljunggren',
    })
    expect(profileLink).toBeInTheDocument()
    // Link elements are natively keyboard-accessible
    expect(profileLink.tagName).toBe('A')
  })

  it('renders camera fallback when a member has no profile image', () => {
    mockGetTeamMembers.mockReturnValueOnce([
      {
        id: 'johlju',
        name: 'Johan Ljunggren',
        role: 'members.johlju.role',
        image: '',
        bio: 'members.johlju.bio',
        location: 'Sweden',
        specialties: ['PowerShell', 'DevOps', 'DSC'],
        socialLinks: [],
      },
    ])

    render(<Team />)

    expect(screen.queryByAltText('Johan Ljunggren')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: /camera/i })).toBeInTheDocument()
  })

  it('social links are independent of profile navigation', () => {
    render(<Team />)
    const githubLink = screen.getByLabelText('GitHub')
    // Social links open externally, not via client-side navigation
    expect(githubLink.closest('a')).toHaveAttribute('target', '_blank')
    expect(githubLink.closest('a')).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })

  it('social links do not interfere with keyboard navigation', () => {
    render(<Team />)
    const githubLink = screen.getByLabelText('GitHub')
    // Social link is a proper anchor element accessible via keyboard
    expect(githubLink.closest('a')).toHaveAttribute('href')
  })

  it('renders the call to action section', () => {
    render(<Team />)
    expect(screen.getByText('joinTeam.title')).toBeInTheDocument()
    expect(screen.getByText('joinTeam.description')).toBeInTheDocument()
    expect(screen.getByText('joinTeam.button')).toBeInTheDocument()
  })

  it('has a GitHub link in the call to action', () => {
    render(<Team />)
    const ctaLink = screen.getByText('joinTeam.button').closest('a')
    expect(ctaLink).toHaveAttribute('href', 'https://github.com/viscalyx')
    expect(ctaLink).toHaveAttribute('target', '_blank')
    expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders as a section element with correct id', () => {
    const { container } = render(<Team />)
    const section = container.querySelector('section#team')
    expect(section).toBeInTheDocument()
  })
})
