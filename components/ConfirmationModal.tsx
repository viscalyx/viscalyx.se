'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type ReactNode, useEffect, useId, useRef } from 'react'

interface ComponentProps {
  cancelText: string
  closeAriaLabel?: string
  confirmIcon?: ReactNode
  confirmLoading?: boolean
  confirmText: string
  isOpen: boolean
  message: string
  onClose: () => void
  onConfirm: () => void
  title: string
  variant?: 'danger' | 'warning' | 'info'
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
  confirmLoading = false,
  confirmIcon,
  closeAriaLabel,
}: ComponentProps) => {
  const t = useTranslations('confirmationModal')
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const resolvedCloseAriaLabel = closeAriaLabel ?? t('closeAriaLabel')

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          ),
          confirmButton:
            'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
        }
      case 'warning':
        return {
          icon: (
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          ),
          confirmButton:
            'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white',
          iconBg: 'bg-orange-100 dark:bg-orange-900/20',
        }
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
          confirmButton:
            'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            data-testid="modal-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-describedby={descriptionId}
              aria-labelledby={titleId}
              aria-modal="true"
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-auto pointer-events-auto"
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={event => event.stopPropagation()}
              ref={modalRef}
              role="dialog"
              tabIndex={-1}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <h2
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                    id={titleId}
                  >
                    {title}
                  </h2>
                </div>
                <button
                  aria-label={resolvedCloseAriaLabel}
                  className="min-h-[44px] min-w-[44px] p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-900"
                  onClick={onClose}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6"
                  id={descriptionId}
                >
                  {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    aria-label={cancelText}
                    className="min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-900"
                    disabled={confirmLoading}
                    onClick={onClose}
                    type="button"
                  >
                    {cancelText}
                  </button>
                  <button
                    aria-label={confirmText}
                    className={`min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton}`}
                    disabled={confirmLoading}
                    onClick={onConfirm}
                    type="button"
                  >
                    {confirmLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {confirmText}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {confirmIcon}
                        {confirmText}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmationModal
