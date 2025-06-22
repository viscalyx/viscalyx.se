'use client'

import { useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
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
    const roots = new Map<HTMLElement, Root>()

    const addCopyButtons = () => {
      // Use build-time wrappers: '.code-block-wrapper' contains <pre> and label
      const wrappers = Array.from(
        document.querySelectorAll('.blog-content .code-block-wrapper')
      ) as HTMLElement[]

      wrappers.forEach(wrapper => {
        // Only process once per wrapper
        if (wrapper.dataset.enhanced === 'true') return
        wrapper.dataset.enhanced = 'true'

        // Find the <pre> element
        const pre = wrapper.querySelector(
          'pre[class*="language-"]'
        ) as HTMLElement | null
        if (!pre) return

        // Wrap <pre> in scroll wrapper if not already
        let scrollWrapper = wrapper.querySelector(
          '.code-scroll-wrapper'
        ) as HTMLElement | null
        if (!scrollWrapper) {
          scrollWrapper = document.createElement('div')
          scrollWrapper.className = 'code-scroll-wrapper'
          wrapper.insertBefore(scrollWrapper, pre)
          scrollWrapper.appendChild(pre)
        }

        // Insert copy button into wrapper
        const codeElement = pre.querySelector('code')
        if (codeElement) {
          const text = codeElement.textContent || ''
          const copyContainer = document.createElement('div')
          copyContainer.className = 'copy-button-container'
          // append to scrollWrapper so the button overlays inside the code block
          scrollWrapper.appendChild(copyContainer)
          createdContainers.push(copyContainer)
          const root = createRoot(copyContainer)
          root.render(<CopyButton text={text} />)
          roots.set(copyContainer, root)
        }
      })
    }

    // Small delay to ensure DOM rendering is complete
    const timer = setTimeout(addCopyButtons, 50)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      // Mark for cleanup but defer actual unmounting
      const cleanupRoots = () => {
        createdContainers.forEach(container => {
          const root = roots.get(container)
          if (root && container.isConnected) {
            try {
              // Use requestIdleCallback if available, otherwise fallback to setTimeout
              if (
                typeof window !== 'undefined' &&
                'requestIdleCallback' in window
              ) {
                window.requestIdleCallback(() => {
                  root.unmount()
                  roots.delete(container)
                })
              } else {
                setTimeout(() => {
                  root.unmount()
                  roots.delete(container)
                }, 0)
              }
            } catch (error) {
              console.warn('Error unmounting React root:', error)
              roots.delete(container)
            }
          }
          if (container.parentNode) {
            container.remove()
          }
        })
      }

      // Use queueMicrotask to defer the cleanup
      queueMicrotask(cleanupRoots)
    }
  }, [contentLoaded])

  // This component doesn't render anything visible itself
  return null
}
