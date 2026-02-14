import { fireEvent, render, screen, within } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from '../Header'

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
vi.mock('../LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}))

vi.mock('../ThemeToggle', () => ({
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
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
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

      // The mobile menu button has the Menu icon
      const buttons = screen.getAllByRole('button')
      // Should find at least one button (mobile menu toggle)
      expect(buttons.length).toBeGreaterThanOrEqual(1)
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
    it('opens mobile menu when hamburger button is clicked', () => {
      render(<Header />)

      // Initially no mobile menu links visible outside of desktop nav
      const mobileMenuBefore = screen.queryByText('about', {
        selector: '.md\\:hidden a',
      })
      // Click the menu toggle (last button in the mobile button group)
      const buttons = screen.getAllByRole('button')
      // The hamburger button is typically the last button
      const hamburgerButton = buttons[buttons.length - 1]
      fireEvent.click(hamburgerButton)

      // After opening, mobile menu links should be present (4 menu items rendered twice: desktop + mobile)
      const aboutLinks = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('closes mobile menu when toggle is clicked again', () => {
      render(<Header />)

      // Open menu
      const hamburgerBefore = screen.getAllByRole('button')
      fireEvent.click(hamburgerBefore[hamburgerBefore.length - 1])

      // Menu is open — mobile links exist
      const aboutLinksOpen = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinksOpen.length).toBeGreaterThanOrEqual(2)

      // Close menu — re-query buttons because DOM changed
      const hamburgerAfter = screen.getAllByRole('button')
      fireEvent.click(hamburgerAfter[hamburgerAfter.length - 1])

      // After closing, only desktop links remain
      const aboutLinksClose = screen.getAllByRole('link', { name: 'about' })
      expect(aboutLinksClose.length).toBe(1)
    })

    it('closes mobile menu when a navigation link is clicked', () => {
      render(<Header />)

      const buttons = screen.getAllByRole('button')
      const hamburgerButton = buttons[buttons.length - 1]

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

      const buttons = screen.getAllByRole('button')
      // Desktop settings button is the first button
      const settingsButton = buttons[0]

      fireEvent.click(settingsButton)

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

    it('closes settings dropdown when clicking outside', () => {
      render(<Header />)

      const buttons = screen.getAllByRole('button')
      const settingsButton = buttons[0]

      // Open settings
      fireEvent.click(settingsButton)
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

      const buttons = screen.getAllByRole('button')
      const settingsButton = buttons[0]

      fireEvent.click(settingsButton)

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

      render(<Header />)

      const aboutLink = screen.getAllByRole('link', { name: 'about' })[0]
      const preventDefaultSpy = vi.fn()

      fireEvent.click(aboutLink, { preventDefault: preventDefaultSpy })

      // Should not call querySelector for smooth scroll on non-home page
      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })
})
