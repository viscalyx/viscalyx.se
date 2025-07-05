'use client'

import { useTranslations } from 'next-intl'

const TypographyShowcase = () => {
  const t = useTranslations('brandProfile.typographyShowcase')
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
                <div
                  className={`${font.name} text-secondary-900 dark:text-secondary-100`}
                >
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
                <div
                  className={`${weight.weight} text-lg text-secondary-900 dark:text-secondary-100`}
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
    </div>
  )
}

export default TypographyShowcase
