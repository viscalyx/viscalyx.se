'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface LoadingSpinnerProps {
  color?: 'primary' | 'white' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
}: LoadingSpinnerProps) => {
  const t = useTranslations('loadingSpinner')

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    white: 'text-white',
    secondary: 'text-secondary-600 dark:text-secondary-400',
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label={t('ariaLabel')}
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      role="status"
    >
      <Loader2
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        data-icon="loader-2"
      />
    </motion.div>
  )
}

export default LoadingSpinner
