'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  BlueskyIcon,
  GitHubIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from '@/components/SocialIcons'

interface FooterLink {
  href: string
  name: string
}

const ABSOLUTE_URL_REGEX = /^[a-z][a-z0-9+.-]*:/i

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')
  const locale = useLocale()

  const isExternal = (href: string): boolean => {
    return ABSOLUTE_URL_REGEX.test(href) || href.startsWith('//')
  }

  // Helper function to generate proper URLs for links
  const getHrefUrl = (href: string): string => {
    if (isExternal(href)) {
      return href
    }

    if (href.startsWith('#')) {
      return `/${locale}${href}`
    }

    const cleanHref = href.startsWith('/') ? href : `/${href}`
    return `/${locale}${cleanHref}`
  }

  // Handle click for section links that need smooth scrolling
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('#')) {
      const currentPath =
        pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/'
      if (currentPath === '/' || currentPath === '') {
        e.preventDefault()
        requestAnimationFrame(() => {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }
    }
  }

  const renderLink = (link: FooterLink) => {
    if (isExternal(link.href)) {
      return (
        <a
          className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline flex items-center"
          href={link.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.name}
          <ExternalLink
            aria-hidden="true"
            className="w-3 h-3 ml-1 opacity-60"
          />
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      )
    }

    return (
      <Link
        className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline"
        href={getHrefUrl(link.href) as Route}
        onClick={e => handleLinkClick(e, link.href)}
      >
        {link.name}
      </Link>
    )
  }

  const footerLinks = {
    company: [
      { name: t('aboutUs'), href: '#about' },
      { name: tNav('openSource'), href: '#open-source' },
    ],
    resources: [
      { name: tNav('blog'), href: '/blog' },
      { name: t('community'), href: 'https://dsccommunity.org/' },
    ],
    support: [
      { name: t('privacyPolicy'), href: '/privacy' },
      { name: t('termsOfService'), href: '/terms' },
      { name: t('cookiePolicy'), href: '/cookies' },
    ],
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/viscalyx',
      icon: GitHubIcon,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/viscalyx',
      icon: LinkedInIcon,
    },
    {
      name: 'X',
      href: 'https://x.com/viscalyx',
      icon: XIcon,
    },
    {
      name: 'Bluesky',
      href: 'https://bsky.app/profile/viscalyx.com',
      icon: BlueskyIcon,
    },
    {
      name: 'Mastodon',
      href: 'https://mastodon.social/@viscalyx',
      icon: MastodonIcon,
    },
    {
      name: 'Email',
      href: 'mailto:info@viscalyx.se',
      icon: Mail,
    },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gradient mb-4">
                Viscalyx
              </h3>
              <p className="text-secondary-300 leading-relaxed">
                {t('companyDescription')}
              </p>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <motion.a
                  aria-label={social.name}
                  className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 text-white"
                  href={social.href}
                  key={social.name}
                  rel="noopener noreferrer"
                  target="_blank"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold mb-6">{t('company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold mb-6">{t('resources')}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-lg font-semibold mb-6">{t('support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-secondary-400 text-sm">
              © {currentYear} Viscalyx. {t('allRightsReserved')}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
