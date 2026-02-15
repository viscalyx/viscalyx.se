'use client'

import type { CookieCategory } from '@/lib/cookie-consent'

interface CookieCategoryToggleProps {
  category: CookieCategory
  checked: boolean
  categoryName: string
  requiredLabel?: string
  onChange: (category: CookieCategory) => void
}

/**
 * Shared toggle switch for cookie categories.
 * Provides consistent sizing and behavior across
 * CookieConsentBanner and CookieSettings.
 *
 * @remarks
 * The `aria-describedby` attribute references `${category}-description`.
 * The parent component must render an element with that `id` to provide
 * a meaningful description to screen readers.
 */
const CookieCategoryToggle = ({
  category,
  checked,
  categoryName,
  requiredLabel = '',
  onChange,
}: CookieCategoryToggleProps) => {
  const isRequired = category === 'strictly-necessary'

  return (
    <label
      className={`relative inline-flex items-center ${isRequired ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(category)}
        disabled={isRequired}
        className="sr-only"
        aria-describedby={`${category}-description`}
        aria-label={`${categoryName} ${isRequired ? requiredLabel : ''}`.trim()}
        id={`toggle-${category}`}
      />
      <div
        className={`
          w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${
            checked
              ? 'bg-primary-600 dark:bg-primary-500'
              : 'bg-gray-300 dark:bg-gray-600'
          }
          ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        role="presentation"
      >
        <div
          className={`
            w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out transform mt-0.5 ml-0.5
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </div>
    </label>
  )
}

export default CookieCategoryToggle
