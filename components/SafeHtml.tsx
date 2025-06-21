import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

interface Props {
  html: string
  className?: string
}

function createDOMPurify() {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // Server-side: create a virtual DOM using jsdom
    const { window } = new JSDOM('')
    // Create a DOMPurify instance with the jsdom window
    const purify = DOMPurify(window as unknown as Window & typeof globalThis)
    return purify
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
