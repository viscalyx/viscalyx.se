import slugify from 'slugify'
import {
  AlertIconInjector,
  BlogPostMarkdownContent,
  CodeBlockEnhancer,
} from 'viscalyx-site'
import blockquotes from '../../public/blog-content/blockquotes-examples.json'
import timeMachine from '../../public/blog-content/hyperv-time-machine-setup.json'

// Mirrors lib/slug-utils-client createSlugId + ensureUniqueId (that module's sanitize-html
// dependency doesn't bundle for the browser, so the same slugify options are applied here).
const cleanText = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ??
  ''
const idFactory = () => {
  const used = new Set<string>()
  return (text: string) => {
    const base = slugify(text, {
      lower: true,
      strict: false,
      locale: 'en',
      trim: true,
    })
    let id = base
    for (let n = 1; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    return id
  }
}
const ANCHOR_LINK_ICON = `<svg class="heading-anchor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>`
const escapeAttr = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Mirrors lib/slug-utils-server addHeadingIds (English labels) - the page runs it before render.
const withHeadingIds = (
  html: string,
  toc?: { id: string; text: string; level: number }[],
) => {
  const nextId = idFactory()
  return html.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_m, level, attrs, text) => {
      const clean = cleanText(text)
      const id = nextId(clean)
      toc?.push({ id, text: clean, level: Number(level) })
      const label = escapeAttr(`Link to section: ${clean}`)
      const title = escapeAttr(`Copy link to section: ${clean}`)
      return `<h${level}${attrs} id="${id}" class="heading-with-anchor">${text}<a href="#${id}" class="heading-anchor" aria-label="${label}" title="${title}">${ANCHOR_LINK_ICON}</a></h${level}>`
    },
  )
}

// First `count` h2 sections of a pre-rendered post.
const sections = (html: string, count: number) => {
  const starts = [...html.matchAll(/<h2[\s>]/g)].map(m => m.index ?? 0)
  return starts.length > count ? html.slice(0, starts[count]) : html
}

// Same wrapper and enhancers as BlogPostContent.
const Article = ({ html }: { html: string }) => (
  <div className="blog-content prose prose-lg max-w-3xl p-6">
    <AlertIconInjector>
      <BlogPostMarkdownContent contentWithIds={withHeadingIds(html)} />
      <CodeBlockEnhancer contentLoaded />
    </AlertIconInjector>
  </div>
)

export const PostExcerpt = () => (
  <Article html={sections(timeMachine.content, 2)} />
)

export const Alerts = () => (
  <Article
    html={blockquotes.content.slice(
      blockquotes.content.indexOf('<h2>DocFX-style</h2>'),
    )}
  />
)

export const DarkMode = () => (
  <div className="dark">
    <div className="bg-secondary-900 text-secondary-100">
      <Article html={sections(timeMachine.content, 2)} />
    </div>
  </div>
)
