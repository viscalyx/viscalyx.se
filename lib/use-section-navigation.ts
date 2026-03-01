'use client'

import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCallback } from 'react'

interface UseSectionNavigationOptions {
  /** Whether to handle external URLs via window.open. Defaults to false. */
  handleExternalLinks?: boolean
}

/**
 * Hook for section-based navigation with smooth scrolling.
 * Handles hash links (#section), external URLs, and regular page navigation.
 */
export const useSectionNavigation = (
  options: UseSectionNavigationOptions = {},
): { handleNavigation: (href: string) => void } => {
  const { handleExternalLinks = false } = options
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  // Strip locale prefix from pathname to get the locale-independent path
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), '') || '/'

  const handleNavigation = useCallback(
    (href: string) => {
      // Section link (starts with #)
      if (href.startsWith('#')) {
        if (pathWithoutLocale !== '/') {
          // Navigate to locale home page with hash
          router.push(`/${locale}${href}` as Route)
        } else {
          // Already on home page — smooth scroll to section
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        return
      }

      // External links
      if (handleExternalLinks && href.startsWith('http')) {
        window.open(href, '_blank', 'noopener noreferrer') // cSpell:disable-line
        return
      }

      // Regular page navigation
      router.push(href as Route)
    },
    [pathWithoutLocale, locale, router, handleExternalLinks],
  )

  return { handleNavigation }
}
