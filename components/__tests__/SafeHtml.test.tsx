import { render } from '@testing-library/react'
import SafeHtml from '../SafeHtml'

// Mock sanitize-html to return a simplified sanitize function for testing
jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: jest.fn((html: string) => {
    // Simple mock that removes <script> tags but keeps other content
    return html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ''
    )
  }),
}))

describe('SafeHtml', () => {
  const maliciousHtml = '<script>alert("xss")</script><p>Safe content</p>'
  const safeHtml = '<p>This is safe content</p>'

  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks()
  })

  it('renders safe HTML content', () => {
    const { container } = render(<SafeHtml html={safeHtml} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.innerHTML).toContain('This is safe content')
  })

  it('sanitizes malicious HTML content', () => {
    const { container } = render(<SafeHtml html={maliciousHtml} />)
    expect(container.innerHTML).not.toContain('<script>')
    expect(container.innerHTML).not.toContain('alert("xss")')
    expect(container.innerHTML).toContain('Safe content')
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <SafeHtml html={safeHtml} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders without className when not provided', () => {
    const { container } = render(<SafeHtml html={safeHtml} />)
    expect(container.firstChild).not.toHaveClass()
  })

  it('handles empty HTML string', () => {
    const { container } = render(<SafeHtml html="" />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.innerHTML).toBe('<div></div>')
  })

  it('works consistently across environments', () => {
    const { container } = render(<SafeHtml html={safeHtml} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.innerHTML).toContain('This is safe content')
  })
})
