import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SerializableTeamMember } from '@/lib/team'
import TeamMemberClient from '../TeamMemberClient'

// Mock child components
vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}))
vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))
vi.mock('@/components/ScrollToTop', () => ({
  default: () => <div data-testid="scroll-to-top" />,
}))

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockMember: SerializableTeamMember = {
  id: 'test-member',
  name: 'Test Member',
  role: 'Developer',
  image: '/test-image.jpg',
  bio: 'A test biography.',
  location: 'Sweden',
  specialties: ['TypeScript', 'React'],
  socialLinks: [
    { name: 'GitHub', href: 'https://github.com/test' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/test' },
  ],
}

describe('TeamMemberClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders member name and role', () => {
    render(<TeamMemberClient member={mockMember} />)

    expect(screen.getByText(/Test Member/)).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('renders member location', () => {
    render(<TeamMemberClient member={mockMember} />)

    expect(screen.getByText('Sweden')).toBeInTheDocument()
  })

  it('renders member specialties', () => {
    render(<TeamMemberClient member={mockMember} />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('renders social links with correct hrefs', () => {
    render(<TeamMemberClient member={mockMember} />)

    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test')

    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/test')
  })

  it('renders back link with locale-prefixed href', () => {
    render(<TeamMemberClient member={mockMember} />)

    const backLink = screen.getByText('backToTeam').closest('a')
    expect(backLink).toHaveAttribute('href', '/en/team')
  })

  it('renders member image when provided', () => {
    render(<TeamMemberClient member={mockMember} />)

    const img = screen.getByRole('img', { name: 'Test Member' })
    expect(img).toHaveAttribute('src', '/test-image.jpg')
  })

  it('renders initials when no image is provided', () => {
    const memberWithoutImage: SerializableTeamMember = {
      ...mockMember,
      image: undefined,
    }

    render(<TeamMemberClient member={memberWithoutImage} />)

    expect(screen.getByText('TM')).toBeInTheDocument()
  })

  it('renders Header, Footer, and ScrollToTop', () => {
    render(<TeamMemberClient member={mockMember} />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
  })

  it('renders with Swedish locale prefix', async () => {
    // Re-mock useLocale to return 'sv'
    const nextIntl = await import('next-intl')
    vi.spyOn(nextIntl, 'useLocale').mockReturnValue('sv')

    render(<TeamMemberClient member={mockMember} />)

    const backLink = screen.getByText('backToTeam').closest('a')
    expect(backLink).toHaveAttribute('href', '/sv/team')
  })
})
