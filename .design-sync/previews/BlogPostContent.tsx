import slugify from 'slugify'
import { BlogPostContent, BlogPostMarkdownContent } from 'viscalyx-site'
import blogData from '../../lib/blog-data.json'
import team from '../../messages/en.json'
import content from '../../public/blog-content/hyperv-time-machine-setup.json'

// Mirrors app/[locale]/blog/[slug]/page.tsx: heading ids + ToC, author card, related posts.
const slug = 'hyperv-time-machine-setup'
const allPosts = blogData.posts.filter(p => p.slug !== 'template')
const found = allPosts.find(p => p.slug === slug)
if (!found) throw new Error(`blog-data.json has no post "${slug}"`)
const meta = found
const post = {
  ...meta,
  category: meta.category ?? 'Infrastructure',
  date: meta.date ?? null,
}

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

// Mirrors lib/slug-utils-server addHeadingIds + extractTableOfContentsServer.
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
const tableOfContents: { id: string; text: string; level: number }[] = []
const contentWithIds = withHeadingIds(content.content, tableOfContents)

// lib/blog.ts getRelatedPosts: same category first, then most recent.
const others = allPosts.filter(p => p.slug !== slug)
const sameCategory = others
  .filter(p => p.category === post.category)
  .slice(0, 3)
const relatedPosts = [
  ...sameCategory,
  ...others.filter(p => !sameCategory.includes(p)),
]
  .slice(0, 3)
  .map(rp => ({ slug: rp.slug, title: rp.title, image: rp.image }))

// lib/team.ts getSerializableTeamMemberByName for the author (copy from messages/en.json).
const johlju = team.team.members.johlju
const teamMember = {
  id: 'johlju',
  name: 'Johan Ljunggren',
  role: johlju.role,
  image: '/johlju-profile.jpg',
  bio: johlju.bio,
  location: 'Sweden',
  specialties: johlju.specialties,
  socialLinks: [
    { name: 'Email' as const, href: 'mailto:johan.ljunggren@viscalyx.se' },
    {
      name: 'LinkedIn' as const,
      href: 'https://linkedin.com/in/johanljunggren',
    },
    { name: 'GitHub' as const, href: 'https://github.com/johlju' },
  ],
}

const Post = () => (
  <BlogPostContent
    authorInitials="JL"
    post={post}
    relatedPosts={relatedPosts}
    tableOfContents={tableOfContents}
    teamMember={teamMember}
  >
    <BlogPostMarkdownContent contentWithIds={contentWithIds} />
  </BlogPostContent>
)

export const Default = () => <Post />

export const DarkMode = () => (
  <div className="dark">
    <div className="bg-secondary-900 text-secondary-100">
      <Post />
    </div>
  </div>
)
