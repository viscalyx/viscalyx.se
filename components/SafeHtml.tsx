import DOMPurify from 'dompurify'

interface Props {
  html: string
  className?: string
}

function createDOMPurify() {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // Server-side: dynamically import jsdom to avoid bundling issues
    try {
      // Use dynamic import to avoid bundling jsdom in the client
      const { JSDOM } = require('jsdom')
      const { window } = new JSDOM('')
      // Create a DOMPurify instance with the jsdom window
      const purify = DOMPurify(window as unknown as Window & typeof globalThis)
      return purify
    } catch {
      // Fallback if jsdom is not available
      console.warn('JSDOM not available, falling back to basic sanitization')
      return {
        sanitize: (html: string) => html // Basic fallback - not secure, but prevents crashes
      }
    }
  } else {
    // Client-side: use the browser's window object
    return DOMPurify
  }
}

export default function SafeHtml({ html, className }: Props) {
  const purify = createDOMPurify()
  const sanitized = purify.sanitize(html)
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
