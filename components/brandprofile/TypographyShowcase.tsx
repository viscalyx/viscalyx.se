'use client'

import {
  getAccentColors,
  getPrimaryColors,
  getSecondaryColors,
} from '@/lib/colors'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

const TypographyShowcase = () => {
  const t = useTranslations('brandProfile.typographyShowcase')
  const [selectedTextColor, setSelectedTextColor] = useState(
    'text-primary-content'
  )

  // Get brand colors for typography
  const primaryColors = getPrimaryColors()
  const secondaryColors = getSecondaryColors()
  const accentColors = getAccentColors()

  // Memoized color map for O(1) lookup with case-insensitive matching
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {}

    // Add all colors to the map with lowercase keys for consistent lookup
    primaryColors.forEach(color => {
      map[color.name.toLowerCase()] = color.hex
    })

    secondaryColors.forEach(color => {
      map[color.name.toLowerCase()] = color.hex
    })

    accentColors.forEach(color => {
      map[color.name.toLowerCase()] = color.hex
    })

    return map
  }, [primaryColors, secondaryColors, accentColors])

  // Helper function to find color hex from our color constants
  const getColorHex = (colorName: string): string => {
    // Normalize input to lowercase for consistent lookup
    const normalizedName = colorName.toLowerCase()
    const colorHex = colorMap[normalizedName]

    if (colorHex) return colorHex

    // Fallback for colors not in our constants yet
    return colorName.startsWith('#') ? colorName : '#000000'
  }

  // Define all text colors used across the site
  const textColors = [
    {
      name: 'Primary Text',
      lightClass: 'text-primary-content',
      darkClass: 'text-primary-content',
      combinedClass: 'text-primary-content',
      hex: getColorHex('secondary-900'), // #111827
      darkHex: getColorHex('secondary-50'), // #f9fafb
      usage: 'Main headings, primary content',
    },
    {
      name: 'Secondary Text',
      lightClass: 'text-secondary-content',
      darkClass: 'text-secondary-content',
      combinedClass: 'text-secondary-content',
      hex: getColorHex('secondary-600'), // #4b5563
      darkHex: getColorHex('secondary-400'), // #9ca3af
      usage: 'Body text, descriptions',
    },
    {
      name: 'Tertiary Text',
      lightClass: 'text-tertiary-content',
      darkClass: 'text-tertiary-content',
      combinedClass: 'text-tertiary-content',
      hex: getColorHex('secondary-700'), // #374151
      darkHex: getColorHex('secondary-300'), // #d1d5db
      usage: 'Strong body text, emphasized content',
    },
    {
      name: 'Muted Text',
      lightClass: 'text-muted-content',
      darkClass: 'text-muted-content',
      combinedClass: 'text-muted-content',
      hex: getColorHex('secondary-500'), // #6b7280
      darkHex: getColorHex('secondary-500'), // #6b7280
      usage: 'Labels, captions, subtle text',
    },
    {
      name: 'Brand Primary',
      lightClass: 'text-brand-primary',
      darkClass: 'text-brand-primary',
      combinedClass: 'text-brand-primary',
      hex: getColorHex('primary-600'), // #0277bd
      darkHex: getColorHex('primary-400'), // #38bdf8
      usage: 'Links, CTAs, brand elements',
    },
    {
      name: 'Success',
      lightClass: 'text-success-content',
      darkClass: 'text-success-content',
      combinedClass: 'text-success-content',
      hex: getColorHex('Success'), // #059669 (close to #16a34a)
      darkHex: '#4ade80', // Keep as fallback since not in constants
      usage: 'Success states, positive feedback',
    },
    {
      name: 'Success Dark',
      lightClass: 'text-success-dark',
      darkClass: 'text-success-dark',
      combinedClass: 'text-success-dark',
      hex: '#065f46', // Keep as fallback
      darkHex: '#86efac', // Keep as fallback
      usage: 'Darker success text, success on light backgrounds',
    },
    {
      name: 'Warning Amber',
      lightClass: 'text-warning-amber',
      darkClass: 'text-warning-amber',
      combinedClass: 'text-warning-amber',
      hex: getColorHex('Warning'), // #f59e0b
      darkHex: getColorHex('Warning'), // #f59e0b
      usage: 'Primary warnings, cautions',
    },
    {
      name: 'Warning Yellow',
      lightClass: 'text-warning-yellow',
      darkClass: 'text-warning-yellow',
      combinedClass: 'text-warning-yellow',
      hex: '#ca8a04', // Keep as fallback
      darkHex: getColorHex('Gold'), // #facc15
      usage: 'Alternative warning states',
    },
    {
      name: 'Warning Dark',
      lightClass: 'text-warning-dark',
      darkClass: 'text-warning-dark',
      combinedClass: 'text-warning-dark',
      hex: '#713f12', // Keep as fallback
      darkHex: '#fefce8', // Keep as fallback
      usage: 'Warning text on colored backgrounds',
    },
    {
      name: 'Warning Alternative',
      lightClass: 'text-warning-alternative',
      darkClass: 'text-warning-alternative',
      combinedClass: 'text-warning-alternative',
      hex: '#92400e', // Keep as fallback
      darkHex: '#fcd34d', // Keep as fallback
      usage: 'Warning backgrounds with opacity',
    },
    {
      name: 'Error Red',
      lightClass: 'text-error-red',
      darkClass: 'text-error-red',
      combinedClass: 'text-error-red',
      hex: getColorHex('Error'), // #ef4444
      darkHex: getColorHex('Error'), // #ef4444
      usage: 'Primary errors, destructive actions',
    },
    {
      name: 'Error Alternative',
      lightClass: 'text-error-alternative',
      darkClass: 'text-error-alternative',
      combinedClass: 'text-error-alternative',
      hex: '#dc2626', // Keep as fallback
      darkHex: '#f87171', // Keep as fallback
      usage: 'Alternative error states',
    },
    {
      name: 'Error Dark',
      lightClass: 'text-error-dark',
      darkClass: 'text-error-dark',
      combinedClass: 'text-error-dark',
      hex: '#991b1b', // Keep as fallback
      darkHex: '#fca5a5', // Keep as fallback
      usage: 'Error backgrounds with opacity',
    },
    {
      name: 'Info Blue',
      lightClass: 'text-info-blue',
      darkClass: 'text-info-blue',
      combinedClass: 'text-info-blue',
      hex: getColorHex('Info'), // #3b82f6
      darkHex: getColorHex('Info'), // #3b82f6
      usage: 'Primary information, tips',
    },
    {
      name: 'Info Alternative',
      lightClass: 'text-info-alternative',
      darkClass: 'text-info-alternative',
      combinedClass: 'text-info-alternative',
      hex: '#1d4ed8', // Keep as fallback
      darkHex: '#60a5fa', // Keep as fallback
      usage: 'Links, alternative info states',
    },
    {
      name: 'Info Dark',
      lightClass: 'text-info-dark',
      darkClass: 'text-info-dark',
      combinedClass: 'text-info-dark',
      hex: '#1e40af', // Keep as fallback
      darkHex: '#93c5fd', // Keep as fallback
      usage: 'Dark info text, info on light backgrounds',
    },
    {
      name: 'Gold/Rating',
      lightClass: 'text-[#facc15]',
      darkClass: 'dark:text-[#facc15]',
      combinedClass: 'text-[#facc15] dark:text-[#facc15]',
      hex: getColorHex('Gold'), // #facc15
      darkHex: getColorHex('Gold'), // #facc15
      usage: 'Star ratings, achievements, gold accents',
    },
    {
      name: 'Orange Accent',
      lightClass: 'text-orange-500',
      darkClass: 'dark:text-orange-500',
      combinedClass: 'text-orange-500 dark:text-orange-500',
      hex: '#f97316', // Keep as fallback (not in constants)
      darkHex: '#f97316', // Keep as fallback
      usage: 'Orange UI elements, warnings',
    },
    {
      name: 'Gray Alternative',
      lightClass: 'text-gray-600',
      darkClass: 'dark:text-gray-400',
      combinedClass: 'text-gray-600 dark:text-gray-400',
      hex: getColorHex('secondary-600'), // #4b5563
      darkHex: getColorHex('secondary-400'), // #9ca3af
      usage: 'Alternative gray text',
    },
    {
      name: 'Terminal Green',
      lightClass: 'text-green-400',
      darkClass: 'dark:text-green-400',
      combinedClass: 'text-green-400 dark:text-green-400',
      hex: '#4ade80', // Keep as fallback (not in constants)
      darkHex: '#4ade80', // Keep as fallback
      usage: 'Terminal/code text',
    },
    {
      name: 'White Text',
      lightClass: 'text-white',
      darkClass: 'dark:text-white',
      combinedClass: 'text-white dark:text-white',
      hex: '#ffffff', // Keep as is
      darkHex: '#ffffff', // Keep as is
      usage: 'Text on dark backgrounds',
    },
  ]
  const fontSizes = [
    { name: 'text-xs', size: '0.75rem', pixels: '12px', usage: 'Small labels' },
    { name: 'text-sm', size: '0.875rem', pixels: '14px', usage: 'Small text' },
    { name: 'text-base', size: '1rem', pixels: '16px', usage: 'Body text' },
    { name: 'text-lg', size: '1.125rem', pixels: '18px', usage: 'Large body' },
    { name: 'text-xl', size: '1.25rem', pixels: '20px', usage: 'Large text' },
    {
      name: 'text-2xl',
      size: '1.5rem',
      pixels: '24px',
      usage: 'Small headings',
    },
    {
      name: 'text-3xl',
      size: '1.875rem',
      pixels: '30px',
      usage: 'Medium headings',
    },
    {
      name: 'text-4xl',
      size: '2.25rem',
      pixels: '36px',
      usage: 'Large headings',
    },
    { name: 'text-5xl', size: '3rem', pixels: '48px', usage: 'Hero headings' },
  ]

  const fontWeights = [
    {
      weight: 'font-light',
      name: 'Light (300)',
      usage: 'Subtle text',
    },
    {
      weight: 'font-normal',
      name: 'Regular (400)',
      usage: 'Body text',
    },
    {
      weight: 'font-medium',
      name: 'Medium (500)',
      usage: 'Emphasized text',
    },
    {
      weight: 'font-semibold',
      name: 'Semibold (600)',
      usage: 'Subheadings',
    },
    {
      weight: 'font-bold',
      name: 'Bold (700)',
      usage: 'Headings',
    },
    {
      weight: 'font-extrabold',
      name: 'Extrabold (800)',
      usage: 'Hero text',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Text Colors Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary-content mb-6">
          Typography Colors & Interactive Preview
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Complete collection of all text colors used across the site. Click on
          any color to apply it to all typography examples below and see how it
          looks in different contexts.
        </p>
        <div id="color-selection-description" className="sr-only">
          Choose a text color to preview how the typography looks with different
          color schemes. The selected color will be applied to text elements in
          the preview below.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {textColors.map(color => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedTextColor(color.combinedClass)}
              aria-pressed={selectedTextColor === color.combinedClass}
              aria-label={`Select ${color.name} color for typography preview`}
              aria-describedby="color-selection-description"
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                selectedTextColor === color.combinedClass
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-6 h-6 rounded-full border border-secondary-200 dark:border-secondary-600"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-medium text-primary-content">
                  {color.name}
                </span>
              </div>
              <div className="space-y-1">
                <div className={`text-lg font-semibold ${color.combinedClass}`}>
                  Sample Text
                </div>
                <div className="text-xs text-secondary-500 dark:text-secondary-500 space-y-1">
                  <div>Light: {color.hex}</div>
                  <div>Dark: {color.darkHex}</div>
                  <div className="italic">{color.usage}</div>
                </div>
              </div>
              <span className="sr-only">
                {selectedTextColor === color.combinedClass
                  ? 'Currently selected: '
                  : 'Select '}
                {color.name} color
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Sizes Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary-content mb-6">
          {t('fontSizes')}
        </h2>
        <div className="space-y-6">
          {fontSizes.map(font => (
            <div key={font.name} className="flex items-center space-x-6">
              <div className="w-20 text-sm text-secondary-600 dark:text-secondary-400">
                {font.name}
              </div>
              <div className="w-16 text-sm text-secondary-600 dark:text-secondary-400">
                {font.pixels}
              </div>
              <div className="flex-1">
                <div className={`${font.name} ${selectedTextColor}`}>
                  {t('sampleText')}
                </div>
              </div>
              <div className="text-sm text-secondary-500 dark:text-secondary-500 italic">
                {font.usage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary-content mb-6">
          {t('fontWeights')}
        </h2>
        <div className="space-y-4">
          {fontWeights.map(weight => (
            <div key={weight.name} className="flex items-center space-x-6">
              <div className="w-32 text-sm text-secondary-600 dark:text-secondary-400">
                {weight.name}
              </div>
              <div className="flex-1">
                <div
                  className={`${weight.weight} text-lg ${selectedTextColor}`}
                >
                  {t('brandText')}
                </div>
              </div>
              <div className="text-sm text-secondary-500 dark:text-secondary-500 italic">
                {weight.usage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Combinations */}
      <div>
        <h2 className="text-2xl font-bold text-primary-content mb-6">
          Typography Examples
        </h2>
        <div className="space-y-8 p-6 border border-secondary-200 dark:border-secondary-700 rounded-lg">
          <div>
            <h1 className={`text-4xl font-bold ${selectedTextColor} mb-2`}>
              Large Heading (text-4xl font-bold)
            </h1>
            <p className={`text-lg ${selectedTextColor}`}>
              This is a paragraph using the selected color with large text size.
            </p>
          </div>

          <div>
            <h2 className={`text-2xl font-semibold ${selectedTextColor} mb-2`}>
              Section Heading (text-2xl font-semibold)
            </h2>
            <p className={`text-base ${selectedTextColor}`}>
              Body text using the selected color with base font size and normal
              weight.
            </p>
          </div>

          <div>
            <h3 className={`text-xl font-medium ${selectedTextColor} mb-2`}>
              Subsection Heading (text-xl font-medium)
            </h3>
            <p className={`text-sm ${selectedTextColor}`}>
              Small text using the selected color for captions or secondary
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypographyShowcase
