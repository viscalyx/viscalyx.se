import { act, render } from '@testing-library/react'
import type React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CodeBlockEnhancer from '@/components/CodeBlockEnhancer'

// Mock react-dom/client
const mockRender = vi.fn()
const mockUnmount = vi.fn()
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
  unmount: mockUnmount,
}))

vi.mock('react-dom/client', () => ({
  createRoot: (_container: Element | DocumentFragment) => mockCreateRoot(),
}))

// Mock CopyButton
vi.mock('@/components/CopyButton', () => ({
  default: ({ text }: { text: string }) => (
    <button type="button" data-testid="copy-button">
      {text}
    </button>
  ),
}))

// Mock next-intl (required by CodeBlockEnhancer and CopyButton)
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('CodeBlockEnhancer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    // Clean up any existing blog-content elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  function createCodeBlock(language: string, code: string) {
    const blogContent = document.createElement('div')
    blogContent.className = 'blog-content'

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'

    const pre = document.createElement('pre')
    pre.className = `language-${language}`

    const codeEl = document.createElement('code')
    codeEl.textContent = code

    pre.appendChild(codeEl)
    wrapper.appendChild(pre)
    blogContent.appendChild(wrapper)
    document.body.appendChild(blogContent)

    return { blogContent, wrapper, pre, codeEl }
  }

  it('renders null (no visible output)', () => {
    const { container } = render(<CodeBlockEnhancer />)
    expect(container.innerHTML).toBe('')
  })

  it('adds copy buttons to code blocks after timeout', () => {
    createCodeBlock('javascript', 'console.log("hello")')

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).toHaveBeenCalledTimes(1)
    expect(mockRender).toHaveBeenCalledTimes(1)
  })

  it('marks wrappers as enhanced', () => {
    const { wrapper } = createCodeBlock('typescript', 'const x = 1')

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(wrapper.dataset.enhanced).toBe('true')
  })

  it('does not enhance the same wrapper twice', () => {
    const { wrapper } = createCodeBlock('python', 'print("hello")')
    wrapper.dataset.enhanced = 'true'

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).not.toHaveBeenCalled()
  })

  it('creates a scroll wrapper around pre element', () => {
    const { wrapper, pre } = createCodeBlock('javascript', 'const y = 2')

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    const scrollWrapper = wrapper.querySelector('.code-scroll-wrapper')
    expect(scrollWrapper).not.toBeNull()
    expect(scrollWrapper?.contains(pre)).toBe(true)
  })

  it('does not run when contentLoaded is false', () => {
    createCodeBlock('javascript', 'const z = 3')

    render(<CodeBlockEnhancer contentLoaded={false} />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).not.toHaveBeenCalled()
  })

  it('handles multiple code blocks', () => {
    const blogContent = document.createElement('div')
    blogContent.className = 'blog-content'

    for (let i = 0; i < 3; i++) {
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'
      const pre = document.createElement('pre')
      pre.className = 'language-js'
      const code = document.createElement('code')
      code.textContent = `code block ${i}`
      pre.appendChild(code)
      wrapper.appendChild(pre)
      blogContent.appendChild(wrapper)
    }
    document.body.appendChild(blogContent)

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).toHaveBeenCalledTimes(3)
    expect(mockRender).toHaveBeenCalledTimes(3)
  })

  it('skips wrappers without pre elements', () => {
    const blogContent = document.createElement('div')
    blogContent.className = 'blog-content'

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    // No <pre> element inside
    blogContent.appendChild(wrapper)
    document.body.appendChild(blogContent)

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).not.toHaveBeenCalled()
  })

  it('handles no blog-content elements gracefully', () => {
    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).not.toHaveBeenCalled()
  })

  it('cleans up on unmount', () => {
    createCodeBlock('javascript', 'cleanup test')

    const { unmount } = render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(mockCreateRoot).toHaveBeenCalledTimes(1)

    unmount()

    // Allow microtask queue to flush for cleanup
    act(() => {
      vi.advanceTimersByTime(0)
    })
    // Verify cleanup occurred: React roots were unmounted and containers removed
    expect(mockUnmount).toHaveBeenCalled()
    const containers = document.querySelectorAll('.copy-button-container')
    expect(containers.length).toBe(0)
  })

  it('creates copy-button-container inside scroll wrapper', () => {
    const { wrapper } = createCodeBlock('bash', 'echo "test"')

    render(<CodeBlockEnhancer />)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    const scrollWrapper = wrapper.querySelector('.code-scroll-wrapper')
    const copyContainer = scrollWrapper?.querySelector('.copy-button-container')
    expect(copyContainer).not.toBeNull()
  })
})
