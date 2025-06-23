'use client'

import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertIcon, type AlertIconProps } from './BlogIcons'

interface AlertIconInjectorProps {
  children: React.ReactNode
}

export const AlertIconInjector: React.FC<AlertIconInjectorProps> = ({
  children,
}) => {
  useEffect(() => {
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
        // Check if icon is already injected
        if (titleElement.querySelector('.alert-icon-container')) {
          return
        }

        // Create a container for the icon
        const iconContainer = document.createElement('span')
        iconContainer.className =
          'alert-icon-container inline-flex items-center mr-2'

        // Insert the icon container at the beginning of the title
        titleElement.insertBefore(iconContainer, titleElement.firstChild)

        // Render the React icon component into the container
        const root = createRoot(iconContainer)
        root.render(<AlertIcon type={iconType} className="w-5 h-5" />)
      }
    })
  }, [])

  return <>{children}</>
}

export default AlertIconInjector
