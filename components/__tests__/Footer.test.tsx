import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Footer from '@/components/Footer'

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
    <svg className={className} data-testid="github-icon" />
  ),
  LinkedInIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="linkedin-icon" />
  ),
  XIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="x-icon" />
  ),
  BlueskyIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="bluesky-icon" />
  ),
  MastodonIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="mastodon-icon" />
  ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ExternalLink: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="external-link-icon" />
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="mail-icon" />
  ),
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/en'
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
      '[data-testid="external-link-icon"]',
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
    const githubLink = screen.getByRole('link', {
      name: 'socialLinks.github',
    })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/viscalyx')

    const linkedinLink = screen.getByRole('link', {
      name: 'socialLinks.linkedin',
    })
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/company/viscalyx',
    )
  })

  it('renders social links with conditional target and rel attributes', () => {
    render(<Footer />)
    const githubLink = screen.getByRole('link', {
      name: 'socialLinks.github',
    })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')

    const emailLink = screen.getByRole('link', {
      name: 'socialLinks.email',
    })
    expect(emailLink).not.toHaveAttribute('target')
    expect(emailLink).not.toHaveAttribute('rel')
  })

  it('renders social links with aria-labels', () => {
    render(<Footer />)
    expect(
      screen.getByRole('link', { name: 'socialLinks.github' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'socialLinks.linkedin' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'socialLinks.x' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'socialLinks.bluesky' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'socialLinks.mastodon' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'socialLinks.email' }),
    ).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`© ${year} Viscalyx`)),
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
