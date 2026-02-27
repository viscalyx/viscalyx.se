import { getTranslations } from 'next-intl/server'
import {
  ANCHOR_LINK_ICON,
  createSlugId,
  ensureUniqueId,
  escapeHtmlAttr,
  extractCleanText,
  type SlugOptions,
  type TocItem,
  type TranslationFunction,
} from './slug-utils-client'

export function extractTableOfContentsServer(
  htmlContent: string,
  options: SlugOptions = {},
): TocItem[] {
  const headingRegex = /<h([2-4])[^>]*>([\s\S]*?)<\/h[2-4]>/gi
  const headings: TocItem[] = []
  const usedIds = new Set<string>()
  let match: RegExpExecArray | null = headingRegex.exec(htmlContent)
  while (match !== null) {
    const level = Number.parseInt(match[1], 10)
    const raw = match[2]
    const text = extractCleanText(raw)
    const baseId = createSlugId(text, level, options)
    const id = ensureUniqueId(baseId, usedIds)

    headings.push({ id, text, level })
    match = headingRegex.exec(htmlContent)
  }

  return headings
}

export async function addHeadingIds(
  htmlContent: string,
  options: SlugOptions = {},
  translateFn?: TranslationFunction,
): Promise<string> {
  const usedIds = new Set<string>()
  const locale = options.locale ?? 'en'
  const namespace = options.namespace ?? 'blog'
  const resolvedTranslateFn =
    translateFn ??
    (await getTranslations({
      locale,
      namespace,
    }))

  return htmlContent.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/gi,
    (_match, level, attributes, text) => {
      const levelNum = Number.parseInt(level, 10)
      const cleanedText = extractCleanText(text)
      const baseId = createSlugId(cleanedText, levelNum, options)
      const id = ensureUniqueId(baseId, usedIds)

      const quotedIdMatch = attributes.match(/\bid\s*=\s*(["'])([^"']+)\1/i)
      const unquotedIdMatch = attributes.match(/\bid\s*=\s*([^\s>]+)/i)
      const existingId = quotedIdMatch?.[2] ?? unquotedIdMatch?.[1]
      const hasId = Boolean(existingId)
      const anchorHrefId = existingId ?? id
      const finalAttributes = hasId ? attributes : `${attributes} id="${id}"`

      const ariaLabel = resolvedTranslateFn(
        'accessibility.anchorLink.ariaLabel',
        {
          heading: cleanedText,
        },
      )
      const title = resolvedTranslateFn('accessibility.anchorLink.title', {
        heading: cleanedText,
      })

      const anchorLink = `<a href="#${anchorHrefId}" class="heading-anchor" aria-label="${escapeHtmlAttr(ariaLabel)}" title="${escapeHtmlAttr(title)}">
        ${ANCHOR_LINK_ICON}
      </a>`

      const hasClass = /\bclass\s*=\s*"([^"]*)"/i.test(finalAttributes)
      const outputAttributes = hasClass
        ? finalAttributes.replace(
            /\bclass\s*=\s*"([^"]*)"/i,
            (_: string, existing: string) =>
              `class="${existing} heading-with-anchor"`,
          )
        : `${finalAttributes} class="heading-with-anchor"`

      return `<h${level}${outputAttributes}>${text}${anchorLink}</h${level}>`
    },
  )
}
