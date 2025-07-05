'use client'

import { motion } from 'framer-motion'
import { Circle, Sparkles, Square } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
          >
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.scaleHover')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ rotate: 5 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
          >
            <Circle className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.rotateHover')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer"
          >
            <Square className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              {t('hoverInteractions.liftHover')}
            </p>
          </motion.div>
        </div>
      </ComponentDemo>
    </div>
  )
}

export default AnimationsShowcase
