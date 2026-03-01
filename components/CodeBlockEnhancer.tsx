'use client'

import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl'
import { useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import CopyButton from '@/components/CopyButton'

interface CodeBlockEnhancerProps {
  contentLoaded?: boolean
}

const CodeBlockEnhancer = ({
  contentLoaded = true,
}: CodeBlockEnhancerProps) => {
  const locale = useLocale()
  const messages = useMessages()

  useEffect(() => {
    // Only run if content is loaded
    if (!contentLoaded) return

    // Track containers and wrappers created by this instance
    const createdContainers: HTMLElement[] = []
    const enhancedWrappers: HTMLElement[] = []
    const roots = new Map<HTMLElement, Root>()

    const addCopyButtons = () => {
      // Use build-time wrappers: '.code-block-wrapper' contains <pre> and label
      const wrappers = Array.from(
        document.querySelectorAll('.blog-content .code-block-wrapper'),
      ) as HTMLElement[]

      wrappers.forEach(wrapper => {
        // Only process once per wrapper
        if (wrapper.dataset.enhanced === 'true') return

        // Find the <pre> element
        const pre = wrapper.querySelector(
          'pre[class*="language-"]',
        ) as HTMLElement | null
        if (!pre) return

        // Only process wrappers with a code element
        const codeElement = pre.querySelector('code')
        if (!codeElement) return

        wrapper.dataset.enhanced = 'true'
        enhancedWrappers.push(wrapper)

        // Wrap <pre> in scroll wrapper if not already
        let scrollWrapper = wrapper.querySelector(
          '.code-scroll-wrapper',
        ) as HTMLElement | null
        if (!scrollWrapper) {
          scrollWrapper = document.createElement('div')
          scrollWrapper.className = 'code-scroll-wrapper'
          wrapper.insertBefore(scrollWrapper, pre)
          scrollWrapper.appendChild(pre)
        }

        // Insert copy button into wrapper
        const text = codeElement.textContent || ''
        const copyContainer = document.createElement('div')
        copyContainer.className = 'copy-button-container'
        // append to scrollWrapper so the button overlays inside the code block
        scrollWrapper.appendChild(copyContainer)
        createdContainers.push(copyContainer)
        const root = createRoot(copyContainer)
        root.render(
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CopyButton text={text} />
          </NextIntlClientProvider>,
        )
        roots.set(copyContainer, root)
      })
    }

    let observer: MutationObserver | null = null
    let scanRafId = 0

    // Small delay to ensure DOM rendering is complete
    const timer = setTimeout(addCopyButtons, 50)
    let containerWatcher: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(mutationList => {
        const hasRelevantChange = mutationList.some(mutation =>
          Array.from(mutation.addedNodes).some(
            node =>
              node instanceof HTMLElement &&
              (node.classList.contains('code-block-wrapper') ||
                node.querySelector?.('.code-block-wrapper')),
          ),
        )
        if (!hasRelevantChange) return
        if (scanRafId !== 0) {
          cancelAnimationFrame(scanRafId)
        }
        scanRafId = requestAnimationFrame(() => {
          scanRafId = 0
          addCopyButtons()
        })
      })
      const blogContainer = document.querySelector('.blog-content')
      if (blogContainer) {
        observer.observe(blogContainer, {
          childList: true,
          subtree: true,
        })
      } else {
        // .blog-content doesn't exist yet; watch document.body for its arrival,
        // then bind the real observer and disconnect this temporary watcher.
        containerWatcher = new MutationObserver(() => {
          const found = document.querySelector('.blog-content')
          if (found) {
            containerWatcher?.disconnect()
            containerWatcher = null
            observer?.observe(found, {
              childList: true,
              subtree: true,
            })
            addCopyButtons()
          }
        })
        containerWatcher.observe(document.body, {
          childList: true,
          subtree: true,
        })
      }
    }

    // Cleanup function
    return () => {
      clearTimeout(timer)
      containerWatcher?.disconnect()
      observer?.disconnect()
      if (scanRafId !== 0) {
        cancelAnimationFrame(scanRafId)
      }

      // Remove DOM elements synchronously so the UI updates immediately
      createdContainers.forEach(container => {
        if (container.parentNode) {
          container.remove()
        }
      })

      // Reset enhanced flag only on wrappers enhanced by this instance
      enhancedWrappers.forEach(wrapper => {
        if (wrapper.isConnected) {
          wrapper.removeAttribute('data-enhanced')
        }
      })

      // Defer root unmounts to avoid "synchronously unmount during render"
      // race condition in React 19 (roots are already detached from the DOM
      // above, so this is safe to run asynchronously).
      setTimeout(() => {
        roots.forEach(root => {
          try {
            root.unmount()
          } catch {
            // Root may already be unmounted if React cleaned it up
          }
        })
        roots.clear()
      }, 0)
    }
  }, [contentLoaded, locale, messages])

  // This component doesn't render anything visible itself
  return null
}

export default CodeBlockEnhancer
