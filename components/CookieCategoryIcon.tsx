'use client'

import { BarChart3, Cookie, Palette, Shield } from 'lucide-react'

import type { CookieCategory } from '@/lib/cookie-consent'
import type { JSX } from 'react'

interface CookieCategoryIconProps {
  category: CookieCategory
}

/**
 * Renders the appropriate icon for a cookie category.
 * Shared between CookieConsentBanner and CookieSettings.
 */
const CookieCategoryIcon = ({
  category,
}: CookieCategoryIconProps): JSX.Element => {
  switch (category) {
    case 'strictly-necessary':
      return <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
    case 'analytics':
      return <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    case 'preferences':
      return (
        <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      )
    default:
      return <Cookie className="w-5 h-5" />
  }
}

export default CookieCategoryIcon
