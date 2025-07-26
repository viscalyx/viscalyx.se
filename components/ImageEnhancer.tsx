'use client'

import React, { useEffect, useRef, useState } from 'react'
import ImageModal from './ImageModal'

interface ImageEnhancerProps {
  contentRef: React.RefObject<HTMLDivElement | null>
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ contentRef }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    imageSrc: string
    imageAlt: string
  }>({
    isOpen: false,
    imageSrc: '',
    imageAlt: '',
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
        }
      >()

      // Add click handlers and hover effects to all images
      images.forEach(img => {
        const imageElement = img as HTMLImageElement

        // Skip if already enhanced
        if (imageElement.dataset.enhanced === 'true') return

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
          })
        }

        // Store handlers for cleanup
        imageHandlers!.set(imageElement, {
          mouseEnter: handleMouseEnter,
          mouseLeave: handleMouseLeave,
          click: handleClick,
        })

        // Add event listeners
        imageElement.addEventListener('mouseenter', handleMouseEnter)
        imageElement.addEventListener('mouseleave', handleMouseLeave)
        imageElement.addEventListener('click', handleClick)

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

          // Reset the enhanced flag
          delete imageElement.dataset.enhanced
        })
        imageHandlers.clear()
      }
    }
  }, [contentRef])

  const closeModal = () => {
    setModalState({
      isOpen: false,
      imageSrc: '',
      imageAlt: '',
    })
  }

  return (
    <ImageModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      imageSrc={modalState.imageSrc}
      imageAlt={modalState.imageAlt}
    />
  )
}

export default ImageEnhancer
