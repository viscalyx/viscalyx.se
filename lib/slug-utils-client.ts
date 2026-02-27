import sanitizeHtml from 'sanitize-html'
import slugify from 'slugify'

/**
 * Configuration options for slug generation
 */
export interface SlugOptions {
  locale?: string
  lower?: boolean
  namespace?: string
  strict?: boolean
  trim?: boolean
}

/**
 * Table of Contents item interface
 */
export interface TocItem {
  id: string
  level: number
  text: string
}

/**
 * Translation function type for accessibility messages
 */
export type TranslationFunction = (
  key: string,
  values?: Record<string, string>,
) => string

/**
 * SVG icon for anchor links - Link/chain icon
 */
export const ANCHOR_LINK_ICON = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
</svg>`

function isSafeCodePoint(cp: number): boolean {
  return cp >= 0 && cp <= 0x10ffff && (cp < 0xd800 || cp > 0xdfff)
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      const cp = Number.parseInt(hex, 16)
      return isSafeCodePoint(cp) ? String.fromCodePoint(cp) : match
    })
    .replace(/&#(\d+);/g, (match, dec) => {
      const cp = Number.parseInt(dec, 10)
      return isSafeCodePoint(cp) ? String.fromCodePoint(cp) : match
    })
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

export function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  lower: true,
  strict: false,
  locale: 'en',
  trim: true,
}

export function createSlug(text: string, options: SlugOptions = {}): string {
  const finalOptions = { ...DEFAULT_SLUG_OPTIONS, ...options }
  return slugify(text, finalOptions)
}

function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

export function generateFallbackId(
  level: number,
  content: string = '',
): string {
  const hash = djb2Hash(`${level}-${content}`)
  return `heading-${level}-${hash}`
}

export function extractCleanText(htmlContent: string): string {
  const stripped = sanitizeHtml(htmlContent, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim()
  return decodeHtmlEntities(stripped)
}

export function createSlugId(
  text: string,
  level: number,
  options: SlugOptions = {},
): string {
  const cleanText = extractCleanText(text)
  const slug = createSlug(cleanText, options)
  return slug || generateFallbackId(level, text)
}

export function extractTableOfContentsClient(
  htmlContent: string,
  options: SlugOptions = {},
): TocItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const headings = Array.from(doc.querySelectorAll('h2, h3, h4'))
  const usedIds = new Set<string>()

  return headings.map(heading => {
    const text = heading.textContent || ''
    const level = Number.parseInt(heading.tagName.charAt(1), 10)
    const baseId = createSlugId(text, level, options)
    const id = ensureUniqueId(baseId, usedIds)

    return { id, text, level }
  })
}

export function ensureUniqueId(baseId: string, usedIds: Set<string>): string {
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId)
    return baseId
  }

  let counter = 1
  let uniqueId = `${baseId}-${counter}`

  while (usedIds.has(uniqueId)) {
    counter++
    uniqueId = `${baseId}-${counter}`
  }

  usedIds.add(uniqueId)
  return uniqueId
}
