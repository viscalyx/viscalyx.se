import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BlogPostMarkdownContent from '@/components/BlogPostMarkdownContent'

describe('BlogPostMarkdownContent', () => {
  describe('URL sanitization', () => {
    it('rejects protocol-relative URLs in href attributes', () => {
      const html = '<a href="//evil.com/phish">Click me</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toBeNull()
      expect(link).not.toHaveAttribute('href')
    })

    it('rejects protocol-relative URLs in src attributes', () => {
      const html = '<img src="//evil.com/tracking.gif" alt="test" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
      expect(img).not.toHaveAttribute('src')
    })

    it('allows single-slash relative URLs', () => {
      const html = '<a href="/about">About</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', '/about')
    })

    it('allows fragment URLs', () => {
      const html = '<a href="#section">Section</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', '#section')
    })

    it('allows dot-relative URLs', () => {
      const html = '<a href="./page">Page</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', './page')
    })

    it('allows https URLs', () => {
      const html = '<a href="https://example.com">Link</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', 'https://example.com')
    })

    it('rejects javascript: URLs', () => {
      const html = '<a href="javascript:alert(1)">XSS</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      expect(container.querySelector('a[href^="javascript:"]')).toBeNull()
    })

    it('allows bare root URL', () => {
      const html = '<a href="/">Home</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', '/')
    })
  })

  describe('class preservation', () => {
    it('preserves language class on code elements', () => {
      const html =
        '<pre class="language-js"><code class="language-js">const x = 1</code></pre>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const code = container.querySelector('code')
      expect(code).not.toBeNull()
      expect(code).toHaveClass('language-js')
    })

    it('preserves data-alert-type on alert elements', () => {
      const html = '<div data-alert-type="warning">Caution!</div>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const alert = container.querySelector('[data-alert-type="warning"]')
      expect(alert).not.toBeNull()
      expect(alert?.textContent).toBe('Caution!')
    })

    it('preserves id on heading elements', () => {
      const html = '<h2 id="my-section" class="heading">Section</h2>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const heading = container.querySelector('h2')
      expect(heading).not.toBeNull()
      expect(heading).toHaveAttribute('id', 'my-section')
      expect(heading).toHaveClass('heading')
    })
  })
})
