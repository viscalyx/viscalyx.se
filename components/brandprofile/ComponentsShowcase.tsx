'use client'

import { AlertCircle, Check, Info, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ComponentDemo from './ComponentDemo'

const ComponentsShowcase = () => {
  const t = useTranslations('brandProfile.componentsShowcase')

  return (
    <div className="space-y-12">
      <ComponentDemo
        title={t('buttons.title')}
        description={t('buttons.description')}
      >
        <div className="flex flex-wrap gap-4">
          <button type="button" className="btn-primary">
            {t('buttons.primary')}
          </button>
          <button type="button" className="btn-secondary">
            {t('buttons.secondary')}
          </button>
          <button type="button" className="btn-primary" disabled>
            {t('buttons.disabled')}
          </button>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('cards.title')}
        description={t('cards.description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              {t('cards.cardTitle')}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {t('cards.cardDescription')}
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 card-hover">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              {t('cards.anotherCard')}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {t('cards.anotherCardDescription')}
            </p>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('alerts.title')}
        description={t('alerts.description')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-[#059669]/10 dark:bg-[#059669]/20 border border-success-dark/30 dark:border-success-dark/50 rounded-lg">
            <Check className="w-5 h-5 text-success-dark" />
            <span className="text-success-dark">{t('alerts.success')}</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 border border-[#f59e0b]/30 dark:border-[#f59e0b]/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-[#f59e0b] dark:text-[#f59e0b]" />
            <span className="text-[#f59e0b] dark:text-[#f59e0b]">
              {t('alerts.warning')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#ef4444]/10 dark:bg-[#ef4444]/20 border border-[#ef4444]/30 dark:border-[#ef4444]/50 rounded-lg">
            <X className="w-5 h-5 text-[#ef4444] dark:text-[#ef4444]" />
            <span className="text-[#ef4444] dark:text-[#ef4444]">
              {t('alerts.error')}
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#3b82f6]/10 dark:bg-[#3b82f6]/20 border border-[#3b82f6]/30 dark:border-[#3b82f6]/50 rounded-lg">
            <Info className="w-5 h-5 text-[#3b82f6] dark:text-[#3b82f6]" />
            <span className="text-[#3b82f6] dark:text-[#3b82f6]">
              {t('alerts.info')}
            </span>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('forms.title')}
        description={t('forms.description')}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="showcase-email"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >
              {t('forms.emailLabel')}
            </label>
            <input
              id="showcase-email"
              type="email"
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
              placeholder={t('forms.emailPlaceholder')}
            />
          </div>
          <div>
            <label
              htmlFor="showcase-message"
              className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >
              {t('forms.messageLabel')}
            </label>
            <textarea
              id="showcase-message"
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
              rows={4}
              placeholder={t('forms.messagePlaceholder')}
            />
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('backgroundBorderColors.title')}
        description={t('backgroundBorderColors.description')}
      >
        <div className="space-y-8">
          {/* Background Colors Section */}
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('backgroundBorderColors.backgroundTitle')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Primary
                </h5>
                <div className="space-y-2">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-primary-50 / dark:bg-primary-900/20
                    </span>
                  </div>
                  <div className="bg-primary-100 p-3 rounded border">
                    <span className="text-xs font-mono">bg-primary-100</span>
                  </div>
                  <div className="bg-primary-600 p-3 rounded border text-white">
                    <span className="text-xs font-mono">bg-primary-600</span>
                  </div>
                  <div className="bg-primary-900/30 p-3 rounded border">
                    <span className="text-xs font-mono">bg-primary-900/30</span>
                  </div>
                  <div className="bg-primary-900/50 p-3 rounded border">
                    <span className="text-xs font-mono">bg-primary-900/50</span>
                  </div>
                </div>
              </div>

              {/* Secondary Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Secondary
                </h5>
                <div className="space-y-2">
                  <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-secondary-50 / dark:bg-secondary-800
                    </span>
                  </div>
                  <div className="bg-secondary-100 dark:bg-secondary-700 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-secondary-100 / dark:bg-secondary-700
                    </span>
                  </div>
                  <div className="bg-secondary-200 dark:bg-secondary-600 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-secondary-200 / dark:bg-secondary-600
                    </span>
                  </div>
                  <div className="bg-secondary-800 dark:bg-secondary-100 p-3 rounded border text-white dark:text-black">
                    <span className="text-xs font-mono">
                      bg-secondary-800 / dark:bg-secondary-100
                    </span>
                  </div>
                  <div className="bg-secondary-900 dark:bg-secondary-50 p-3 rounded border text-white dark:text-black">
                    <span className="text-xs font-mono">
                      bg-secondary-900 / dark:bg-secondary-50
                    </span>
                  </div>
                </div>
              </div>

              {/* Surface & Container Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Surface & Container
                </h5>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-secondary-900 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-white / dark:bg-secondary-900
                    </span>
                  </div>
                  <div className="bg-white/80 dark:bg-secondary-800/80 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-white/80 / dark:bg-secondary-800/80
                    </span>
                  </div>
                  <div className="bg-white/90 dark:bg-secondary-900/90 p-3 rounded border">
                    <span className="text-xs font-mono">
                      bg-white/90 / dark:bg-secondary-900/90
                    </span>
                  </div>
                  <div className="bg-transparent p-3 rounded border border-dashed">
                    <span className="text-xs font-mono">bg-transparent</span>
                  </div>
                </div>
              </div>

              {/* Semantic Color Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Semantic Colors
                </h5>
                <div className="space-y-2">
                  <div className="bg-[#3b82f6]/10 dark:bg-[#3b82f6]/20 p-3 rounded border border-[#3b82f6]/30">
                    <span className="text-xs font-mono text-[#3b82f6]">
                      Info (bg-[#3b82f6]/10)
                    </span>
                  </div>
                  <div className="bg-[#059669]/10 dark:bg-[#059669]/20 p-3 rounded border border-success-dark/30">
                    <span className="text-xs font-mono text-success-dark">
                      Success (bg-[#059669]/10)
                    </span>
                  </div>
                  <div className="bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 p-3 rounded border border-[#f59e0b]/30">
                    <span className="text-xs font-mono text-[#f59e0b]">
                      Warning (bg-[#f59e0b]/10)
                    </span>
                  </div>
                  <div className="bg-[#ef4444]/10 dark:bg-[#ef4444]/20 p-3 rounded border border-[#ef4444]/30">
                    <span className="text-xs font-mono text-[#ef4444]">
                      Error (bg-[#ef4444]/10)
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Visualization Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Data Visualization
                </h5>
                <div className="space-y-2">
                  <div className="bg-[#3b82f6] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-1 (#3b82f6)</span>
                  </div>
                  <div className="bg-[#6366f1] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-2 (#6366f1)</span>
                  </div>
                  <div className="bg-[#0ea5e9] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-3 (#0ea5e9)</span>
                  </div>
                  <div className="bg-[#06b6d4] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-4 (#06b6d4)</span>
                  </div>
                  <div className="bg-[#ef4444] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-5 (#ef4444)</span>
                  </div>
                  <div className="bg-[#22c55e] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-6 (#22c55e)</span>
                  </div>
                  <div className="bg-[#a855f7] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-7 (#a855f7)</span>
                  </div>
                  <div className="bg-[#4b5563] p-3 rounded border text-white">
                    <span className="text-xs font-mono">viz-8 (#4b5563)</span>
                  </div>
                </div>
              </div>

              {/* Gradient Backgrounds */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Gradients
                </h5>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-3 rounded border text-white">
                    <span className="text-xs font-mono">
                      from-primary-600 to-primary-800
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-700 p-3 rounded border text-white">
                    <span className="text-xs font-mono">
                      from-primary-600 to-secondary-700
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-800/50 p-3 rounded border">
                    <span className="text-xs font-mono">
                      from-primary-50 to-secondary-50
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-primary-100/30 dark:from-primary-900/20 to-secondary-100/30 dark:to-secondary-800/20 p-3 rounded border">
                    <span className="text-xs font-mono">
                      from-primary-100/30 to-secondary-100/30
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-white dark:from-secondary-800 to-transparent p-3 rounded border">
                    <span className="text-xs font-mono">
                      from-white to-transparent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Border Colors Section */}
          <div>
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('backgroundBorderColors.borderTitle')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Primary Borders */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Primary
                </h5>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-2 border-primary-500">
                    <span className="text-xs font-mono">
                      border-primary-500
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-2 border-primary-600 dark:border-primary-400">
                    <span className="text-xs font-mono">
                      border-primary-600 / dark:border-primary-400
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-l-4 border-primary-300 dark:border-primary-600">
                    <span className="text-xs font-mono">
                      border-l-4 border-primary-300 / dark:border-primary-600
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Borders */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Secondary
                </h5>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-700">
                    <span className="text-xs font-mono">
                      border-secondary-100 / dark:border-secondary-700
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600">
                    <span className="text-xs font-mono">
                      border-secondary-200 / dark:border-secondary-600
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-secondary-300 dark:border-secondary-500">
                    <span className="text-xs font-mono">
                      border-secondary-300 / dark:border-secondary-500
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-l-4 border-secondary-400 dark:border-secondary-500">
                    <span className="text-xs font-mono">
                      border-l-4 border-secondary-400 /
                      dark:border-secondary-500
                    </span>
                  </div>
                </div>
              </div>

              {/* Semantic Borders */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Semantic
                </h5>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-[#3b82f6]/30 dark:border-[#3b82f6]/50">
                    <span className="text-xs font-mono text-[#3b82f6]">
                      Info border-[#3b82f6]/30
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-success-dark/30 dark:border-success-dark/50">
                    <span className="text-xs font-mono text-success-dark">
                      Success border-success-dark/30
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-[#f59e0b]/30 dark:border-[#f59e0b]/50">
                    <span className="text-xs font-mono text-[#f59e0b]">
                      Warning border-[#f59e0b]/30
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-[#ef4444]/30 dark:border-[#ef4444]/50">
                    <span className="text-xs font-mono text-[#ef4444]">
                      Error border-[#ef4444]/30
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Borders */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Special
                </h5>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-white">
                    <span className="text-xs font-mono">border-white</span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border border-transparent">
                    <span className="text-xs font-mono">
                      border-transparent
                    </span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-2 border-dashed border-secondary-300 dark:border-secondary-600">
                    <span className="text-xs font-mono">border-dashed</span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-secondary-900 border-t-4 border-t-secondary-900 dark:border-t-secondary-100">
                    <span className="text-xs font-mono">
                      border-t-4 border-t-secondary-900
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              {t('backgroundBorderColors.guidelinesTitle')}
            </h4>
            <div className="space-y-3 text-sm text-secondary-700 dark:text-secondary-300">
              <p>
                <strong>Primary colors:</strong> Use for main brand elements,
                CTAs, and active states
              </p>
              <p>
                <strong>Secondary colors:</strong> Use for text, borders, and
                neutral backgrounds
              </p>
              <p>
                <strong>Semantic colors:</strong> Use for alerts, status
                indicators, and feedback messages
              </p>
              <p>
                <strong>Data visualization:</strong> Use the viz-* colors for
                charts and data presentations
              </p>
              <p>
                <strong>Gradients:</strong> Use sparingly for hero sections and
                special highlights
              </p>
              <p>
                <strong>Transparency:</strong> Use /10, /20, /30, /50 opacity
                variants for overlays and subtle backgrounds
              </p>
            </div>
          </div>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default ComponentsShowcase
