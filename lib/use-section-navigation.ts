'use client'

import { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
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
  options: UseSectionNavigationOptions = {}
): { handleNavigation: (href: string) => void } => {
  const { handleExternalLinks = false } = options
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = useCallback(
    (href: string) => {
      // Section link (starts with #)
      if (href.startsWith('#')) {
        if (pathname !== '/') {
          // Navigate to home page with hash
          router.push(`/${href}`)
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
        window.open(href, '_blank', 'noopener noreferrer')
        return
      }

      // Regular page navigation
      router.push(href as Route)
    },
    [pathname, router, handleExternalLinks]
  )

  return { handleNavigation }
}
