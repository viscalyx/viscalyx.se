'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BlueskyIcon,
  GitHubIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from './SocialIcons'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')
  const locale = useLocale()

  const handleNavigation = (href: string) => {
    // Check if it's a section link (starts with #)
    if (href.startsWith('#')) {
      // If we're not on the home page, navigate to home first
      const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/'
      if (currentPath !== '/') {
        router.push(`/${locale}/${href}`)
      } else {
        // We're already on home page, just scroll to section
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // Regular page navigation or external links
      if (href === '#') {
        // Do nothing for placeholder links
        return
      } else if (href.startsWith('http')) {
        // External link
        window.open(href, '_blank', 'noopener noreferrer')
      } else {
        // Internal page navigation - preserve locale
        const cleanHref = href.startsWith('/') ? href : `/${href}`
        router.push(`/${locale}${cleanHref}`)
      }
    }
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
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
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 text-white"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6">{t('company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline bg-transparent border-none cursor-pointer text-left p-0"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.name}>
                  {link.href.startsWith('#') || link.href.startsWith('http') ? (
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.href)}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline flex items-center bg-transparent border-none cursor-pointer text-left p-0"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline flex items-center"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6">{t('support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  {link.href.startsWith('#') || link.href.startsWith('http') ? (
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.href)}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline flex items-center bg-transparent border-none cursor-pointer text-left p-0"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline flex items-center"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-center"
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
