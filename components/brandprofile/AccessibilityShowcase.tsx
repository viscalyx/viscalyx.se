'use client'

import { getAccessibilityInfo } from '@/lib/colors'
import { AlertCircle, CheckCircle, Download, Eye, Palette } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'

interface ComponentDemoProps {
  title: string
  description: string
  children: ReactNode
}

const ComponentDemo = ({
  title,
  description,
  children,
}: ComponentDemoProps) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
        {title}
      </h4>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        {description}
      </p>
    </div>
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
      {children}
    </div>
  </div>
)

interface ContrastTestProps {
  name: string
  foreground: string
  background: string
  ratio: number
  passes: boolean
}

const ContrastTest = ({
  name,
  foreground,
  background,
  ratio,
  passes,
}: ContrastTestProps) => (
  <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="flex space-x-1">
        <div
          className="w-6 h-6 rounded border border-secondary-300 dark:border-secondary-600"
          style={{ backgroundColor: foreground }}
        />
        <div
          className="w-6 h-6 rounded border border-secondary-300 dark:border-secondary-600"
          style={{ backgroundColor: background }}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
          {name}
        </p>
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          Ratio: {ratio.toFixed(2)}:1
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      {passes ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span
        className={`text-xs font-medium ${passes ? 'text-green-600' : 'text-red-600'}`}
      >
        {passes ? 'WCAG AA' : 'Fails'}
      </span>
    </div>
  </div>
)

interface ColorBlindSimulationProps {
  original: string
  protanopia: string
  deuteranopia: string
  tritanopia: string
  name: string
}

const ColorBlindSimulation = ({
  original,
  protanopia,
  deuteranopia,
  tritanopia,
  name,
}: ColorBlindSimulationProps) => (
  <div className="space-y-2">
    <h5 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
      {name}
    </h5>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg border border-secondary-300 dark:border-secondary-600 mx-auto mb-1"
          style={{ backgroundColor: original }}
        />
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          Normal
        </p>
      </div>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg border border-secondary-300 dark:border-secondary-600 mx-auto mb-1"
          style={{ backgroundColor: protanopia }}
        />
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          Protanopia
        </p>
      </div>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg border border-secondary-300 dark:border-secondary-600 mx-auto mb-1"
          style={{ backgroundColor: deuteranopia }}
        />
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          Deuteranopia
        </p>
      </div>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-lg border border-secondary-300 dark:border-secondary-600 mx-auto mb-1"
          style={{ backgroundColor: tritanopia }}
        />
        <p className="text-xs text-secondary-600 dark:text-secondary-400">
          Tritanopia
        </p>
      </div>
    </div>
  </div>
)

const AccessibilityShowcase = () => {
  const t = useTranslations('brandProfile.accessibility')
  const [selectedFilter, setSelectedFilter] = useState<
    'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  >('normal')
  const accessibilityInfo = getAccessibilityInfo()

  const filterClass = {
    normal: '',
    protanopia: 'filter-protanopia',
    deuteranopia: 'filter-deuteranopia',
    tritanopia: 'filter-tritanopia',
  }

  return (
    <div className="space-y-12">
      <ComponentDemo
        title={t('focusStates.title')}
        description={t('focusStates.description')}
      >
        <div className="space-y-4">
          <button
            type="button"
            className="btn-primary focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800"
          >
            {t('focusStates.buttonText')}
          </button>
          <input
            type="text"
            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-100"
            placeholder={t('focusStates.inputPlaceholder')}
          />
          <a
            href="#"
            className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded underline"
          >
            {t('focusStates.linkText')}
          </a>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Color Contrast Testing"
        description="Automated testing ensures all color combinations meet WCAG AA contrast requirements (4.5:1 ratio minimum)."
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-primary-600" />
            <h5 className="font-medium text-secondary-900 dark:text-secondary-100">
              Contrast Test Results
            </h5>
          </div>
          <div className="space-y-2">
            {accessibilityInfo.contrastTests.map((test, index) => (
              <ContrastTest key={index} {...test} />
            ))}
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Color Vision Deficiency Simulation"
        description="Preview how colors appear to users with different types of color blindness to ensure inclusivity."
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-primary-600" />
            <h5 className="font-medium text-secondary-900 dark:text-secondary-100">
              Color Blindness Simulation
            </h5>
          </div>

          <div className="space-y-4">
            <ColorBlindSimulation
              name="Primary Color (Brand Blue)"
              {...accessibilityInfo.colorBlindSimulation.primary600}
            />
            <ColorBlindSimulation
              name="Secondary Color (Gray)"
              {...accessibilityInfo.colorBlindSimulation.secondary600}
            />
          </div>

          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h6 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
              Interactive Color Filter Preview
            </h6>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'normal',
                    'protanopia',
                    'deuteranopia',
                    'tritanopia',
                  ] as const
                ).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div
                className={`p-4 bg-white dark:bg-secondary-800 rounded-lg border ${filterClass[selectedFilter]}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
                  <div className="w-8 h-8 bg-secondary-600 rounded-lg"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                  <div className="w-8 h-8 bg-red-500 rounded-lg"></div>
                </div>
                <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                  Color preview with {selectedFilter} filter applied
                </p>
              </div>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo
        title={t('colorContrast.title')}
        description={t('colorContrast.description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              {t('colorContrast.goodContrast')}
            </h4>
            <div className="p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded">
              <p className="text-secondary-900 dark:text-secondary-100">
                {t('colorContrast.contrastText')}
              </p>
            </div>
            <div className="p-3 bg-primary-600 rounded">
              <p className="text-white">{t('colorContrast.whiteOnPrimary')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100">
              {t('colorContrast.screenReaderSupport')}
            </h4>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded">
              <p className="text-secondary-700 dark:text-secondary-300">
                {t('colorContrast.ariaText')}
              </p>
              <button
                type="button"
                className="mt-2 btn-secondary"
                aria-label={t('colorContrast.downloadLabel')}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('colorContrast.downloadText')}
              </button>
            </div>
          </div>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default AccessibilityShowcase
