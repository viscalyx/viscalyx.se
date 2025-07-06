'use client'

import { motion } from 'framer-motion'
import {
  Eye,
  MousePointer,
  Palette,
  Sparkles,
  Square,
  Type,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import AccessibilityShowcase from './AccessibilityShowcase'
import AnimationsShowcase from './AnimationsShowcase'
import ColorShowcase from './ColorShowcase'
import ComponentsShowcase from './ComponentsShowcase'
import IconsShowcase from './IconsShowcase'
import TypographyShowcase from './TypographyShowcase'

const BrandShowcase = () => {
  const t = useTranslations('brandProfile')
  const [activeTab, setActiveTab] = useState('colors')

  const tabs = [
    { id: 'colors', label: t('tabs.colors'), icon: Palette },
    { id: 'typography', label: t('tabs.typography'), icon: Type },
    { id: 'components', label: t('tabs.components'), icon: Square },
    { id: 'icons', label: t('tabs.icons'), icon: Sparkles },
    { id: 'animations', label: t('tabs.animations'), icon: MousePointer },
    { id: 'accessibility', label: t('tabs.accessibility'), icon: Eye },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'colors':
        return <ColorShowcase />
      case 'typography':
        return <TypographyShowcase />
      case 'components':
        return <ComponentsShowcase />
      case 'icons':
        return <IconsShowcase />
      case 'animations':
        return <AnimationsShowcase />
      case 'accessibility':
        return <AccessibilityShowcase />
      default:
        return <ColorShowcase />
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-gradient mb-4"
            >
              {t('title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto"
            >
              {t('description')}
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div
              role="tablist"
              aria-label={t('tabNavigation')}
              className="flex space-x-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg"
            >
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="space-y-12"
          >
            {renderActiveTab()}
          </motion.div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </motion.main>
  )
}

export default BrandShowcase
