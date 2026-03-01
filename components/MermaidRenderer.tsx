'use client'

import DOMPurify from 'dompurify'
import { useEffect, useRef } from 'react'

/**
 * MermaidRenderer Component - Lazy Loading Strategy
 *
 * This component implements lazy loading for the Mermaid diagramming library to optimize
 * initial bundle size while maintaining security and performance.
 *
 * ## How Lazy Loading Works:
 *
 * 1. **Build Time**:
 *    - Mermaid is listed in devDependencies (not regular dependencies)
 *    - Next.js/Webpack analyzes the dynamic import and creates a separate chunk
 *    - The exact version (from package.json) is bundled into this chunk at build time
 *
 * 2. **Runtime**:
 *    - Initial page load: Mermaid chunk is NOT loaded (reduces bundle size)
 *    - When component mounts and detects mermaid code blocks: Dynamic import triggers
 *    - Browser fetches the pre-built mermaid chunk from your domain (not external CDN)
 *    - Chunk is cached for subsequent mermaid diagrams on other pages
 *
 * ## Security Benefits:
 * - Exact version pinning prevents supply chain attacks
 * - No runtime fetching from external CDNs
 * - Library is bundled and verified at build time
 * - Sub-resource integrity is handled by the bundler
 *
 * ## Performance Benefits:
 * - ~500KB+ reduction in initial bundle size
 * - Library only loads when diagrams are present
 * - Chunk splitting allows for efficient caching
 * - Non-blocking: Page renders immediately, diagrams render after library loads
 *
 * ## Usage:
 * The component is rendered after the markdown content is inserted into the DOM,
 * allowing it to find and replace mermaid code blocks with rendered diagrams.
 *
 * ## Bundle Analysis:
 * You can see the chunk creation with: `npm run build` and look for mermaid chunks
 * in the build output or use `npm run analyze` if bundle analyzer is configured.
 */

interface MermaidRendererProps {
  contentLoaded?: boolean
}

/**
 * Shared DOMPurify options for sanitizing rendered Mermaid SVG output.
 * Removes XSS vectors while preserving SVG-specific attributes that
 * flowcharts and other diagram types rely on.
 */
export const SVG_SANITIZE_OPTIONS: {
  ADD_ATTR: string[]
  ADD_TAGS: string[]
  ALLOW_DATA_ATTR: boolean
  FORBID_ATTR: string[]
  FORBID_TAGS: string[]
  KEEP_CONTENT: boolean
} = {
  FORBID_TAGS: ['script'],
  FORBID_ATTR: [
    'onclick',
    'onload',
    'onerror',
    'onmouseover',
    'onmouseout',
    'onfocus',
    'onblur',
  ],
  ADD_TAGS: ['foreignObject'],
  ADD_ATTR: [
    'xmlns',
    'xmlns:xlink',
    'xml:space',
    'dominant-baseline',
    'text-anchor',
  ],
  ALLOW_DATA_ATTR: true,
  KEEP_CONTENT: true,
}

const MermaidRenderer = ({ contentLoaded = true }: MermaidRendererProps) => {
  const processedDiagrams = useRef(new Set<Element>())

  useEffect(() => {
    // Only run if content is loaded
    if (!contentLoaded) return

    let cancelled = false

    const getTheme = () => {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'default'
    }

    const initializeMermaid = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = await import('mermaid')
        if (cancelled) return
        const currentTheme = getTheme()

        // Configure mermaid with default settings
        // https://mermaid.js.org/config/schema-docs/config.html
        mermaid.default.initialize({
          startOnLoad: false,
          theme: currentTheme,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          },
          gantt: {
            useMaxWidth: true,
          },
          journey: {
            useMaxWidth: true,
          },
          pie: {
            useMaxWidth: true,
          },
          gitGraph: {
            useMaxWidth: true,
          },
        })

        // Re-render existing diagram wrappers when theme changes.
        const existingWrappers = Array.from(
          document.querySelectorAll('.blog-content .mermaid-diagram-wrapper'),
        )
        for (let i = 0; i < existingWrappers.length; i++) {
          const wrapper = existingWrappers[i]
          const mermaidCode = wrapper.getAttribute('data-mermaid-source')
          const diagramContainer = wrapper.querySelector('.mermaid-diagram')

          if (!mermaidCode || !diagramContainer) continue

          try {
            const diagramId = `mermaid-diagram-theme-${Date.now()}-${i}`
            const { svg } = await mermaid.default.render(diagramId, mermaidCode)
            if (cancelled) continue

            const cleanSvg = DOMPurify.sanitize(svg, SVG_SANITIZE_OPTIONS)

            diagramContainer.textContent = ''
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = cleanSvg
            const svgElement = tempDiv.querySelector('svg')
            if (svgElement) {
              diagramContainer.appendChild(svgElement)
            }
          } catch (error) {
            console.error('Failed to re-render Mermaid diagram:', error)
          }
        }

        // Find all mermaid code blocks
        const mermaidSelector =
          '.blog-content pre[class*="language-mermaid"], .blog-content code[class*="language-mermaid"]'
        const mermaidBlocks = Array.from(
          document.querySelectorAll(mermaidSelector),
        )
        const processedRoots = new Set<Element>()
        const uniqueMermaidBlocks = mermaidBlocks
          .map(block => {
            const preBlock = block.closest('pre[class*="language-mermaid"]')
            return preBlock ?? block
          })
          .filter(block => {
            if (processedRoots.has(block)) return false
            processedRoots.add(block)
            return true
          })

        // Process each mermaid block
        for (let i = 0; i < uniqueMermaidBlocks.length; i++) {
          const block = uniqueMermaidBlocks[i]

          // Skip if already processed
          if (processedDiagrams.current.has(block)) continue

          // Mark as processed
          processedDiagrams.current.add(block)

          // Get the mermaid code
          let mermaidCode = ''
          if (block.tagName === 'PRE') {
            const codeElement = block.querySelector('code')
            mermaidCode = codeElement?.textContent || block.textContent || ''
          } else {
            mermaidCode = block.textContent || ''
          }

          // Skip if no code found
          if (!mermaidCode.trim()) continue

          try {
            // Create a unique ID for this diagram
            const diagramId = `mermaid-diagram-${Date.now()}-${i}`

            // Create wrapper div for the diagram
            const wrapper = document.createElement('div')
            wrapper.className =
              'mermaid-diagram-wrapper not-prose bg-white border border-gray-200 rounded-xl shadow-lg my-8 p-6 overflow-x-auto text-center text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100'

            // Create the diagram container
            const diagramContainer = document.createElement('div')
            diagramContainer.id = diagramId
            diagramContainer.className =
              'mermaid-diagram text-gray-900 dark:text-gray-100'
            wrapper.appendChild(diagramContainer)
            wrapper.setAttribute('data-mermaid-source', mermaidCode)

            // Render the diagram - If rendering fails, check for syntax issues or sanitization conflicts.
            const { svg } = await mermaid.default.render(diagramId, mermaidCode)
            if (cancelled) continue

            // Use targeted sanitization to preserve mermaid rendering while removing XSS vectors
            const cleanSvg = DOMPurify.sanitize(svg, SVG_SANITIZE_OPTIONS)

            // Clear container and safely append SVG
            diagramContainer.textContent = ''
            const tempDiv = document.createElement('div')
            // To temporary disable the mermaid sanitization, you can set this to `svg`
            tempDiv.innerHTML = cleanSvg
            const svgElement = tempDiv.querySelector('svg')
            if (svgElement) {
              diagramContainer.appendChild(svgElement)
            }

            // Find the appropriate container to replace
            let containerToReplace = block

            // If the block is inside a code-block-wrapper, replace the entire wrapper
            const codeBlockWrapper = block.closest('.code-block-wrapper')
            if (codeBlockWrapper) {
              containerToReplace = codeBlockWrapper
            }

            // Replace the code block with the rendered diagram
            containerToReplace.parentNode?.replaceChild(
              wrapper,
              containerToReplace,
            )
          } catch (error) {
            console.error('Failed to render Mermaid diagram:', error)

            // Create error message
            const errorDiv = document.createElement('div')
            errorDiv.className =
              'mermaid-error bg-red-50 border border-red-200 rounded-lg text-red-800 my-8 p-4 font-mono text-sm dark:bg-red-950 dark:border-red-900 dark:text-red-200'
            // Render error message with DOMPurify to avoid XSS
            const rawErrorHtml = `
              <strong>Mermaid Diagram Error:</strong><br>
              ${error instanceof Error ? error.message : 'Unknown error occurred'}
            `
            const cleanErrorHtml = DOMPurify.sanitize(rawErrorHtml, {
              USE_PROFILES: { html: true },
            })
            errorDiv.innerHTML = cleanErrorHtml

            // Find the appropriate container to replace
            let containerToReplace = block
            const codeBlockWrapper = block.closest('.code-block-wrapper')
            if (codeBlockWrapper) {
              containerToReplace = codeBlockWrapper
            }

            // Replace with error message
            containerToReplace.parentNode?.replaceChild(
              errorDiv,
              containerToReplace,
            )
          }
        }
      } catch (error) {
        console.error('Failed to initialize Mermaid:', error)
      }
    }

    // Small delay to ensure DOM rendering is complete
    const timer = setTimeout(initializeMermaid, 100)
    let activeTheme = getTheme()
    const rootObserver = new MutationObserver(() => {
      const nextTheme = getTheme()
      if (nextTheme === activeTheme) return
      activeTheme = nextTheme
      void initializeMermaid()
    })
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelled = true
      clearTimeout(timer)
      rootObserver.disconnect()
    }
  }, [contentLoaded])

  // This component doesn't render anything visible itself
  return null
}

export default MermaidRenderer
