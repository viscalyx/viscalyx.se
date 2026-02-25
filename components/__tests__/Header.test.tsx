import { fireEvent, render, screen, within } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from '@/components/Header'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Controllable pathname mock
let mockPathname = '/en'
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

// Mock child components to isolate Header
vi.mock('@/components/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}))

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: ({ className }: { className?: string }) => (
    <svg data-testid="menu-icon" className={className} />
  ),
  Settings: ({ className }: { className?: string }) => (
    <svg data-testid="settings-icon" className={className} />
  ),
  X: ({ className }: { className?: string }) => (
    <svg data-testid="x-icon" className={className} />
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/en'
    // Reset scrollY and innerWidth
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    })
  })

  describe('rendering', () => {
    it('renders logo with link to locale root', () => {
      render(<Header />)

      const logoLink = screen.getByRole('link', { name: /viscalyx/i })
      expect(logoLink).toHaveAttribute('href', '/en')

      const logoImage = within(logoLink).getByRole('img', {
        name: 'Viscalyx Logo',
      })
      expect(logoImage).toBeInTheDocument()
    })

    it('renders desktop navigation links with correct hrefs', () => {
      render(<Header />)

      const nav = screen.getByRole('navigation')

      // Section links should have locale prefix + hash
      const aboutLink = within(nav).getByRole('link', { name: 'about' })
      expect(aboutLink).toHaveAttribute('href', '/en#about')

      const openSourceLink = within(nav).getByRole('link', {
        name: 'openSource',
      })
      expect(openSourceLink).toHaveAttribute('href', '/en#open-source')

      // Page links should have locale prefix
      const teamLink = within(nav).getByRole('link', { name: 'team' })
      expect(teamLink).toHaveAttribute('href', '/en/team')

      const blogLink = within(nav).getByRole('link', { name: 'blog' })
      expect(blogLink).toHaveAttribute('href', '/en/blog')
    })

    it('renders mobile menu toggle button', () => {
      render(<Header />)

      // The mobile menu button has an aria-label
      const menuButton = screen.getByRole('button', { name: 'openMenu' })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('getHrefUrl behavior (via rendered hrefs)', () => {
    it('generates section links with locale prefix and hash', () => {
      render(<Header />)

      const aboutLink = screen.getByRole('link', { name: 'about' })
      expect(aboutLink).toHaveAttribute('href', '/en#about')
    })

    it('generates page links with locale prefix', () => {
      render(<Header />)

      const blogLink = screen.getByRole('link', { name: 'blog' })
      expect(blogLink).toHaveAttribute('href', '/en/blog')
    })

    it('does not duplicate locale in paths that already have one', () => {
      render(<Header />)

      // The team link href '/team' should become '/en/team', not '/en/en/team'
      const teamLink = screen.getByRole('link', { name: 'team' })
      const href = teamLink.getAttribute('href')
      expect(href).toBe('/en/team')
      expect(href).not.toContain('/en/en/')
    })
  })

  describe('scroll behavior', () => {
    it('does not have scrolled styling initially', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      expect(header.className).toContain('bg-transparent')
      expect(header.className).not.toContain('backdrop-blur')
    })

    it('gains scrolled styling after scrolling past threshold', () => {
      render(<Header />)

      // Simulate scroll past threshold (> 50px)
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          value: 100,
          writable: true,
        })
        fireEvent.scroll(window)
      })

      const header = screen.getByRole('banner')
      expect(header.className).toContain('backdrop-blur')
      expect(header.className).not.toContain('bg-transparent')
    })
  })

  describe('mobile menu', () => {
    it('mobile menu button has aria-expanded and aria-controls', () => {
      render(<Header />)

      const hamburgerButton = screen.getByRole('button', { name: 'openMenu' })
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu')

      fireEvent.click(hamburgerButton)

      const closeButton = screen.getByRole('button', { name: 'closeMenu' })
      expect(closeButton).toHaveAttribute('aria-expanded', 'true')
      expect(closeButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })

    it('mobile menu has navigation role and aria-label', () => {
      render(<Header />)

      const hamburgerButton = screen.getByRole('button', { name: 'openMenu' })
      fireEvent.click(hamburgerButton)

      // The mobile menu should be a nav element with an aria-label
      const mobileNav = screen.getByRole('navigation', { name: 'mobileMenu' })
      expect(mobileNav).toBeInTheDocument()
      expect(mobileNav).toHaveAttribute('aria-label', 'mobileMenu')
    })

    it('opens mobile menu when hamburger button is clicked', () => {
      render(<Header />)

      // Click the menu toggle
      const hamburgerButton = screen.getByRole('button', { name: 'openMenu' })
      fireEvent.click(hamburgerButton)

      // After opening, mobile menu links should be present (4 menu items rendered twice: desktop + mobile)
      const aboutLinks = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('closes mobile menu when toggle is clicked again', () => {
      render(<Header />)

      // Open menu
      const hamburgerButton = screen.getByRole('button', { name: 'openMenu' })
      fireEvent.click(hamburgerButton)

      // Menu is open — mobile links exist
      const aboutLinksOpen = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinksOpen.length).toBeGreaterThanOrEqual(2)

      // Close menu — re-query button (label changes to closeMenu)
      const closeButton = screen.getByRole('button', { name: 'closeMenu' })
      fireEvent.click(closeButton)

      // After closing, only desktop links remain
      const aboutLinksClose = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinksClose.length).toBe(1)
    })

    it('closes mobile menu when a navigation link is clicked', () => {
      render(<Header />)

      const hamburgerButton = screen.getByRole('button', { name: 'openMenu' })

      // Open menu
      fireEvent.click(hamburgerButton)

      // Get mobile menu links (the second set of links)
      const blogLinks = screen.getAllByRole('link', { name: 'blog' })
      const mobileLink = blogLinks[blogLinks.length - 1]

      fireEvent.click(mobileLink)

      // After clicking link, menu should close — fewer instances of 'about' link
      const aboutLinksAfter = screen.getAllByRole('link', { name: 'about' })
      // Should only have the desktop link
      expect(aboutLinksAfter.length).toBe(1)
    })
  })

  describe('settings dropdown', () => {
    it('opens settings dropdown when settings button is clicked', () => {
      render(<Header />)

      const settingsButtons = screen.getAllByRole('button', {
        name: 'settings.title',
      })
      fireEvent.click(settingsButtons[0])

      // Both desktop and mobile dropdowns open (shared isSettingsOpen state)
      const titles = screen.getAllByText('settings.title')
      expect(titles.length).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByText('settings.language').length
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByText('settings.theme').length
      ).toBeGreaterThanOrEqual(1)
    })

    it('has aria-expanded on settings buttons', () => {
      render(<Header />)

      const settingsButtons = screen.getAllByRole('button', {
        name: 'settings.title',
      })

      // Before clicking — collapsed
      settingsButtons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-expanded', 'false')
      })

      // After clicking — expanded
      fireEvent.click(settingsButtons[0])
      settingsButtons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('settings dropdown has dialog role and aria-label', () => {
      render(<Header />)

      const settingsButtons = screen.getAllByRole('button', {
        name: 'settings.title',
      })
      fireEvent.click(settingsButtons[0])

      const dialogs = screen.getAllByRole('dialog', {
        name: 'settings.title',
      })
      expect(dialogs.length).toBeGreaterThanOrEqual(1)
    })

    it('closes settings dropdown when clicking outside', () => {
      render(<Header />)

      const settingsButtons = screen.getAllByRole('button', {
        name: 'settings.title',
      })

      // Open settings
      fireEvent.click(settingsButtons[0])
      expect(
        screen.getAllByText('settings.title').length
      ).toBeGreaterThanOrEqual(1)

      // Simulate click outside — mock window.innerWidth to be desktop
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
      })
      fireEvent.mouseDown(document.body)

      // Settings should close
      expect(screen.queryByText('settings.title')).not.toBeInTheDocument()
    })

    it('contains language switcher and theme toggle', () => {
      render(<Header />)

      const settingsButtons = screen.getAllByRole('button', {
        name: 'settings.title',
      })

      fireEvent.click(settingsButtons[0])

      // Both desktop and mobile dropdowns contain these
      expect(
        screen.getAllByTestId('language-switcher').length
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByTestId('theme-toggle').length
      ).toBeGreaterThanOrEqual(1)
    })
  })

  describe('section link handling', () => {
    it('smooth-scrolls to section when on home page', () => {
      mockPathname = '/en'
      const mockElement = { scrollIntoView: vi.fn() }
      vi.spyOn(document, 'querySelector').mockReturnValue(
        mockElement as unknown as Element
      )
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
        (cb: FrameRequestCallback) => {
          cb(0)
          return 0
        }
      )

      render(<Header />)

      const aboutLink = screen.getAllByRole('link', { name: 'about' })[0]
      fireEvent.click(aboutLink)

      expect(document.querySelector).toHaveBeenCalledWith('#about')
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      })
    })

    it('does not prevent default navigation on non-home pages', () => {
      mockPathname = '/en/blog'

      const querySpy = vi.spyOn(document, 'querySelector')

      render(<Header />)

      const aboutLink = screen.getAllByRole('link', { name: 'about' })[0]
      fireEvent.click(aboutLink)

      // Should not call querySelector for smooth scroll on non-home page
      expect(querySpy).not.toHaveBeenCalledWith('#about')

      querySpy.mockRestore()
    })
  })
})
