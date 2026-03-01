import { type HTMLElement, type Node, NodeType, parse } from 'node-html-parser'
import { type CSSProperties, createElement, type ReactNode } from 'react'
import sanitizeHtml from 'sanitize-html'

interface ComponentProps {
  contentWithIds: string
}

const BLOG_MARKDOWN_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  ...sanitizeHtml.defaults,
  allowedTags: Array.from(
    new Set([
      ...sanitizeHtml.defaults.allowedTags,
      'span',
      'img',
      'svg',
      'path',
    ]),
  ),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: [
      ...(sanitizeHtml.defaults.allowedAttributes.a ?? []),
      'class',
      'aria-label',
      'title',
    ],
    code: ['class'],
    div: ['class', 'data-alert-type'],
    h1: ['id', 'class'],
    h2: ['id', 'class'],
    h3: ['id', 'class'],
    h4: ['id', 'class'],
    h5: ['id', 'class'],
    h6: ['id', 'class'],
    img: ['src', 'alt', 'style', 'width', 'height'],
    path: [
      'stroke-linecap',
      'stroke-linejoin',
      'stroke-width',
      'stroke',
      'fill',
      'd',
    ],
    pre: ['class', 'data-language'],
    span: ['class'],
    svg: ['class', 'fill', 'stroke', 'viewBox', 'xmlns', 'aria-hidden'],
    '*': ['data-*', 'aria-*'],
  },
  allowedClasses: {
    img: ['floating-image'],
  },
}

const DISALLOWED_URL_PATTERN = /^(?:\s*javascript:|\s*vbscript:|\s*data:)/i
const RELATIVE_URL_PATTERN = /^(?:\/(?!\/)|#|\.{1,2}\/)/u
const ALLOWED_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const ALLOWED_SRC_PROTOCOLS = new Set(['http:', 'https:'])

function sanitizeUrl(
  rawValue: string,
  allowedProtocols: ReadonlySet<string>,
): string | null {
  const value = rawValue.trim()
  if (value.length === 0 || DISALLOWED_URL_PATTERN.test(value)) {
    return null
  }

  if (RELATIVE_URL_PATTERN.test(value)) {
    return value
  }

  try {
    const parsed = new URL(value)
    return allowedProtocols.has(parsed.protocol) ? value : null
  } catch {
    return null
  }
}

function toReactAttributeName(attributeName: string): string {
  if (attributeName === 'class') return 'className'
  if (attributeName === 'for') return 'htmlFor'
  if (attributeName === 'tabindex') return 'tabIndex'
  if (attributeName === 'readonly') return 'readOnly'
  if (attributeName === 'srcset') return 'srcSet'
  if (attributeName === 'colspan') return 'colSpan'
  if (attributeName === 'rowspan') return 'rowSpan'
  if (attributeName === 'crossorigin') return 'crossOrigin'
  if (attributeName === 'referrerpolicy') return 'referrerPolicy'
  if (attributeName === 'datetime') return 'dateTime'
  if (attributeName.startsWith('data-') || attributeName.startsWith('aria-')) {
    return attributeName
  }
  return attributeName.replace(/-([a-z])/gu, (_, char: string) =>
    char.toUpperCase(),
  )
}

function parseInlineStyle(styleText: string): CSSProperties {
  const style: Record<string, string> = {}

  for (const declaration of styleText.split(';')) {
    const [property, ...valueParts] = declaration.split(':')
    if (!property || valueParts.length === 0) {
      continue
    }

    const trimmedProperty = property.trim()
    const value = valueParts.join(':').trim()
    if (!trimmedProperty || !value) {
      continue
    }

    if (
      /expression\s*\(/iu.test(value) ||
      /url\s*\(\s*['"]?\s*javascript:/iu.test(value)
    ) {
      continue
    }

    const reactProperty = trimmedProperty.replace(
      /-([a-z])/gu,
      (_, char: string) => char.toUpperCase(),
    )
    style[reactProperty] = value
  }

  return style as CSSProperties
}

function mapElementAttributes(element: HTMLElement): Record<string, unknown> {
  const props: Record<string, unknown> = {}

  for (const [attributeName, rawValue] of Object.entries(
    element.rawAttributes,
  ) as Array<[string, unknown]>) {
    if (/^on/iu.test(attributeName)) {
      continue
    }

    const normalizedValue =
      typeof rawValue === 'string'
        ? rawValue
        : rawValue == null
          ? ''
          : String(rawValue)
    const trimmedValue = normalizedValue.trim()

    if (attributeName === 'style') {
      const parsedStyle = parseInlineStyle(trimmedValue)
      if (Object.keys(parsedStyle).length > 0) {
        props.style = parsedStyle
      }
      continue
    }

    if (attributeName === 'href') {
      const safeUrl = sanitizeUrl(trimmedValue, ALLOWED_URL_PROTOCOLS)
      if (safeUrl) {
        props[attributeName] = safeUrl
      }
      continue
    }

    if (attributeName === 'src') {
      const safeUrl = sanitizeUrl(trimmedValue, ALLOWED_SRC_PROTOCOLS)
      if (safeUrl) {
        props[attributeName] = safeUrl
      }
      continue
    }

    const reactAttributeName = toReactAttributeName(attributeName)
    props[reactAttributeName] = trimmedValue
  }

  if (props.target === '_blank') {
    const existingRel =
      typeof props.rel === 'string' && props.rel.length > 0
        ? props.rel.split(/\s+/u)
        : []
    const relValues = new Set(existingRel)
    relValues.add('noopener')
    relValues.add('noreferrer')
    props.rel = Array.from(relValues).join(' ')
  }

  return props
}

const TABLE_STRUCTURE_TAGS = new Set([
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'colgroup',
])

function renderNode(
  node: Node,
  keyPath: string,
  parentTagName?: string,
): ReactNode {
  if (node.nodeType === NodeType.TEXT_NODE) {
    if (
      parentTagName &&
      TABLE_STRUCTURE_TAGS.has(parentTagName) &&
      node.text.trim().length === 0
    ) {
      return null
    }
    return node.text
  }

  if (node.nodeType !== NodeType.ELEMENT_NODE) {
    return null
  }

  const element = node as HTMLElement
  const tagName = element.tagName.toLowerCase()

  if (!tagName) {
    return null
  }

  const children = element.childNodes
    .map((child, index) => renderNode(child, `${keyPath}-${index}`, tagName))
    .filter((child): child is ReactNode => child !== null)

  return createElement(
    tagName,
    {
      ...mapElementAttributes(element),
      key: keyPath,
    },
    ...children,
  )
}

const BlogPostMarkdownContent = ({ contentWithIds }: ComponentProps) => {
  const sanitizedContent = sanitizeHtml(
    contentWithIds,
    BLOG_MARKDOWN_SANITIZE_OPTIONS,
  )
  const root = parse(sanitizedContent, {
    comment: false,
    // Keep <pre> descendants parsed so Prism token spans and code nodes survive.
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  })

  const renderedNodes = root.childNodes
    .map((node, index) => renderNode(node, `markdown-${index}`))
    .filter((node): node is ReactNode => node !== null)

  return <div className="markdown-content">{renderedNodes}</div>
}

export default BlogPostMarkdownContent
