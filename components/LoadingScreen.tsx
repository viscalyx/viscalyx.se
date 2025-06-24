'use client'

import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

interface LoadingScreenProps {
  message?: string
  type?: 'loading' | 'redirecting'
}

const LoadingScreen = ({ message, type = 'loading' }: LoadingScreenProps) => {
  const defaultMessage =
    type === 'redirecting' ? 'Redirecting...' : 'Loading...'

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <div className="mb-4">
          <LoadingSpinner size="lg" color="primary" />
        </div>
        <p className="text-secondary-600 dark:text-secondary-300">
          {message || defaultMessage}
        </p>
      </div>
    </motion.main>
  )
}

export default LoadingScreen
