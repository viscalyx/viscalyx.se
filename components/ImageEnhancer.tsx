'use client'

import { useTranslations } from 'next-intl'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import ImageModal from './ImageModal'

interface ImageEnhancerProps {
  contentRef: React.RefObject<HTMLDivElement | null>
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ contentRef }) => {
  const t = useTranslations('blog')
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    imageSrc: string
    imageAlt: string
    triggerElement: HTMLElement | null
  }>({
    isOpen: false,
    imageSrc: '',
    imageAlt: '',
    triggerElement: null,
  })

  const enhancedRef = useRef(false)

  useEffect(() => {
    if (!contentRef.current || enhancedRef.current) return

    const content = contentRef.current
    if (!content) return

    let imageHandlers: Map<
      HTMLImageElement,
      {
        mouseEnter: () => void
        mouseLeave: () => void
        click: (event: Event) => void
        keydown: (event: KeyboardEvent) => void
      }
    > | null = null

    // Add a small delay to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      const images = content.querySelectorAll('img')

      imageHandlers = new Map<
        HTMLImageElement,
        {
          mouseEnter: () => void
          mouseLeave: () => void
          click: (event: Event) => void
          keydown: (event: KeyboardEvent) => void
        }
      >()

      // Add click handlers and hover effects to all images
      images.forEach(img => {
        const imageElement = img as HTMLImageElement

        // Skip if already enhanced
        if (imageElement.dataset.enhanced === 'true') return

        // Skip images wrapped in anchor tags to avoid button-inside-link
        if (imageElement.closest('a')) return

        // Create handlers
        const handleMouseEnter = () => {
          imageElement.style.transform =
            'perspective(1000px) rotateX(0deg) translateY(-5px)'
          imageElement.style.filter = 'brightness(1.05)'
        }

        const handleMouseLeave = () => {
          imageElement.style.transform =
            'perspective(1000px) rotateX(2deg) translateY(0)'
          imageElement.style.filter = 'brightness(1)'
        }

        const handleClick = (event: Event) => {
          event.preventDefault()
          event.stopPropagation()

          setModalState({
            isOpen: true,
            imageSrc: imageElement.src,
            imageAlt: imageElement.alt || '',
            triggerElement: imageElement,
          })
        }

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleClick(event)
          }
        }

        // Store handlers for cleanup
        imageHandlers?.set(imageElement, {
          mouseEnter: handleMouseEnter,
          mouseLeave: handleMouseLeave,
          click: handleClick,
          keydown: handleKeyDown,
        })

        // Add event listeners
        imageElement.addEventListener('mouseenter', handleMouseEnter)
        imageElement.addEventListener('mouseleave', handleMouseLeave)
        imageElement.addEventListener('click', handleClick)
        imageElement.addEventListener('keydown', handleKeyDown as EventListener)

        // Add accessibility attributes
        imageElement.setAttribute('role', 'button')
        imageElement.setAttribute('tabindex', '0')
        imageElement.setAttribute(
          'aria-label',
          imageElement.alt
            ? t('accessibility.image.viewFullImage', { alt: imageElement.alt })
            : t('accessibility.image.viewImage')
        )
        imageElement.style.cursor = 'pointer'

        // Mark as enhanced
        imageElement.dataset.enhanced = 'true'
      })

      enhancedRef.current = true
    }, 100) // 100ms delay to ensure DOM is fully ready

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)

      // Remove all event listeners
      if (imageHandlers) {
        imageHandlers.forEach((handlers, imageElement) => {
          imageElement.removeEventListener('mouseenter', handlers.mouseEnter)
          imageElement.removeEventListener('mouseleave', handlers.mouseLeave)
          imageElement.removeEventListener('click', handlers.click)
          imageElement.removeEventListener(
            'keydown',
            handlers.keydown as EventListener
          )

          // Remove accessibility attributes
          imageElement.removeAttribute('role')
          imageElement.removeAttribute('tabindex')
          imageElement.removeAttribute('aria-label')
          imageElement.style.cursor = ''

          // Reset the enhanced flag
          delete imageElement.dataset.enhanced
        })
        imageHandlers.clear()
      }

      // Allow re-enhancement if effect re-runs (e.g., locale change)
      enhancedRef.current = false
    }
  }, [contentRef, t])

  const closeModal = () => {
    setModalState({
      isOpen: false,
      imageSrc: '',
      imageAlt: '',
      triggerElement: null,
    })
  }

  return (
    <ImageModal
      imageAlt={modalState.imageAlt}
      imageSrc={modalState.imageSrc}
      isOpen={modalState.isOpen}
      onClose={closeModal}
      triggerElement={modalState.triggerElement}
    />
  )
}

export default ImageEnhancer
