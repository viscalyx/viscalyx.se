'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme-context'

interface MermaidRendererProps {
  contentLoaded?: boolean
}

const MermaidRenderer = ({ contentLoaded = true }: MermaidRendererProps) => {
  const { theme } = useTheme()
  const processedDiagrams = useRef(new Set<Element>())

  useEffect(() => {
    // Only run if content is loaded
    if (!contentLoaded) return

    const initializeMermaid = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = await import('mermaid')
        
        // Configure mermaid with theme support
        mermaid.default.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          themeVariables: {
            // Custom theme variables for better integration
            primaryColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
            primaryTextColor: theme === 'dark' ? '#e5e7eb' : '#111827',
            primaryBorderColor: theme === 'dark' ? '#6b7280' : '#d1d5db',
            lineColor: theme === 'dark' ? '#6b7280' : '#374151',
            secondaryColor: theme === 'dark' ? '#7c3aed' : '#8b5cf6',
            tertiaryColor: theme === 'dark' ? '#f59e0b' : '#f97316',
            background: theme === 'dark' ? '#111827' : '#ffffff',
            mainBkg: theme === 'dark' ? '#1f2937' : '#f9fafb',
            secondBkg: theme === 'dark' ? '#374151' : '#e5e7eb',
            tertiaryBkg: theme === 'dark' ? '#4b5563' : '#d1d5db',
          },
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
            wrapper.className = 'mermaid-diagram-wrapper not-prose'
            wrapper.style.cssText = `
              margin: 2rem 0;
              padding: 1.5rem;
              background: ${theme === 'dark' ? '#111827' : '#ffffff'};
              border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
              border-radius: 0.75rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

            // Style the SVG for better integration
            const svgElement = diagramContainer.querySelector('svg')
            if (svgElement) {
              svgElement.style.maxWidth = '100%'
              svgElement.style.height = 'auto'
              svgElement.style.display = 'block'
              svgElement.style.margin = '0 auto'
            }

            // Find the appropriate container to replace
            let containerToReplace = block
            
            // If the block is inside a code-block-wrapper, replace the entire wrapper
            const codeBlockWrapper = block.closest('.code-block-wrapper')
            if (codeBlockWrapper) {
              containerToReplace = codeBlockWrapper
            }

            // Replace the code block with the rendered diagram
            containerToReplace.parentNode?.replaceChild(wrapper, containerToReplace)

          } catch (error) {
            console.error('Failed to render Mermaid diagram:', error)
            
            // Create error message
            const errorDiv = document.createElement('div')
            errorDiv.className = 'mermaid-error'
            errorDiv.style.cssText = `
              margin: 2rem 0;
              padding: 1rem;
              background: ${theme === 'dark' ? '#7f1d1d' : '#fef2f2'};
              border: 1px solid ${theme === 'dark' ? '#dc2626' : '#fecaca'};
              border-radius: 0.5rem;
              color: ${theme === 'dark' ? '#fca5a5' : '#dc2626'};
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
            containerToReplace.parentNode?.replaceChild(errorDiv, containerToReplace)
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
  }, [contentLoaded, theme])

  // This component doesn't render anything visible itself
  return null
}

export default MermaidRenderer
