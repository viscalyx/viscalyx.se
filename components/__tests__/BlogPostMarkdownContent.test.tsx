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
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('href')
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
})
