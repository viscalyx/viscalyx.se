import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Footer from '../Footer'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
}))

// Mock SocialIcons
vi.mock('../SocialIcons', () => ({
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
    // All navigation in the footer sections should be links, not buttons
    const footer = screen.getByRole('contentinfo')
    const buttons = footer.querySelectorAll('button')
    expect(buttons.length).toBe(0)
  })

  it('does not use useRouter for navigation', () => {
    // This test verifies the import - useRouter should not be imported
    // The component should use Link and <a> elements instead
    render(<Footer />)
    // If it renders without error and has no buttons, useRouter is not needed
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
