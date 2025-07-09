'use client'

/**
 * Notification Component
 *
 * A reusable toast notification component that displays temporary messages to users.
 * This component provides visual feedback for user actions and system events.
 *
 * Features:
 * - Four notification types: success, error, warning, info
 * - Auto-dismissal with configurable duration
 * - Manual dismissal with close button
 * - Smooth animations using Framer Motion
 * - Fixed positioning (top-right corner)
 * - Responsive design with proper color schemes
 *
 * Potential Use Cases:
 * - Contact form submission feedback
 * - Newsletter signup confirmations
 * - Error handling and user alerts
 * - Loading states and process completion
 * - General user action confirmations
 *
 * Usage Example:
 * ```tsx
 * <Notification
 *   type="success"
 *   title="Success!"
 *   message="Your message has been sent successfully."
 *   duration={5000}
 *   onClose={() => setShowNotification(false)}
 * />
 * ```
 *
 * @component
 * @param {('success' | 'error' | 'warning' | 'info')} type - Notification type
 * @param {string} title - Title text
 * @param {string} message - Message content
 * @param {number} [duration] - Auto-dismiss duration in milliseconds
 * @param {() => void} [onClose] - Close callback
 * @returns {JSX.Element} React notification component
 *
 * @note This component is ready for integration but not currently used in the application.
 * Remember to update documentation and examples once integrated.
 */

import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

const Notification = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true)
  // Refs to track auto-hide and close timers
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (duration > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        closeTimeoutRef.current = setTimeout(() => onClose?.(), 300)
      }, duration)
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: {
      bg: 'bg-secondary-50 dark:bg-secondary-800',
      border: 'border-secondary-200 dark:border-secondary-700',
      icon: 'text-success-content',
      title: 'text-secondary-900 dark:text-secondary-100',
      text: 'text-secondary-700 dark:text-secondary-300',
    },
    error: {
      bg: 'bg-secondary-50 dark:bg-secondary-800',
      border: 'border-secondary-200 dark:border-secondary-700',
      icon: 'text-[#ef4444]',
      title: 'text-secondary-900 dark:text-secondary-100',
      text: 'text-secondary-700 dark:text-secondary-300',
    },
    warning: {
      bg: 'bg-secondary-50 dark:bg-secondary-800',
      border: 'border-secondary-200 dark:border-secondary-700',
      icon: 'text-[#f59e0b]',
      title: 'text-secondary-900 dark:text-secondary-100',
      text: 'text-secondary-700 dark:text-secondary-300',
    },
    info: {
      bg: 'bg-secondary-50 dark:bg-secondary-800',
      border: 'border-secondary-200 dark:border-secondary-700',
      icon: 'text-[#3b82f6]',
      title: 'text-secondary-900 dark:text-secondary-100',
      text: 'text-secondary-700 dark:text-secondary-300',
    },
  }

  const Icon = icons[type]
  // Ensure colorScheme is always defined based on the type
  const colorScheme = colors[type]

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 max-w-sm w-full ${colorScheme.bg} ${colorScheme.border} border rounded-lg shadow-lg p-4`}
    >
      <div className="flex items-start">
        <Icon
          className={`w-5 h-5 ${colorScheme.icon} mt-0.5 mr-3 flex-shrink-0`}
        />
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${colorScheme.title} mb-1`}>
            {title}
          </h4>
          <p className={`text-sm ${colorScheme.text}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            // Clear any existing timers before scheduling close
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = setTimeout(() => onClose?.(), 300)
          }}
          className={`ml-3 ${colorScheme.icon} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default Notification
