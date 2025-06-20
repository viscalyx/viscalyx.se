'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'secondary'
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    secondary: 'text-secondary-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
    >
      <Loader2
        data-icon="loader-2"
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
      />
    </motion.div>
  )
}

export default LoadingSpinner
