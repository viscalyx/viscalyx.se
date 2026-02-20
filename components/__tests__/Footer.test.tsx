import Footer from '@/components/Footer'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

let mockPathname = '/en'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

// Mock SocialIcons
vi.mock('@/components/SocialIcons', () => ({
  GitHubIcon: ({ className }: { className?: string }) => (
    <svg data-testid="github-icon" className={className} />
  ),
  LinkedInIcon: ({ className }: { className?: string }) => (
    <svg data-testid="linkedin-icon" className={className} />
  ),
  XIcon: ({ className }: { className?: string }) => (
    <svg data-testid="x-icon" className={className} />
  ),
  BlueskyIcon: ({ className }: { className?: string }) => (
    <svg data-testid="bluesky-icon" className={className} />
  ),
  MastodonIcon: ({ className }: { className?: string }) => (
    <svg data-testid="mastodon-icon" className={className} />
  ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ExternalLink: ({ className }: { className?: string }) => (
    <svg data-testid="external-link-icon" className={className} />
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg data-testid="mail-icon" className={className} />
  ),
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/en'
  })

  it('renders the footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders the Viscalyx brand name', () => {
    render(<Footer />)
    expect(screen.getByText('Viscalyx')).toBeInTheDocument()
  })

  it('renders the company description', () => {
    render(<Footer />)
    expect(screen.getByText('companyDescription')).toBeInTheDocument()
  })

  it('renders all section headings with translation keys', () => {
    render(<Footer />)
    expect(screen.getByText('company')).toBeInTheDocument()
    expect(screen.getByText('resources')).toBeInTheDocument()
    expect(screen.getByText('support')).toBeInTheDocument()
  })

  it('renders company links as anchor elements, not buttons', () => {
    render(<Footer />)
    const aboutLink = screen.getByText('aboutUs')
    expect(aboutLink.tagName).toBe('A')
    expect(aboutLink).not.toHaveAttribute('type', 'button')

    const openSourceLink = screen.getByText('openSource')
    expect(openSourceLink.tagName).toBe('A')
  })

  it('renders section links with correct locale-prefixed href', () => {
    render(<Footer />)
    const aboutLink = screen.getByText('aboutUs')
    expect(aboutLink).toHaveAttribute('href', '/en#about')

    const openSourceLink = screen.getByText('openSource')
    expect(openSourceLink).toHaveAttribute('href', '/en#open-source')
  })

  it('renders internal page links with locale prefix', () => {
    render(<Footer />)
    const blogLink = screen.getByText('blog')
    expect(blogLink.tagName).toBe('A')
    expect(blogLink).toHaveAttribute('href', '/en/blog')

    const privacyLink = screen.getByText('privacyPolicy')
    expect(privacyLink.tagName).toBe('A')
    expect(privacyLink).toHaveAttribute('href', '/en/privacy')
  })

  it('renders external links with target="_blank" and rel attributes', () => {
    render(<Footer />)
    const communityLink = screen.getByText('community')
    expect(communityLink.tagName).toBe('A')
    expect(communityLink).toHaveAttribute('href', 'https://dsccommunity.org/')
    expect(communityLink).toHaveAttribute('target', '_blank')
    expect(communityLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders external link icons for external links', () => {
    render(<Footer />)
    const communityLink = screen.getByText('community')
    const icon = communityLink.querySelector(
      '[data-testid="external-link-icon"]'
    )
    expect(icon).toBeInTheDocument()
  })

  it('does not render external link icons for internal links', () => {
    render(<Footer />)
    const privacyLink = screen.getByText('privacyPolicy')
    const icon = privacyLink.querySelector('[data-testid="external-link-icon"]')
    expect(icon).not.toBeInTheDocument()
  })

  it('renders social links with correct hrefs', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/viscalyx')

    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/company/viscalyx'
    )
  })

  it('renders social links with target="_blank"', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders social links with aria-labels', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bluesky' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mastodon' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`© ${year} Viscalyx`))
    ).toBeInTheDocument()
  })

  it('does not use buttons for navigation links', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    const buttons = footer.querySelectorAll('button')
    expect(buttons.length).toBe(0)
    // All navigation is via Link or <a> elements
    const links = footer.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('smooth-scrolls section links when already on locale home page', () => {
    const section = document.createElement('div')
    section.id = 'about'
    const scrollIntoViewSpy = vi.fn()
    section.scrollIntoView = scrollIntoViewSpy
    document.body.appendChild(section)

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(callback => {
        callback(0)
        return 1
      })

    try {
      render(<Footer />)
      fireEvent.click(screen.getByText('aboutUs'))

      expect(rafSpy).toHaveBeenCalled()
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
    } finally {
      rafSpy.mockRestore()
      section.remove()
    }
  })

  it('does not intercept section links when not on home page', () => {
    mockPathname = '/en/blog'
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

    render(<Footer />)
    fireEvent.click(screen.getByText('aboutUs'))

    expect(rafSpy).not.toHaveBeenCalled()
  })
})
