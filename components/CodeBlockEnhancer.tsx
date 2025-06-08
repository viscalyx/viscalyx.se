'use client'

import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import CopyButton from './CopyButton'

export default function CodeBlockEnhancer() {
  useEffect(() => {
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

      // Position the parent relatively if not already
      const blockElement = block as HTMLElement
      if (
        !blockElement.style.position &&
        !window.getComputedStyle(blockElement).position.includes('relative')
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

    // Cleanup function to remove copy buttons when component unmounts
    return () => {
      const copyContainers = document.querySelectorAll('.copy-button-container')
      copyContainers.forEach(container => container.remove())
    }
  }, [])

  // This component doesn't render anything visible itself
  return null
}
