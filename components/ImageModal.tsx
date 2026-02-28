'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useEffect, useRef } from 'react'

interface ImageModalProps {
  imageAlt: string
  imageSrc: string
  isOpen: boolean
  onClose: () => void
  triggerElement?: HTMLElement | null
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  triggerElement,
}) => {
  const t = useTranslations('blog')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current =
        triggerElement || (document.activeElement as HTMLElement)
      // Auto-focus close button when modal opens
      closeButtonRef.current?.focus()
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [isOpen, triggerElement])

  // Handle keyboard: escape to close, tab trap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'Tab') {
        // Focus trap: only one focusable element (close button), prevent Tab from escaping
        event.preventDefault()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-label={imageAlt || t('accessibility.image.imagePreview')}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            data-testid="image-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-flex max-w-[95vw] max-h-[95vh]"
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              aria-label={t('accessibility.image.closeImagePreview')}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black"
              onClick={event => {
                event.stopPropagation()
                onClose()
              }}
              ref={closeButtonRef}
              type="button"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <motion.div
              className="flex items-center justify-center p-4"
              onClick={event => event.stopPropagation()}
            >
              <Image
                alt={imageAlt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                height={1000}
                priority
                sizes="(max-width: 1555px) 90vw, 1400px"
                src={imageSrc}
                style={{
                  maxWidth: 'min(90vw, 1400px)',
                  maxHeight: 'min(85vh, 1000px)',
                }}
                unoptimized
                width={1400}
              />
            </motion.div>

            {/* Image Caption */}
            {imageAlt && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 text-white p-3 sm:p-4 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                onClick={event => event.stopPropagation()}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm leading-relaxed">{imageAlt}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageModal
