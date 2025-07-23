'use client'

import { useEffect, useRef } from 'react'

interface MermaidRendererProps {
  contentLoaded?: boolean
}

const MermaidRenderer = ({ contentLoaded = true }: MermaidRendererProps) => {
  const processedDiagrams = useRef(new Set<Element>())

  useEffect(() => {
    // Only run if content is loaded
    if (!contentLoaded) return

    const initializeMermaid = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = await import('mermaid')

        // Configure mermaid with default settings
        mermaid.default.initialize({
          startOnLoad: false,
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

        // Find all mermaid code blocks
        const mermaidBlocks = document.querySelectorAll(
          '.blog-content pre[class*="language-mermaid"], .blog-content code[class*="language-mermaid"]'
        )

        // Process each mermaid block
        for (let i = 0; i < mermaidBlocks.length; i++) {
          const block = mermaidBlocks[i]

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
              'mermaid-diagram-wrapper not-prose bg-white border border-gray-200 rounded-xl shadow-lg'
            wrapper.style.cssText = `
              margin: 2rem 0;
              padding: 1.5rem;
              overflow-x: auto;
              text-align: center;
            `

            // Create the diagram container
            const diagramContainer = document.createElement('div')
            diagramContainer.id = diagramId
            diagramContainer.className = 'mermaid-diagram'
            wrapper.appendChild(diagramContainer)

            // Render the diagram
            const { svg } = await mermaid.default.render(diagramId, mermaidCode)
            diagramContainer.innerHTML = svg

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
              containerToReplace
            )
          } catch (error) {
            console.error('Failed to render Mermaid diagram:', error)

            // Create error message
            const errorDiv = document.createElement('div')
            errorDiv.className =
              'mermaid-error bg-red-50 border border-red-200 rounded-lg text-red-800'
            errorDiv.style.cssText = `
              margin: 2rem 0;
              padding: 1rem;
              font-family: 'Courier New', monospace;
              font-size: 0.875rem;
            `
            errorDiv.innerHTML = `
              <strong>Mermaid Diagram Error:</strong><br>
              ${error instanceof Error ? error.message : 'Unknown error occurred'}
            `

            // Find the appropriate container to replace
            let containerToReplace = block
            const codeBlockWrapper = block.closest('.code-block-wrapper')
            if (codeBlockWrapper) {
              containerToReplace = codeBlockWrapper
            }

            // Replace with error message
            containerToReplace.parentNode?.replaceChild(
              errorDiv,
              containerToReplace
            )
          }
        }
      } catch (error) {
        console.error('Failed to initialize Mermaid:', error)
      }
    }

    // Small delay to ensure DOM rendering is complete
    const timer = setTimeout(initializeMermaid, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [contentLoaded])

  // This component doesn't render anything visible itself
  return null
}

export default MermaidRenderer
