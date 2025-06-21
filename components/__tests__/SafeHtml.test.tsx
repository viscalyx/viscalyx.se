import { render } from '@testing-library/react'
import SafeHtml from '../SafeHtml'

describe('SafeHtml', () => {
  const safeHtml = '<p>This is safe content</p>'
  const maliciousHtml = '<script>alert("xss")</script><p>Safe content</p>'
  const htmlWithDisallowedTags =
    '<iframe src="evil.com"></iframe><p>Safe content</p>'
  const htmlWithDisallowedAttributes =
    '<p onclick="alert(\'xss\')">Click me</p>'

  it('renders safe HTML content correctly', () => {
    const { container } = render(<SafeHtml html={safeHtml} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.innerHTML).toContain('<p>This is safe content</p>')
  })

  it('removes script tags from malicious HTML', () => {
    const { container } = render(<SafeHtml html={maliciousHtml} />)
    const html = container.innerHTML

    // Should remove script tags completely
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert("xss")')

    // Should preserve safe content
    expect(html).toContain('<p>Safe content</p>')
  })

  it('removes disallowed tags while preserving content', () => {
    const { container } = render(<SafeHtml html={htmlWithDisallowedTags} />)
    const html = container.innerHTML

    // Should remove iframe tags
    expect(html).not.toContain('<iframe>')
    expect(html).not.toContain('evil.com')

    // Should preserve safe content
    expect(html).toContain('<p>Safe content</p>')
  })

  it('removes dangerous attributes', () => {
    const { container } = render(
      <SafeHtml html={htmlWithDisallowedAttributes} />
    )
    const html = container.innerHTML

    // Should remove onclick attribute
    expect(html).not.toContain('onclick')
    expect(html).not.toContain("alert('xss')")

    // Should preserve the element and safe content
    expect(html).toContain('<p>Click me</p>')
  })

  it('preserves allowed attributes', () => {
    const htmlWithAllowedAttrs =
      '<a href="https://example.com" title="Example">Link</a><img src="image.jpg" alt="Description" />'
    const { container } = render(<SafeHtml html={htmlWithAllowedAttrs} />)
    const html = container.innerHTML

    // Should preserve allowed attributes
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('title="Example"')
    expect(html).toContain('src="image.jpg"')
    expect(html).toContain('alt="Description"')
  })

  it('handles complex HTML with mixed safe and unsafe content', () => {
    const complexHtml = `
      <div>
        <p>Safe paragraph</p>
        <script>alert('xss')</script>
        <a href="https://safe.com" onclick="badFunction()">Safe link</a>
        <iframe src="malicious.com"></iframe>
        <img src="image.jpg" alt="Safe image" onerror="badCode()" />
      </div>
    `

    const { container } = render(<SafeHtml html={complexHtml} />)
    const html = container.innerHTML

    // Should preserve safe content
    expect(html).toContain('<p>Safe paragraph</p>')
    expect(html).toContain('href="https://safe.com"')
    expect(html).toContain('src="image.jpg"')
    expect(html).toContain('alt="Safe image"')

    // Should remove dangerous content
    expect(html).not.toContain('<script>')
    expect(html).not.toContain("alert('xss')")
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('badFunction()')
    expect(html).not.toContain('<iframe>')
    expect(html).not.toContain('malicious.com')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('badCode()')
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

  it('handles null and undefined input gracefully', () => {
    const { container: nullContainer } = render(<SafeHtml html={null as any} />)
    expect(nullContainer.firstChild).toBeInTheDocument()

    const { container: undefinedContainer } = render(
      <SafeHtml html={undefined as any} />
    )
    expect(undefinedContainer.firstChild).toBeInTheDocument()
  })
})
