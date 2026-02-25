import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Team from '@/components/Team'

const mockPush = vi.fn()

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key
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
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/en',
}))

// Mock @/lib/team
vi.mock('@/lib/team', () => ({
  getTeamMembers: () => [
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
            <svg data-testid="email-icon" className={className} />
          ),
        },
        {
          name: 'GitHub',
          href: 'https://github.com/test',
          icon: ({ className }: { className?: string }) => (
            <svg data-testid="github-icon" className={className} />
          ),
        },
      ],
    },
  ],
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-right-icon" className={className} />
  ),
  Camera: ({ className }: { className?: string }) => (
    <svg data-testid="camera-icon" className={className} />
  ),
  MapPin: ({ className }: { className?: string }) => (
    <svg data-testid="map-pin-icon" className={className} />
  ),
}))

describe('Team', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument()
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

    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('navigates to member detail on card click', () => {
    render(<Team />)
    // Click on the member card (the clickable wrapper)
    fireEvent.click(screen.getByText('Johan Ljunggren'))
    expect(mockPush).toHaveBeenCalledWith('/en/team/johlju')
  })

  it('stops propagation on social link clicks', () => {
    render(<Team />)
    fireEvent.click(screen.getByLabelText('GitHub'))
    // Should not navigate to member page when social link is clicked
    expect(mockPush).not.toHaveBeenCalled()
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
