import { useMemo } from 'react'
import sanitizeHtml from 'sanitize-html'

// Default sanitization options for security
const defaultSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'a',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th',
    'div',
    'span',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class', 'id'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
}

interface Props {
  html: string
  className?: string
  sanitizeOptions?: Partial<sanitizeHtml.IOptions>
}

export default function SafeHtml({ html, className, sanitizeOptions }: Props) {
  const finalSanitizeOptions = useMemo(() => {
    if (!sanitizeOptions) {
      return defaultSanitizeOptions
    }

    // Deep merge the options, particularly for nested objects like allowedAttributes
    const merged: sanitizeHtml.IOptions = {
      ...defaultSanitizeOptions,
      ...sanitizeOptions,
    }

    // Handle allowedAttributes specially for proper merging
    if (sanitizeOptions.allowedAttributes) {
      merged.allowedAttributes = {
        ...defaultSanitizeOptions.allowedAttributes,
        ...sanitizeOptions.allowedAttributes,
      }

      // Handle the special case where both default and custom have '*' key
      const defaultAttrs = defaultSanitizeOptions.allowedAttributes
      const customAttrs = sanitizeOptions.allowedAttributes
      if (
        defaultAttrs &&
        typeof defaultAttrs === 'object' &&
        customAttrs['*'] &&
        defaultAttrs['*']
      ) {
        merged.allowedAttributes = {
          ...merged.allowedAttributes,
          '*': [...defaultAttrs['*'], ...customAttrs['*']],
        }
      }
    }

    // Handle allowedSchemesByTag specially for proper merging
    if (
      sanitizeOptions.allowedSchemesByTag &&
      defaultSanitizeOptions.allowedSchemesByTag
    ) {
      merged.allowedSchemesByTag = Object.assign(
        {},
        defaultSanitizeOptions.allowedSchemesByTag,
        sanitizeOptions.allowedSchemesByTag
      )
    } else if (sanitizeOptions.allowedSchemesByTag) {
      merged.allowedSchemesByTag = sanitizeOptions.allowedSchemesByTag
    }

    return merged
  }, [sanitizeOptions])

  const sanitized = useMemo(() => {
    return sanitizeHtml(html, finalSanitizeOptions)
  }, [html, finalSanitizeOptions])

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
