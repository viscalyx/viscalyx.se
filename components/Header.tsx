'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Settings, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

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
    // Check if it's an absolute URL (external link)
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:')
    ) {
      return href
    }

    if (href.startsWith('#')) {
      // For section links, link to home page with hash
      return `/${locale}${href}`
    } else {
      // Regular page navigation - preserve locale
      const cleanHref = href.startsWith('/') ? href : `/${href}`
      return `/${locale}${cleanHref}`
    }
  }

  // Handle click for section links that need smooth scrolling
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Always close the mobile menu when any link is clicked
    setIsMenuOpen(false)
    
    // Only prevent default and handle custom logic for section links on the same page
    if (href.startsWith('#')) {
      const currentPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
      if (currentPath === '/') {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const menuItems = [
    { name: t('about'), href: '#about' },
    { name: t('services'), href: '#services' },
    { name: t('team'), href: '/team' },
    { name: t('caseStudies'), href: '/case-studies' },
    { name: t('blog'), href: '/blog' },
    { name: t('openSource'), href: '#open-source' },
    { name: t('contact'), href: '#contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-custom shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom section-padding py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Image
                src="/favicon-32x32.png"
                alt="Viscalyx Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-gradient">Viscalyx</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={getHrefUrl(item.href)}
                  onClick={e => handleLinkClick(e, item.href)}
                  className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 cursor-pointer inline-block"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 py-2 z-10"
                  >
                    <div className="px-3 py-2 text-sm font-medium text-secondary-500 dark:text-secondary-400 border-b border-secondary-200 dark:border-secondary-700">
                      {t('settings.title')}
                    </div>

                    <div className="p-3 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('settings.language')}
                        </label>
                        <LanguageSwitcher />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          {t('settings.theme')}
                        </label>
                        <ThemeToggle />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={getHrefUrl('#contact')}
                onClick={e => handleLinkClick(e, '#contact')}
                className="btn-primary inline-block"
              >
                {t('getStarted')}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="relative" ref={mobileSettingsRef}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-xl border border-secondary-200 dark:border-secondary-700 py-2 z-10"
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
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white dark:bg-secondary-800 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={getHrefUrl(item.href)}
                      onClick={e => handleLinkClick(e, item.href)}
                      className="block w-full text-left px-6 py-3 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="px-6 pt-2">
                  <Link
                    href={getHrefUrl('#contact')}
                    onClick={e => handleLinkClick(e, '#contact')}
                    className="btn-primary w-full text-center block"
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header
