'use client'

import dynamic from 'next/dynamic'

// Dynamically import CookieSettings as client-side only component
const CookieSettings = dynamic(() => import('./CookieSettings'), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  ),
})

const CookieSettingsWrapper = () => {
  return <CookieSettings />
}

export default CookieSettingsWrapper
