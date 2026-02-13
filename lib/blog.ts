import blogData from './blog-data.json'
import { isValidDate, normalizeDate } from './date-utils'

// BlogPostMetadata without content (for listings - stored in blog-data.json)
export interface BlogPostMetadata {
  slug: string
  title: string
  date?: string
  author: string
  excerpt: string
  image: string
  imageAlt?: string
  tags: string[]
  readTime: string
  category?: string
}

// BlogPost with content (for single post pages)
export interface BlogPost extends BlogPostMetadata {
  content: string
}

// Blog data now only contains metadata (no content)
interface BlogData {
  posts: BlogPostMetadata[]
  slugs: string[]
}

// Since we have a .d.ts file for blog-data.json, TypeScript knows the structure
// We only need minimal validation to ensure runtime safety
function validateBlogData(data: typeof blogData): BlogData {
  // Basic runtime validation to catch any JSON corruption or build issues
  if (!data || typeof data !== 'object') {
    throw new Error('Blog data is not an object')
  }

  if (!Array.isArray(data.posts)) {
    throw new Error('Blog data posts is not an array')
  }

  if (!Array.isArray(data.slugs)) {
    throw new Error('Blog data slugs is not an array')
  }

  // Sanitize posts to match BlogPostMetadata interface (no content)
  const posts: BlogPostMetadata[] = data.posts.map(p => ({
    slug: p.slug,
    title: p.title,
    date:
      typeof p.date === 'string' && isValidDate(p.date)
        ? normalizeDate(p.date)
        : undefined,
    author: p.author,
    excerpt: p.excerpt,
    image: p.image,
    tags: Array.isArray(p.tags)
      ? Array.from(
          new Set(
            p.tags.filter(t => typeof t === 'string').map(t => t.toLowerCase())
          )
        )
      : [],
    readTime: p.readTime,
    category: typeof p.category === 'string' ? p.category : undefined,
  }))
  return {
    posts,
    slugs: data.slugs,
  }
}

// Validate the imported blog data
function getValidatedBlogData(): BlogData {
  return validateBlogData(blogData)
}

// Get all blog post slugs for static generation
export function getAllPostSlugs(): string[] {
  const validatedData = getValidatedBlogData()
  const allSlugs = validatedData.slugs

  // Filter out template slug only if there are more than 1 slug
  return allSlugs.length > 1
    ? allSlugs.filter(slug => slug !== 'template')
    : allSlugs
}

// Get blog post metadata by slug (without content)
export function getPostMetadata(slug: string): BlogPostMetadata | null {
  const validatedData = getValidatedBlogData()
  const post = validatedData.posts.find(p => p.slug === slug)
  return post || null
}

// Get blog post data by slug (with content loaded from separate file)
// Note: Content is now loaded from /blog-content/[slug].json via API
export function getPostData(slug: string): BlogPostMetadata | null {
  return getPostMetadata(slug)
}

// Alias for getPostData for consistency
export function getPostBySlug(slug: string): BlogPostMetadata | null {
  return getPostMetadata(slug)
}

// Get all blog posts metadata (for listing pages)
export function getAllPosts(): BlogPostMetadata[] {
  const validatedData = getValidatedBlogData()
  const allPosts = validatedData.posts

  // Filter out template post only if there are more than 1 post
  return allPosts.length > 1
    ? allPosts.filter(post => post.slug !== 'template')
    : allPosts
}

// Get featured post (most recent)
export function getFeaturedPost(): BlogPostMetadata | null {
  const posts = getAllPosts() // This now automatically filters out template when other posts exist
  return posts.length > 0 ? posts[0] : null
}

// Get related posts by tags or category
export function getRelatedPosts(
  currentSlug: string,
  category?: string,
  limit: number = 3
): BlogPostMetadata[] {
  const allPosts = getAllPosts() // This now automatically filters out template when other posts exist
  let relatedPosts = allPosts.filter(post => post.slug !== currentSlug)

  // If category is provided, find posts with matching category or tags
  if (category) {
    relatedPosts = relatedPosts.filter(
      post => post.category === category || post.tags.includes(category)
    )
  }

  relatedPosts = relatedPosts.slice(0, limit)

  // If we don't have enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const additionalPosts = allPosts
      .filter(post => post.slug !== currentSlug)
      .filter(post => !relatedPosts.some(related => related.slug === post.slug))
      .slice(0, limit - relatedPosts.length)

    relatedPosts.push(...additionalPosts)
  }

  return relatedPosts
}

// Slug validation pattern: only allow alphanumerics, hyphens, and underscores
const SAFE_SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/

/**
 * Validates that a slug is safe and doesn't allow path traversal attacks.
 * Returns the validated slug or null if invalid.
 */
export function validateSlug(slug: string): string | null {
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    return null
  }
  return slug
}

/**
 * Load blog content from static file via Cloudflare ASSETS binding or filesystem fallback.
 * Works in both server components and API routes.
 */
export async function loadBlogContent(slug: string): Promise<string | null> {
  // Validate slug to prevent path traversal attacks
  const validatedSlug = validateSlug(slug)
  if (!validatedSlug) {
    return null
  }

  try {
    // Try to use Cloudflare ASSETS binding first (works in production)
    try {
      const { getCloudflareContext } = await import(
        '@opennextjs/cloudflare' as string
      )
      const { env } = getCloudflareContext()
      if (env?.ASSETS) {
        const assetUrl = `https://placeholder.local/blog-content/${encodeURIComponent(validatedSlug)}.json`
        const assetResponse = await env.ASSETS.fetch(assetUrl)
        if (assetResponse.ok) {
          const data = await assetResponse.json()
          const parsed = data as { content?: unknown }
          return typeof parsed.content === 'string' ? parsed.content : null
        }
      }
    } catch {
      // ASSETS binding not available, fall through to filesystem
    }

    // Fallback: Read from filesystem (works in local development and build time)
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const contentPath = path.join(
      process.cwd(),
      'public',
      'blog-content',
      `${validatedSlug}.json`
    )
    const contentData = await fs.readFile(contentPath, 'utf-8')
    const parsed = JSON.parse(contentData) as { content?: string }
    return typeof parsed.content === 'string' ? parsed.content : null
  } catch {
    return null
  }
}

/**
 * Track a basic page view for a blog post (no PII).
 * Equivalent to server access logs — slug + timestamp only.
 * Fire-and-forget: errors are silently swallowed.
 */
export function trackPageView(slug: string, category: string): void {
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    const { env } = getCloudflareContext()
    if (env?.viscalyx_se?.writeDataPoint) {
      env.viscalyx_se.writeDataPoint({
        blobs: [slug, category],
        doubles: [1, Date.now()],
        indexes: [crypto.randomUUID()],
      })
    }
  } catch {
    // Don't fail the page render if analytics fails
  }
}
