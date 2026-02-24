'use client'

import type React from 'react'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertIcon, type AlertIconProps } from './BlogIcons'

interface AlertIconInjectorProps {
  children: React.ReactNode
  contentKey?: string // Add a key to track content changes
}

export const AlertIconInjector: React.FC<AlertIconInjectorProps> = ({
  children,
  contentKey,
}) => {
  useEffect(() => {
    // Store references to created roots for cleanup
    const roots: Array<{
      root: ReturnType<typeof createRoot>
      container: Element
    }> = []

    // Use a timeout to ensure the DOM has been updated with new content
    const timeoutId = setTimeout(() => {
      // First, clean up any existing icon containers to avoid duplicates
      const existingContainers = document.querySelectorAll(
        '.alert-icon-container'
      )
      existingContainers.forEach(container => container.remove())

      // Find all alert titles that need icons
      const alertTitles = document.querySelectorAll(
        '.github-alert-title[data-alert-icon]'
      )

      alertTitles.forEach(titleElement => {
        const iconType = titleElement.getAttribute(
          'data-alert-icon'
        ) as AlertIconProps['type']

        if (
          iconType &&
          ['note', 'tip', 'important', 'warning', 'caution'].includes(iconType)
        ) {
          // Create a container for the icon
          const iconContainer = document.createElement('span')
          iconContainer.className =
            'alert-icon-container inline-flex items-center mr-2'

          // Insert the icon container at the beginning of the title
          titleElement.insertBefore(iconContainer, titleElement.firstChild)

          // Render the React icon component into the container
          const root = createRoot(iconContainer)
          root.render(<AlertIcon type={iconType} className="w-5 h-5" />)

          // Store the root reference for cleanup
          roots.push({ root, container: iconContainer })
        }
      })
    }, 50) // Small delay to ensure DOM is updated

    return () => {
      clearTimeout(timeoutId)

      // Clean up all React roots to prevent memory leaks
      // Use setTimeout to defer unmounting and avoid race conditions
      setTimeout(() => {
        roots.forEach(({ root, container }) => {
          try {
            root.unmount()
            // Remove the container from DOM if it still exists
            if (container.parentNode) {
              container.parentNode.removeChild(container)
            }
          } catch (error) {
            // Silently handle unmount errors (e.g., if already unmounted)
            console.warn('Error unmounting AlertIcon root:', error)
          }
        })
      }, 0)
    }
  }, [contentKey]) // Depend on contentKey to re-run when content changes

  return <>{children}</>
}

export default AlertIconInjector
