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

    it('allows mailto: in href but not in src', () => {
      const hrefHtml = '<a href="mailto:test@example.com">Email</a>'
      const { container: hrefContainer } = render(
        <BlogPostMarkdownContent contentWithIds={hrefHtml} />,
      )
      const anchor = hrefContainer.querySelector('a')
      expect(anchor).toHaveAttribute('href', 'mailto:test@example.com')

      const srcHtml = '<img src="mailto:test@example.com" alt="test" />'
      const { container: srcContainer } = render(
        <BlogPostMarkdownContent contentWithIds={srcHtml} />,
      )
      const img = srcContainer.querySelector('img')
      expect(img).not.toHaveAttribute('src')
    })

    it('allows tel: protocol in href', () => {
      const html = '<a href="tel:+1234567890">Call us</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', 'tel:+1234567890')
    })

    it('allows http URLs', () => {
      const html = '<a href="http://example.com">Link</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', 'http://example.com')
    })

    it('rejects vbscript: URLs', () => {
      const html = '<a href="vbscript:MsgBox">XSS</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('href')
    })

    it('rejects data: URLs', () => {
      const html = '<a href="data:text/html,<script>alert(1)</script>">XSS</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('href')
    })

    it('rejects ftp: protocol URLs', () => {
      const html = '<a href="ftp://files.example.com">FTP</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('href')
    })

    it('strips empty href values', () => {
      const html = '<a href="">Empty</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('href')
    })

    it('allows parent-relative URLs (../) in href', () => {
      const html = '<a href="../other-page">Other</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('href', '../other-page')
    })

    it('rejects src with non-http protocol', () => {
      const html = '<img src="ftp://images.example.com/img.png" alt="test" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).not.toHaveAttribute('src')
    })

    it('allows https src on images', () => {
      const html = '<img src="https://example.com/img.png" alt="test" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', 'https://example.com/img.png')
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

  describe('React attribute mapping', () => {
    it('converts class to className for rendering', () => {
      const html = '<span class="highlight">Highlighted</span>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const span = container.querySelector('span')
      expect(span).toHaveClass('highlight')
    })

    it('preserves data-* and aria-* attributes as-is', () => {
      const html = '<div data-testid="test" aria-hidden="true">Content</div>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const div = container.querySelector('[data-testid="test"]')
      expect(div).toHaveAttribute('aria-hidden', 'true')
    })

    it('converts hyphenated SVG attributes to camelCase for React', () => {
      // stroke-linecap, stroke-linejoin, stroke-width survive sanitization on <path>
      const html =
        '<svg xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" fill="none"></path></svg>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const path = container.querySelector('path')
      expect(path).not.toBeNull()
      // React renders camelCase attributes back as kebab-case in the DOM
      expect(path).toHaveAttribute('stroke-linecap', 'round')
      expect(path).toHaveAttribute('stroke-linejoin', 'round')
      expect(path).toHaveAttribute('stroke-width', '2')
    })

    it('preserves name attribute on anchor elements', () => {
      const html = '<a name="bookmark">Anchor</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('name', 'bookmark')
    })

    it('preserves target attribute on anchor elements', () => {
      const html = '<a href="https://example.com" target="_self">Link</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('target', '_self')
    })

    it('preserves title attribute on anchor elements', () => {
      const html = '<a href="https://example.com" title="Example">Link</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('title', 'Example')
    })

    it('preserves aria-label on anchor elements', () => {
      const html = '<a href="/" aria-label="Go home">Home</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('aria-label', 'Go home')
    })

    it('preserves data-language on pre elements', () => {
      const html =
        '<pre data-language="typescript"><code>const x = 1</code></pre>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const pre = container.querySelector('pre')
      expect(pre).toHaveAttribute('data-language', 'typescript')
    })
  })

  describe('inline style parsing', () => {
    it('parses simple inline styles on img elements', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="width: 100px; height: auto" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveStyle({ width: '100px', height: 'auto' })
    })

    it('handles CSS properties with colons in values on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="background: url(https://example.com/bg.png)" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveStyle({
        background: 'url(https://example.com/bg.png)',
      })
    })

    it('strips expression() from style values on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="width: expression(document.body.clientWidth)" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      // expression() is a dangerous CSS pattern and should be stripped
      const styleValue = img?.style.width ?? ''
      expect(styleValue).not.toContain('expression')
    })

    it('strips javascript: URLs from style values on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="background: url(javascript:alert(1))" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      // javascript: in style URLs is a dangerous pattern and should be stripped
      const styleValue = img?.style.background ?? ''
      expect(styleValue).not.toContain('javascript')
    })

    it('skips empty style declarations on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style=";;;" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
    })

    it('skips style declarations with missing value on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="color:" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
    })

    it('converts hyphenated CSS properties to camelCase on img', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="max-width: 100%; border-radius: 4px" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveStyle({
        maxWidth: '100%',
        borderRadius: '4px',
      })
    })

    it('handles style with only property and no value', () => {
      const html =
        '<img src="https://example.com/img.png" alt="test" style="width" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
    })
  })

  describe('event handler sanitization', () => {
    it('removes onclick attributes', () => {
      const html = '<div onclick="alert(1)">Click</div>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const div = container.querySelector('div.markdown-content > div')
      expect(div).not.toHaveAttribute('onclick')
    })

    it('removes onmouseover attributes', () => {
      const html = '<span onmouseover="alert(1)">Hover</span>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const span = container.querySelector('span')
      expect(span).not.toHaveAttribute('onmouseover')
    })
  })

  describe('target="_blank" rel enforcement', () => {
    it('adds noopener noreferrer to links with target="_blank"', () => {
      const html = '<a href="https://example.com" target="_blank">External</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).toHaveAttribute('rel')
      const rel = link?.getAttribute('rel') ?? ''
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    })

    it('does not add rel to links without target="_blank"', () => {
      const html = '<a href="https://example.com">Internal</a>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const link = container.querySelector('a')
      expect(link).not.toHaveAttribute('rel')
    })
  })

  describe('table structure whitespace handling', () => {
    it('strips whitespace-only text nodes in table structure tags', () => {
      const html =
        '<table>  <thead>  <tr>  <th>Header</th>  </tr>  </thead>  <tbody>  <tr>  <td>Cell</td>  </tr>  </tbody>  </table>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const table = container.querySelector('table')
      expect(table).not.toBeNull()
      expect(table?.querySelector('th')?.textContent).toBe('Header')
      expect(table?.querySelector('td')?.textContent).toBe('Cell')
    })

    it('handles tfoot and colgroup table structure tags', () => {
      const html =
        '<table><colgroup>  <col />  </colgroup><tbody><tr><td>Data</td></tr></tbody><tfoot>  <tr>  <td>Footer</td>  </tr>  </tfoot></table>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const tfoot = container.querySelector('tfoot')
      expect(tfoot).not.toBeNull()
      expect(tfoot?.querySelector('td')?.textContent).toBe('Footer')
    })
  })

  describe('node rendering', () => {
    it('renders text content correctly', () => {
      const html = '<p>Hello world</p>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      expect(container.textContent).toContain('Hello world')
    })

    it('renders nested elements', () => {
      const html = '<div><p><strong>Bold</strong> and <em>italic</em></p></div>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      expect(container.querySelector('strong')?.textContent).toBe('Bold')
      expect(container.querySelector('em')?.textContent).toBe('italic')
    })

    it('renders empty content without errors', () => {
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds="" />,
      )
      const markdownDiv = container.querySelector('.markdown-content')
      expect(markdownDiv).not.toBeNull()
    })

    it('renders SVG elements with preserved attributes', () => {
      const html =
        '<svg class="icon" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 12h14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"></path></svg>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveClass('icon')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      const path = container.querySelector('path')
      expect(path).not.toBeNull()
      expect(path).toHaveAttribute('d', 'M5 12h14')
    })

    it('renders multiple sibling elements', () => {
      const html = '<h1>Title</h1><p>Paragraph 1</p><p>Paragraph 2</p>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const h1 = container.querySelector('h1')
      expect(h1?.textContent).toBe('Title')
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs).toHaveLength(2)
    })

    it('wraps rendered content in markdown-content div', () => {
      const html = '<p>Test</p>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const wrapper = container.querySelector('.markdown-content')
      expect(wrapper).not.toBeNull()
      expect(wrapper?.querySelector('p')).not.toBeNull()
    })
  })

  describe('HTML sanitization', () => {
    it('strips script tags', () => {
      const html = '<p>Safe</p><script>alert("XSS")</script>'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      expect(container.querySelector('script')).toBeNull()
      expect(container.textContent).toContain('Safe')
    })

    it('preserves allowed img attributes including style', () => {
      const html =
        '<img src="https://example.com/img.png" alt="description" style="width: 100px; height: auto" width="100" height="50" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', 'description')
      expect(img).toHaveAttribute('src', 'https://example.com/img.png')
    })

    it('preserves floating-image class on images', () => {
      const html =
        '<img class="floating-image" src="https://example.com/img.png" alt="float" />'
      const { container } = render(
        <BlogPostMarkdownContent contentWithIds={html} />,
      )
      const img = container.querySelector('img')
      expect(img).toHaveClass('floating-image')
    })
  })
})
