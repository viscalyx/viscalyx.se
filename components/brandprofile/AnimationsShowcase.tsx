'use client'

import { motion } from 'framer-motion'
import { Circle, Sparkles, Square } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ComponentDemo from './ComponentDemo'

const AnimationsShowcase = () => {
  const t = useTranslations('brandProfile.animationsShowcase')

  return (
    <div className="space-y-12">
      <ComponentDemo
        title={t('fadeIn.title')}
        description={t('fadeIn.description')}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center"
        >
          <p className="text-primary-700 dark:text-primary-300">
            {t('fadeIn.content')}
          </p>
        </motion.div>
      </ComponentDemo>

      <ComponentDemo
        title={t('slideUp.title')}
        description={t('slideUp.description')}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="p-6 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-center"
        >
          <p className="text-secondary-700 dark:text-secondary-300">
            {t('slideUp.content')}
          </p>
        </motion.div>
      </ComponentDemo>

      <ComponentDemo
        title={t('hoverInteractions.title')}
        description={t('hoverInteractions.description')}
      >
        <div className="flex flex-wrap gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 text-left"
            aria-label={t('hoverInteractions.scaleHover')}
          >
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.scaleHover')}
            </p>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ rotate: 5 }}
            whileFocus={{ rotate: 5 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 text-left"
            aria-label={t('hoverInteractions.rotateHover')}
          >
            <Circle className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.rotateHover')}
            </p>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -5 }}
            whileFocus={{ y: -5 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 text-left"
            aria-label={t('hoverInteractions.liftHover')}
          >
            <Square className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.liftHover')}
            </p>
          </motion.button>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default AnimationsShowcase
