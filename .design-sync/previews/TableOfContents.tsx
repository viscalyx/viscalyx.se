import { BookOpen } from 'lucide-react'
import slugify from 'slugify'
import { TableOfContents } from 'viscalyx-site'
import timeMachine from '../../public/blog-content/hyperv-time-machine-setup.json'

// Headings of the "Hyper-V Time Machine" post, with the ids lib/slug-utils-server generates.
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
const toc = (html: string) => {
  const nextId = idFactory()
  return [...html.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
    ([, level, raw]) => {
      const text = cleanText(raw)
      return { id: nextId(text), text, level: Number(level) }
    },
  )
}
const items = toc(timeMachine.content)

// Desktop sidebar card, as in BlogPostContent.
export const Sidebar = () => (
  <div className="w-80 bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-secondary-100 dark:border-secondary-700">
    <h2
      className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center"
      id="toc-heading"
    >
      <BookOpen className="w-5 h-5 mr-2" />
      Table of Contents
    </h2>
    <TableOfContents headingId="toc-heading" items={items} maxHeight="lg" />
  </div>
)

export const Compact = () => (
  <div className="w-80 rounded-lg border border-secondary-200 bg-white p-4">
    <TableOfContents
      items={items.filter(item => item.level === 2)}
      maxHeight="sm"
    />
  </div>
)

export const DarkMode = () => (
  <div className="dark">
    <div className="bg-secondary-900 p-6 text-secondary-100">
      <Sidebar />
    </div>
  </div>
)
