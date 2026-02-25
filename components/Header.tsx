'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Settings, X } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { locales } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

const MotionLink = motion.create(Link)

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const mobileSettingsRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSettingsOpen) {
        const target = event.target as HTMLElement

        const isOutsideDesktopSettings =
          settingsRef.current && !settingsRef.current.contains(target)
        const isOutsideMobileSettings =
          mobileSettingsRef.current &&
          !mobileSettingsRef.current.contains(target)

        // Close settings if click is outside the settings container
        const isDesktop = window.innerWidth >= 768 // md breakpoint
        if (isDesktop && isOutsideDesktopSettings) {
          setIsSettingsOpen(false)
        } else if (!isDesktop && isOutsideMobileSettings) {
          setIsSettingsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSettingsOpen])

  // Helper function to generate proper URLs for links
  const getHrefUrl = (href: string) => {
    // Enhanced absolute URL detection using regex to cover all protocols
    const absoluteUrlRegex = /^[a-z][a-z0-9+.-]*:/i

    // Check if it's an absolute URL (external link) or special protocols
    if (absoluteUrlRegex.test(href) || href.startsWith('//')) {
      return href
    }

    if (href.startsWith('#')) {
      // For section links, link to home page with hash
      return `/${locale}${href}`
    } else {
      // Regular page navigation - preserve locale
      const cleanHref = href.startsWith('/') ? href : `/${href}`

      // Check if the path already starts with a locale prefix to avoid duplication
      const pathSegments = cleanHref.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]

      // Normalize the first segment by converting to lowercase and trimming slashes
      const normalizedFirstSegment = firstSegment
        ?.toLowerCase()
        .replace(/\/$/, '')

      if (
        normalizedFirstSegment &&
        locales.includes(normalizedFirstSegment as (typeof locales)[number])
      ) {
        // Path already has a locale, return as-is
        return cleanHref
      } else {
        // Add locale prefix, ensuring no double slashes
        return `/${locale}${cleanHref}`
      }
    }
  }

  // Handle click for section links that need smooth scrolling
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Always close the mobile menu when any link is clicked
    setIsMenuOpen(false)

    // Handle section links on the same page (home page)
    if (href.startsWith('#')) {
      // Remove locale from path and check if we're on the home page
      const currentPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
      // Check if we're on the home page (with or without hash)
      if (currentPath === '/' || currentPath === '') {
        e.preventDefault()
        // Ensure DOM has updated after menu closes before scrolling
        requestAnimationFrame(() => {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }
    }
  }

  const menuItems = [
    { name: t('about'), href: '#about' },
    { name: t('openSource'), href: '#open-source' },
    { name: t('team'), href: '/team' },
    { name: t('blog'), href: '/blog' },
  ]

  return (
    <motion.header
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-custom shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
    >
      <nav className="container-custom section-padding py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center space-x-2" href={`/${locale}`}>
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                alt="Viscalyx Logo"
                className="h-8 w-8"
                height={32}
                src="/favicon-32x32.png"
                width={32}
              />
              <span className="text-2xl font-bold text-gradient">Viscalyx</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <MotionLink
                animate={{ opacity: 1, y: 0 }}
                className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 cursor-pointer inline-block"
                href={getHrefUrl(item.href) as Route}
                initial={{ opacity: 0, y: -20 }}
                key={item.name}
                onClick={e => handleLinkClick(e, item.href)}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
              </MotionLink>
            ))}

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <motion.button
                aria-controls="desktop-settings-menu"
                aria-expanded={isSettingsOpen}
                aria-label={t('settings.title')}
                className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    aria-label={t('settings.title')}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 py-2 z-10"
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    id="desktop-settings-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    role="dialog"
                  >
                    <div className="px-3 py-2 text-sm font-medium text-secondary-500 dark:text-secondary-400 border-b border-secondary-200 dark:border-secondary-700">
                      {t('settings.title')}
                    </div>

                    <div className="p-3 space-y-4">
                      <div>
                        <p className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('settings.language')}
                        </p>
                        <LanguageSwitcher />
                      </div>

                      <div>
                        <p className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('settings.theme')}
                        </p>
                        <ThemeToggle />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={mobileSettingsRef}>
              <motion.button
                aria-controls="mobile-settings-menu"
                aria-expanded={isSettingsOpen}
                aria-label={t('settings.title')}
                className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    aria-label={t('settings.title')}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 py-2 z-10"
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    id="mobile-settings-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    role="dialog"
                  >
                    <div className="px-3 py-2 text-sm font-medium text-secondary-500 dark:text-secondary-400 border-b border-secondary-200 dark:border-secondary-700">
                      {t('settings.title')}
                    </div>

                    <div className="p-3 space-y-4">
                      <div>
                        <LanguageSwitcher />
                      </div>

                      <div>
                        <ThemeToggle />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
              className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              animate={{ opacity: 1, height: 'auto' }}
              aria-label={t('mobileMenu')}
              className="md:hidden mt-4 bg-white dark:bg-secondary-800 rounded-lg shadow-xl overflow-hidden"
              exit={{ opacity: 0, height: 0 }}
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    key={item.name}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      className="block w-full text-left px-6 py-3 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200 cursor-pointer"
                      href={getHrefUrl(item.href) as Route}
                      onClick={e => handleLinkClick(e, item.href)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header
