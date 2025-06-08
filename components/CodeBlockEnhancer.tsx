'use client'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import CopyButton from './CopyButton'

interface CodeBlockEnhancerProps {
  contentLoaded?: boolean
}

export default function CodeBlockEnhancer({
  contentLoaded = true,
}: CodeBlockEnhancerProps) {
  useEffect(() => {
    // Only run if content is loaded
    if (!contentLoaded) return

    // Track containers created by this instance
    const createdContainers: HTMLElement[] = []

    const addCopyButtons = () => {
      // Find all code blocks and add copy buttons
      const codeBlocks = document.querySelectorAll(
        '.blog-content pre[class*="language-"]'
      )

      codeBlocks.forEach(block => {
        // Skip if copy button already exists
        if (block.querySelector('.copy-button-container')) {
          return
        }

        // Get the code content
        const codeElement = block.querySelector('code')
        if (!codeElement) return

        const codeText = codeElement.textContent || ''

        // Create container for the copy button
        const copyContainer = document.createElement('div')
        copyContainer.className = 'copy-button-container'

        // Track this container for cleanup
        createdContainers.push(copyContainer)

        // Position the parent relatively if not already
        const blockElement = block as HTMLElement
        if (
          !blockElement.style.position &&
          window.getComputedStyle(blockElement).position !== 'relative'
        ) {
          blockElement.style.position = 'relative'
        }

        // Add class to help with CSS targeting
        blockElement.classList.add('has-copy-button')

        // Insert the copy button container
        block.appendChild(copyContainer)

        // Render the React component into the container
        const root = createRoot(copyContainer)
        root.render(<CopyButton text={codeText} />)
      })
    }

    // Small delay to ensure DOM rendering is complete
    const timer = setTimeout(addCopyButtons, 50)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      // Remove only containers created by this instance
      createdContainers.forEach(container => container.remove())
    }
  }, [contentLoaded])

  // This component doesn't render anything visible itself
  return null
}
