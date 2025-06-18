'use client'

/**
 * Notification Component
 *
 * Note: This component is currently not used in the application but is ready for integration.
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
 * @param type - The type of notification to display ('success' | 'error' | 'warning' | 'info')
 * @param title - The title text displayed prominently in the notification
 * @param message - The detailed message content shown below the title
 * @param duration - Optional duration in milliseconds before auto-dismissal (defaults to auto-dismiss behavior)
 * @param onClose - Optional callback function triggered when the notification is closed
 * @returns A React element representing the notification toast component
 *
 * Note: Remember to update documentation and examples once this component is integrated into the application.
 */

import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
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
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      text: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-700',
    },
  }

  const Icon = icons[type]
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
            setTimeout(() => onClose?.(), 300)
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
