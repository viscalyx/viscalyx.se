import { render, waitFor } from '@testing-library/react'
import type { Config } from 'dompurify'
import { vi } from 'vitest'
import MermaidRenderer from '../MermaidRenderer'

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(),
  },
}))

// Mock mermaid
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}))

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

const hasHtmlProfile = (config?: Config) => {
  const useProfiles = config?.USE_PROFILES
  if (useProfiles === false) {
    return false
  }
  if (!useProfiles) {
    return false
  }
  return Boolean(useProfiles.html)
}

describe('MermaidRenderer', () => {
  // Sample mermaid code for testing
  const sampleMermaidCode = `
    graph TD
    A[Start] --> B[Process]
    B --> C[End]
  `

  const mockSvgOutput = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="10" y="30">Test Diagram</text></svg>`
  const mockSanitizedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="10" y="30">Test Diagram</text></svg>`

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset DOM
    document.body.innerHTML = ''

    // Reset console error mock
    mockConsoleError.mockClear()

    // Get mocked functions
    const { default: DOMPurify } = await import('dompurify')
    const { default: mermaid } = await import('mermaid')

    // Setup default mocks
    vi.mocked(DOMPurify.sanitize).mockReturnValue(mockSanitizedSvg)
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: mockSvgOutput,
      diagramType: 'flowchart',
    })
    vi.mocked(mermaid.initialize).mockImplementation(() => {})

    // Create a mock blog content container with mermaid code blocks
    const blogContent = document.createElement('div')
    blogContent.className = 'blog-content'

    const preElement = document.createElement('pre')
    preElement.className = 'language-mermaid'

    const codeElement = document.createElement('code')
    codeElement.className = 'language-mermaid'
    codeElement.textContent = sampleMermaidCode

    preElement.appendChild(codeElement)
    blogContent.appendChild(preElement)
    document.body.appendChild(blogContent)
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    document.documentElement.classList.remove('dark')
  })

  describe('successful rendering', () => {
    it('should render mermaid diagrams successfully', async () => {
      const { default: mermaid } = await import('mermaid')

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.initialize)).toHaveBeenCalledWith({
          startOnLoad: false,
          theme: 'default',
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
      })

      await waitFor(() => {
        expect(vi.mocked(mermaid.render)).toHaveBeenCalledWith(
          expect.stringMatching(/^mermaid-diagram-\d+-0$/),
          sampleMermaidCode,
        )
      })

      // Check that the diagram wrapper was created
      const diagramWrapper = document.querySelector('.mermaid-diagram-wrapper')
      expect(diagramWrapper).toBeInTheDocument()
      expect(diagramWrapper).toHaveClass(
        'mermaid-diagram-wrapper',
        'not-prose',
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-xl',
        'shadow-lg',
      )

      // Check that the diagram container was created with sanitized content
      const diagramContainer = document.querySelector('.mermaid-diagram')
      expect(diagramContainer).toBeInTheDocument()
      expect(diagramContainer?.innerHTML).toBe(mockSanitizedSvg)
    })

    it('should process multiple mermaid blocks', async () => {
      const { default: mermaid } = await import('mermaid')

      // Add a second mermaid block
      const blogContent = document.querySelector('.blog-content')
      const secondPre = document.createElement('pre')
      secondPre.className = 'language-mermaid'
      const secondCode = document.createElement('code')
      secondCode.className = 'language-mermaid'
      secondCode.textContent = 'graph LR\nX --> Y'
      secondPre.appendChild(secondCode)
      blogContent?.appendChild(secondPre)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.render)).toHaveBeenCalledTimes(2)
      })

      const diagramWrappers = document.querySelectorAll(
        '.mermaid-diagram-wrapper',
      )
      expect(diagramWrappers).toHaveLength(2)
    })

    it('should re-initialize mermaid when theme class changes', async () => {
      const { default: mermaid } = await import('mermaid')

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.initialize)).toHaveBeenCalledWith(
          expect.objectContaining({
            theme: 'default',
          }),
        )
      })

      document.documentElement.classList.add('dark')

      await waitFor(() => {
        expect(vi.mocked(mermaid.initialize)).toHaveBeenCalledWith(
          expect.objectContaining({
            theme: 'dark',
          }),
        )
      })
    })

    it('should handle code blocks inside code-block-wrapper', async () => {
      const { default: mermaid } = await import('mermaid')

      // Reset DOM and create code block with wrapper
      document.body.innerHTML = ''

      const blogContent = document.createElement('div')
      blogContent.className = 'blog-content'

      const codeBlockWrapper = document.createElement('div')
      codeBlockWrapper.className = 'code-block-wrapper'

      const preElement = document.createElement('pre')
      preElement.className = 'language-mermaid'

      const codeElement = document.createElement('code')
      codeElement.className = 'language-mermaid'
      codeElement.textContent = sampleMermaidCode

      preElement.appendChild(codeElement)
      codeBlockWrapper.appendChild(preElement)
      blogContent.appendChild(codeBlockWrapper)
      document.body.appendChild(blogContent)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.render)).toHaveBeenCalled()
      })

      // The code-block-wrapper should be replaced with the diagram wrapper
      expect(
        document.querySelector('.code-block-wrapper'),
      ).not.toBeInTheDocument()
      expect(
        document.querySelector('.mermaid-diagram-wrapper'),
      ).toBeInTheDocument()
    })
  })

  describe('SVG sanitization', () => {
    it('should sanitize SVG output to prevent XSS attacks', async () => {
      const { default: DOMPurify } = await import('dompurify')
      const { default: mermaid } = await import('mermaid')

      const maliciousSvg = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <script>alert('XSS')</script>
          <text onclick="alert('XSS')">Malicious Text</text>
          <foreignObject>
            <div onclick="alert('XSS')">Content</div>
          </foreignObject>
        </svg>
      `

      vi.mocked(mermaid.render).mockResolvedValue({
        svg: maliciousSvg,
        diagramType: 'flowchart',
      })

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(DOMPurify.sanitize)).toHaveBeenCalledWith(
          maliciousSvg,
          {
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
          },
        )
      })
    })

    it('should use sanitized SVG content in the diagram container', async () => {
      const { default: DOMPurify } = await import('dompurify')
      const { default: mermaid } = await import('mermaid')

      const unsafeSvg = '<svg><script>alert("xss")</script></svg>'
      const safeSvg = '<svg></svg>'

      vi.mocked(mermaid.render).mockResolvedValue({
        svg: unsafeSvg,
        diagramType: 'flowchart',
      })
      vi.mocked(DOMPurify.sanitize).mockReturnValue(safeSvg)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        const diagramContainer = document.querySelector('.mermaid-diagram')
        expect(diagramContainer?.innerHTML).toBe(safeSvg)
      })
    })
  })

  describe('error handling', () => {
    it('logs errors when re-rendering existing wrappers fails', async () => {
      const { default: mermaid } = await import('mermaid')

      const existingWrapper = document.createElement('div')
      existingWrapper.className = 'mermaid-diagram-wrapper'
      existingWrapper.setAttribute('data-mermaid-source', 'graph TD\nA-->B')
      const existingContainer = document.createElement('div')
      existingContainer.className = 'mermaid-diagram'
      existingWrapper.appendChild(existingContainer)
      document.querySelector('.blog-content')?.appendChild(existingWrapper)

      const rerenderError = new Error('Failed theme re-render')
      vi.mocked(mermaid.render)
        .mockRejectedValueOnce(rerenderError)
        .mockResolvedValue({
          svg: mockSvgOutput,
          diagramType: 'flowchart',
        })

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to re-render Mermaid diagram:',
          rerenderError,
        )
      })
    })

    it('logs errors when mermaid initialization fails', async () => {
      const { default: mermaid } = await import('mermaid')
      const initializeError = new Error('Initialize failed')
      vi.mocked(mermaid.initialize).mockImplementation(() => {
        throw initializeError
      })

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to initialize Mermaid:',
          initializeError,
        )
      })
    })

    it('should handle diagram rendering errors', async () => {
      const { default: DOMPurify } = await import('dompurify')
      const { default: mermaid } = await import('mermaid')

      // Create fresh console error spy for this test
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const renderError = new Error('Invalid mermaid syntax')

      // Reset and configure mocks for this specific test
      vi.mocked(mermaid.render).mockRejectedValue(renderError)
      vi.mocked(DOMPurify.sanitize).mockImplementation(
        (input: string | Node, config?: Config) => {
          if (hasHtmlProfile(config)) {
            // This is for error content sanitization
            return String(input)
          }
          // This is for SVG sanitization (shouldn't be called in error case)
          return mockSanitizedSvg
        },
      )

      render(<MermaidRenderer contentLoaded={true} />)

      // Wait for the component to process and encounter the error
      await waitFor(() => {
        const errorDiv = document.querySelector('.mermaid-error')
        expect(errorDiv).toBeInTheDocument()
      })

      // Now check if console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to render Mermaid diagram:',
        renderError,
      )

      // Check that error message is displayed
      const errorDiv = document.querySelector('.mermaid-error')
      expect(errorDiv).toBeInTheDocument()
      expect(errorDiv).toHaveClass(
        'mermaid-error',
        'bg-red-50',
        'border',
        'border-red-200',
        'rounded-lg',
        'text-red-800',
      )

      // Check that error content is sanitized
      expect(vi.mocked(DOMPurify.sanitize)).toHaveBeenCalledWith(
        expect.stringContaining('Invalid mermaid syntax'),
        { USE_PROFILES: { html: true } },
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle non-Error objects in catch blocks', async () => {
      const { default: DOMPurify } = await import('dompurify')
      const { default: mermaid } = await import('mermaid')

      // Create fresh console error spy for this test
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const nonErrorValue = 'String error'

      // Reset and configure mocks for this specific test
      vi.mocked(mermaid.render).mockRejectedValue(nonErrorValue)
      vi.mocked(DOMPurify.sanitize).mockImplementation(
        (input: string | Node, config?: Config) => {
          if (hasHtmlProfile(config)) {
            // This is for error content sanitization
            return String(input)
          }
          // This is for SVG sanitization (shouldn't be called in error case)
          return mockSanitizedSvg
        },
      )

      render(<MermaidRenderer contentLoaded={true} />)

      // Wait for the component to process and encounter the error
      await waitFor(() => {
        const errorDiv = document.querySelector('.mermaid-error')
        expect(errorDiv).toBeInTheDocument()
      })

      // Now check if console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to render Mermaid diagram:',
        nonErrorValue,
      )

      // Check that generic error message is shown
      const errorDiv = document.querySelector('.mermaid-error')
      expect(errorDiv).toBeInTheDocument()
      expect(vi.mocked(DOMPurify.sanitize)).toHaveBeenCalledWith(
        expect.stringContaining('Unknown error occurred'),
        { USE_PROFILES: { html: true } },
      )

      consoleErrorSpy.mockRestore()
    })

    it('should replace code-block-wrapper with error message on render failure', async () => {
      const { default: mermaid } = await import('mermaid')

      // Setup code block with wrapper
      document.body.innerHTML = ''

      const blogContent = document.createElement('div')
      blogContent.className = 'blog-content'

      const codeBlockWrapper = document.createElement('div')
      codeBlockWrapper.className = 'code-block-wrapper'

      const preElement = document.createElement('pre')
      preElement.className = 'language-mermaid'

      const codeElement = document.createElement('code')
      codeElement.className = 'language-mermaid'
      codeElement.textContent = sampleMermaidCode

      preElement.appendChild(codeElement)
      codeBlockWrapper.appendChild(preElement)
      blogContent.appendChild(codeBlockWrapper)
      document.body.appendChild(blogContent)

      const renderError = new Error('Render failed')
      vi.mocked(mermaid.render).mockRejectedValue(renderError)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(
          document.querySelector('.code-block-wrapper'),
        ).not.toBeInTheDocument()
        expect(document.querySelector('.mermaid-error')).toBeInTheDocument()
      })
    })
  })

  describe('content loading states', () => {
    it('should not process diagrams when contentLoaded is false', async () => {
      const { default: mermaid } = await import('mermaid')
      vi.useFakeTimers()

      try {
        render(<MermaidRenderer contentLoaded={false} />)

        // Flush any scheduled timers deterministically
        vi.advanceTimersByTime(200)

        expect(vi.mocked(mermaid.initialize)).not.toHaveBeenCalled()
        expect(vi.mocked(mermaid.render)).not.toHaveBeenCalled()
      } finally {
        vi.useRealTimers()
      }
    })

    it('should process diagrams when contentLoaded defaults to true', async () => {
      const { default: mermaid } = await import('mermaid')

      render(<MermaidRenderer />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.initialize)).toHaveBeenCalled()
        expect(vi.mocked(mermaid.render)).toHaveBeenCalled()
      })
    })

    it('should process diagrams when contentLoaded changes from false to true', async () => {
      const { default: mermaid } = await import('mermaid')
      vi.useFakeTimers()
      try {
        const { rerender } = render(<MermaidRenderer contentLoaded={false} />)

        // Verify no processing initially
        vi.advanceTimersByTime(200)
        expect(vi.mocked(mermaid.initialize)).not.toHaveBeenCalled()

        // Change contentLoaded to true
        rerender(<MermaidRenderer contentLoaded={true} />)

        // Advance fake timers to trigger the component's setTimeout
        await vi.advanceTimersByTimeAsync(200)

        // Switch to real timers for waitFor polling
        vi.useRealTimers()

        await waitFor(() => {
          expect(vi.mocked(mermaid.initialize)).toHaveBeenCalled()
          expect(vi.mocked(mermaid.render)).toHaveBeenCalled()
        })
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('edge cases', () => {
    it('should skip empty mermaid blocks', async () => {
      const { default: mermaid } = await import('mermaid')

      // Create empty mermaid block
      document.body.innerHTML = ''

      const blogContent = document.createElement('div')
      blogContent.className = 'blog-content'

      const preElement = document.createElement('pre')
      preElement.className = 'language-mermaid'

      const codeElement = document.createElement('code')
      codeElement.className = 'language-mermaid'
      codeElement.textContent = '   ' // Only whitespace

      preElement.appendChild(codeElement)
      blogContent.appendChild(preElement)
      document.body.appendChild(blogContent)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.initialize)).toHaveBeenCalled()
      })

      // Should not attempt to render empty diagram
      expect(vi.mocked(mermaid.render)).not.toHaveBeenCalled()
    })

    it('should handle mermaid blocks without code element (direct content)', async () => {
      const { default: mermaid } = await import('mermaid')

      // Create code element directly with mermaid content
      document.body.innerHTML = ''

      const blogContent = document.createElement('div')
      blogContent.className = 'blog-content'

      const codeElement = document.createElement('code')
      codeElement.className = 'language-mermaid'
      codeElement.textContent = sampleMermaidCode

      blogContent.appendChild(codeElement)
      document.body.appendChild(blogContent)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.render)).toHaveBeenCalledWith(
          expect.stringMatching(/^mermaid-diagram-\d+-0$/),
          sampleMermaidCode,
        )
      })
    })

    it('should handle missing parent node gracefully', async () => {
      const { default: mermaid } = await import('mermaid')

      // Create a detached element (no parent)
      const detachedPre = document.createElement('pre')
      detachedPre.className = 'language-mermaid'
      const detachedCode = document.createElement('code')
      detachedCode.textContent = sampleMermaidCode
      detachedPre.appendChild(detachedCode)

      // Mock querySelectorAll to return the detached element
      const originalQuerySelectorAll = document.querySelectorAll
      vi.spyOn(document, 'querySelectorAll').mockReturnValue([
        detachedPre,
      ] as unknown as NodeListOf<Element>)

      render(<MermaidRenderer contentLoaded={true} />)

      await waitFor(() => {
        expect(vi.mocked(mermaid.render)).toHaveBeenCalled()
      })

      // Should not throw error even with missing parent
      expect(mockConsoleError).not.toHaveBeenCalledWith(
        expect.stringContaining('Failed to render Mermaid diagram'),
      )

      // Restore original method
      document.querySelectorAll = originalQuerySelectorAll
    })
  })

  describe('component lifecycle', () => {
    it('should return null (render nothing visible)', () => {
      const { container } = render(<MermaidRenderer />)
      expect(container.firstChild).toBeNull()
    })

    it('should cleanup timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { unmount } = render(<MermaidRenderer contentLoaded={true} />)

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })

    it('should use setTimeout with 100ms delay for initialization', async () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

      render(<MermaidRenderer contentLoaded={true} />)

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100)

      setTimeoutSpy.mockRestore()
    })
  })
})
