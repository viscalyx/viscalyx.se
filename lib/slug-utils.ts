import sanitizeHtml from 'sanitize-html'
import slugify from 'slugify'

/**
 * Configuration options for slug generation
 */
interface SlugOptions {
  lower?: boolean
  strict?: boolean
  locale?: string
  trim?: boolean
}

/**
 * Table of Contents item interface
 */
export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Default slug configuration
 */
const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  lower: true,
  strict: false,
  locale: 'en',
  trim: true,
}

/**
 * Creates a URL-friendly slug from text
 *
 * @param text - The text to convert to a slug
 * @param options - Optional slug configuration
 * @returns A URL-friendly slug string
 */
export function createSlug(text: string, options: SlugOptions = {}): string {
  const finalOptions = { ...DEFAULT_SLUG_OPTIONS, ...options }
  return slugify(text, finalOptions)
}

/**
 * Generates a fallback ID for empty or invalid headings
 *
 * @param level - The heading level (1-6)
 * @returns A unique fallback ID
 */
export function generateFallbackId(level: number): string {
  return `heading-${level}-${crypto.randomUUID().replace(/-/g, '')}`
}

/**
 * Extracts clean text content from HTML string
 *
 * @param htmlContent - HTML content to extract text from
 * @returns Clean text content
 */
export function extractCleanText(htmlContent: string): string {
  return sanitizeHtml(htmlContent, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim()
}

/**
 * Creates a slug ID from text content, with fallback for empty content
 *
 * @param text - The text to convert to a slug
 * @param level - The heading level for fallback ID generation
 * @param options - Optional slug configuration
 * @returns A valid slug ID
 */
export function createSlugId(
  text: string,
  level: number,
  options: SlugOptions = {}
): string {
  const cleanText = extractCleanText(text)
  const slug = createSlug(cleanText, options)

  // Ensure the id is not empty
  return slug || generateFallbackId(level)
}

/**
 * Extracts table of contents from HTML content (server-side implementation)
 *
 * @param htmlContent - The HTML content to extract headings from
 * @param options - Optional slug configuration
 * @returns Array of table of contents items
 */
export function extractTableOfContentsServer(
  htmlContent: string,
  options: SlugOptions = {}
): TocItem[] {
  const headingRegex = /<h([2-4])[^>]*>([\s\S]*?)<\/h[2-4]>/gi
  const headings: TocItem[] = []
  const usedIds = new Set<string>()
  let match

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = Number.parseInt(match[1])
    const raw = match[2]
    const text = extractCleanText(raw)
    const baseId = createSlugId(text, level, options)
    const id = ensureUniqueId(baseId, usedIds)

    headings.push({ id, text, level })
  }

  return headings
}

/**
 * Extracts table of contents from HTML content (client-side implementation)
 *
 * @param htmlContent - The HTML content to extract headings from
 * @param options - Optional slug configuration
 * @returns Array of table of contents items
 */
export function extractTableOfContentsClient(
  htmlContent: string,
  options: SlugOptions = {}
): TocItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const headings = Array.from(doc.querySelectorAll('h2, h3, h4'))
  const usedIds = new Set<string>()

  return headings.map(heading => {
    const text = heading.textContent || ''
    const level = Number.parseInt(heading.tagName.charAt(1))
    const baseId = createSlugId(text, level, options)
    const id = ensureUniqueId(baseId, usedIds)

    return { id, text, level }
  })
}

/**
 * Extracts table of contents from HTML content (universal implementation)
 * Automatically chooses server-side or client-side implementation based on environment
 *
 * @param htmlContent - The HTML content to extract headings from
 * @param options - Optional slug configuration
 * @returns Array of table of contents items
 */
export function extractTableOfContents(
  htmlContent: string,
  options: SlugOptions = {}
): TocItem[] {
  if (typeof window === 'undefined') {
    // Server-side: use regex-based extraction
    return extractTableOfContentsServer(htmlContent, options)
  } else {
    // Client-side: use DOM parsing
    return extractTableOfContentsClient(htmlContent, options)
  }
}

/**
 * Adds IDs and anchor links to headings in HTML content
 *
 * @param htmlContent - The HTML content to process
 * @param options - Optional slug configuration
 * @returns HTML content with IDs and anchor links added to headings
 */
export function addHeadingIds(
  htmlContent: string,
  options: SlugOptions = {}
): string {
  const usedIds = new Set<string>()

  return htmlContent.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/gi,
    (match, level, attributes, text) => {
      const levelNum = Number.parseInt(level)
      const cleanedText = extractCleanText(text)
      const baseId = createSlugId(cleanedText, levelNum, options)
      const id = ensureUniqueId(baseId, usedIds)

      // Check if id attribute already exists in attributes
      const hasId = /\bid\s*=\s*(["']?)[^\s>]+\1/i.test(attributes)
      const finalAttributes = hasId ? attributes : `${attributes} id="${id}"`

      // Add anchor link functionality with proper class for styling
      const anchorLink = `<a href="#${id}" class="heading-anchor" aria-label="Link to this section" title="Copy link to this section">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
      </a>`

      // Return the heading with proper ID and anchor link
      return `<h${level}${finalAttributes} class="heading-with-anchor">${text}${anchorLink}</h${level}>`
    }
  )
}

/**
 * Ensures unique IDs by tracking used IDs and adding counters for duplicates
 *
 * @param baseId - The base ID to make unique
 * @param usedIds - Set of already used IDs
 * @returns A unique ID with counter suffix if needed
 */
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
