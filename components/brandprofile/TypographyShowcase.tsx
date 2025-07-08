'use client'

import { getAccentColors, getPrimaryColors, getSecondaryColors } from '@/lib/colors'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const TypographyShowcase = () => {
  const t = useTranslations('brandProfile.typographyShowcase')
  const [selectedTextColor, setSelectedTextColor] = useState('text-secondary-900 dark:text-secondary-100')

  // Get brand colors for typography
  const primaryColors = getPrimaryColors()
  const secondaryColors = getSecondaryColors()
  const accentColors = getAccentColors()

  // Define all text colors used across the site
  const textColors = [
    {
      name: 'Primary Text',
      lightClass: 'text-secondary-900',
      darkClass: 'dark:text-secondary-100',
      combinedClass: 'text-secondary-900 dark:text-secondary-100',
      hex: '#111827',
      darkHex: '#f9fafb',
      usage: 'Main headings, primary content'
    },
    {
      name: 'Secondary Text',
      lightClass: 'text-secondary-600',
      darkClass: 'dark:text-secondary-400',
      combinedClass: 'text-secondary-600 dark:text-secondary-400',
      hex: '#4b5563',
      darkHex: '#9ca3af',
      usage: 'Body text, descriptions'
    },
    {
      name: 'Tertiary Text',
      lightClass: 'text-secondary-700',
      darkClass: 'dark:text-secondary-300',
      combinedClass: 'text-secondary-700 dark:text-secondary-300',
      hex: '#374151',
      darkHex: '#d1d5db',
      usage: 'Strong body text, emphasized content'
    },
    {
      name: 'Muted Text',
      lightClass: 'text-secondary-500',
      darkClass: 'dark:text-secondary-500',
      combinedClass: 'text-secondary-500 dark:text-secondary-500',
      hex: '#6b7280',
      darkHex: '#6b7280',
      usage: 'Labels, captions, subtle text'
    },
    {
      name: 'Brand Primary',
      lightClass: 'text-primary-600',
      darkClass: 'dark:text-primary-400',
      combinedClass: 'text-primary-600 dark:text-primary-400',
      hex: '#0277bd',
      darkHex: '#38bdf8',
      usage: 'Links, CTAs, brand elements'
    },
    {
      name: 'Success',
      lightClass: 'text-green-600',
      darkClass: 'dark:text-green-400',
      combinedClass: 'text-green-600 dark:text-green-400',
      hex: '#16a34a',
      darkHex: '#4ade80',
      usage: 'Alternative success states'
    },
    // {
    //   name: 'Success Alternative',
    //   lightClass: 'text-[#065f46]',
    //   darkClass: 'dark:text-[#86efac]',
    //   combinedClass: 'text-[#065f46] dark:text-[#86efac]',
    //   hex: '#065f46',
    //   darkHex: '#86efac',
    //   usage: 'Success backgrounds with opacity'
    // },
    {
      name: 'Warning Amber',
      lightClass: 'text-[#f59e0b]',
      darkClass: 'dark:text-[#f59e0b]',
      combinedClass: 'text-[#f59e0b] dark:text-[#f59e0b]',
      hex: '#f59e0b',
      darkHex: '#f59e0b',
      usage: 'Primary warnings, cautions'
    },
    {
      name: 'Warning Yellow',
      lightClass: 'text-yellow-600',
      darkClass: 'dark:text-yellow-400',
      combinedClass: 'text-yellow-600 dark:text-yellow-400',
      hex: '#ca8a04',
      darkHex: '#facc15',
      usage: 'Alternative warning states'
    },
    {
      name: 'Warning Dark',
      lightClass: 'text-yellow-900',
      darkClass: 'dark:text-yellow-100',
      combinedClass: 'text-yellow-900 dark:text-yellow-100',
      hex: '#713f12',
      darkHex: '#fefce8',
      usage: 'Warning text on colored backgrounds'
    },
    {
      name: 'Warning Alternative',
      lightClass: 'text-[#92400e]',
      darkClass: 'dark:text-[#fcd34d]',
      combinedClass: 'text-[#92400e] dark:text-[#fcd34d]',
      hex: '#92400e',
      darkHex: '#fcd34d',
      usage: 'Warning backgrounds with opacity'
    },
    {
      name: 'Error Red',
      lightClass: 'text-[#ef4444]',
      darkClass: 'dark:text-[#ef4444]',
      combinedClass: 'text-[#ef4444] dark:text-[#ef4444]',
      hex: '#ef4444',
      darkHex: '#ef4444',
      usage: 'Primary errors, destructive actions'
    },
    {
      name: 'Error Alternative',
      lightClass: 'text-red-600',
      darkClass: 'dark:text-red-400',
      combinedClass: 'text-red-600 dark:text-red-400',
      hex: '#dc2626',
      darkHex: '#f87171',
      usage: 'Alternative error states'
    },
    {
      name: 'Error Dark',
      lightClass: 'text-[#991b1b]',
      darkClass: 'dark:text-[#fca5a5]',
      combinedClass: 'text-[#991b1b] dark:text-[#fca5a5]',
      hex: '#991b1b',
      darkHex: '#fca5a5',
      usage: 'Error backgrounds with opacity'
    },
    {
      name: 'Info Blue',
      lightClass: 'text-[#3b82f6]',
      darkClass: 'dark:text-[#3b82f6]',
      combinedClass: 'text-[#3b82f6] dark:text-[#3b82f6]',
      hex: '#3b82f6',
      darkHex: '#3b82f6',
      usage: 'Primary information, tips'
    },
    {
      name: 'Info Alternative',
      lightClass: 'text-blue-600',
      darkClass: 'dark:text-blue-400',
      combinedClass: 'text-blue-600 dark:text-blue-400',
      hex: '#2563eb',
      darkHex: '#60a5fa',
      usage: 'Links, alternative info states'
    },
    {
      name: 'Gold/Rating',
      lightClass: 'text-[#facc15]',
      darkClass: 'dark:text-[#facc15]',
      combinedClass: 'text-[#facc15] dark:text-[#facc15]',
      hex: '#facc15',
      darkHex: '#facc15',
      usage: 'Star ratings, achievements, gold accents'
    },
    {
      name: 'Orange Accent',
      lightClass: 'text-orange-500',
      darkClass: 'dark:text-orange-500',
      combinedClass: 'text-orange-500 dark:text-orange-500',
      hex: '#f97316',
      darkHex: '#f97316',
      usage: 'Orange UI elements, warnings'
    },
    {
      name: 'Gray Alternative',
      lightClass: 'text-gray-600',
      darkClass: 'dark:text-gray-400',
      combinedClass: 'text-gray-600 dark:text-gray-400',
      hex: '#4b5563',
      darkHex: '#9ca3af',
      usage: 'Alternative gray text'
    },
    {
      name: 'Terminal Green',
      lightClass: 'text-green-400',
      darkClass: 'dark:text-green-400',
      combinedClass: 'text-green-400 dark:text-green-400',
      hex: '#4ade80',
      darkHex: '#4ade80',
      usage: 'Terminal/code text'
    },
    {
      name: 'White Text',
      lightClass: 'text-white',
      darkClass: 'dark:text-white',
      combinedClass: 'text-white dark:text-white',
      hex: '#ffffff',
      darkHex: '#ffffff',
      usage: 'Text on dark backgrounds'
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
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Typography Colors & Interactive Preview
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Complete collection of all text colors used across the site. Click on any color to apply it to all typography examples below and see how it looks in different contexts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {textColors.map(color => (
            <button
              key={color.name}
              onClick={() => setSelectedTextColor(color.combinedClass)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
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
                <span className="font-medium text-secondary-900 dark:text-secondary-100">
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
            </button>
          ))}
        </div>
      </div>

      {/* Font Sizes Section */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
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
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          {t('fontWeights')}
        </h2>
        <div className="space-y-4">
          {fontWeights.map(weight => (
            <div key={weight.name} className="flex items-center space-x-6">
              <div className="w-32 text-sm text-secondary-600 dark:text-secondary-400">
                {weight.name}
              </div>
              <div className="flex-1">
                <div className={`${weight.weight} text-lg ${selectedTextColor}`}>
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
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
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
              Body text using the selected color with base font size and normal weight.
            </p>
          </div>

          <div>
            <h3 className={`text-xl font-medium ${selectedTextColor} mb-2`}>
              Subsection Heading (text-xl font-medium)
            </h3>
            <p className={`text-sm ${selectedTextColor}`}>
              Small text using the selected color for captions or secondary information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypographyShowcase
