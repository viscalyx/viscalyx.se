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

// Quoted-aware attribute matcher to avoid breaking on '>' inside quoted values.
const HEADING_ATTRIBUTES_PATTERN = `(?:(?:"[^"]*"|'[^']*'|[^'">])*)`
const HEADING_REGEX = new RegExp(
  `<h([2-4])${HEADING_ATTRIBUTES_PATTERN}>([\\s\\S]*?)<\\/h\\1>`,
  'gi',
)

export function extractTableOfContentsServer(
  htmlContent: string,
  options: SlugOptions = {},
): TocItem[] {
  const headings: TocItem[] = []
  const usedIds = new Set<string>()
  HEADING_REGEX.lastIndex = 0
  let match: RegExpExecArray | null = HEADING_REGEX.exec(htmlContent)
  while (match !== null) {
    const level = Number.parseInt(match[1], 10)
    const raw = match[2]
    const text = extractCleanText(raw)
    const baseId = createSlugId(text, level, options)
    const id = ensureUniqueId(baseId, usedIds)

    headings.push({ id, text, level })
    match = HEADING_REGEX.exec(htmlContent)
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
    new RegExp(
      `<h([2-4])(${HEADING_ATTRIBUTES_PATTERN})>([\\s\\S]*?)<\\/h\\1>`,
      'gi',
    ),
    (_match, level, attributes, text) => {
      const levelNum = Number.parseInt(level, 10)
      const cleanedText = extractCleanText(text)
      const baseId = createSlugId(cleanedText, levelNum, options)

      const quotedIdMatch = attributes.match(/\bid\s*=\s*(["'])([^"']+)\1/i)
      const unquotedIdMatch = attributes.match(/\bid\s*=\s*([^\s>]+)/i)
      const existingId = quotedIdMatch?.[2] ?? unquotedIdMatch?.[1]
      const hasId = Boolean(existingId)
      if (existingId) {
        usedIds.add(existingId)
      }

      const id = hasId ? existingId : ensureUniqueId(baseId, usedIds)
      const anchorHrefId = escapeHtmlAttr(existingId ?? id)
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
