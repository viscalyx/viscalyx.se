'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import LoadingSpinner from '@/components/LoadingSpinner'

interface LoadingScreenProps {
  message?: string
  type?: 'loading' | 'redirecting'
}

const LoadingScreen = ({ message, type = 'loading' }: LoadingScreenProps) => {
  const t = useTranslations('loadingScreen')
  const defaultMessage =
    type === 'redirecting' ? t('redirecting') : t('loading')

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="mb-4">
          <LoadingSpinner color="primary" size="lg" />
        </div>
        <p className="text-secondary-600 dark:text-secondary-300">
          {message || defaultMessage}
        </p>
      </div>
    </motion.main>
  )
}

export default LoadingScreen
