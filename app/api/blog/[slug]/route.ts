import { getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'
import path from 'node:path'

// Slug validation pattern: only allow alphanumerics, hyphens, and underscores
const SAFE_SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/

/**
 * Validates that a slug is safe and doesn't allow path traversal attacks.
 * Returns the validated slug or null if invalid.
 */
function validateSlug(slug: string): string | null {
  // Check against allowlist pattern
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    return null
  }

  // Additional path traversal check: normalize and verify the path stays within blog-content
  const blogContentDir = path.join(process.cwd(), 'public', 'blog-content')
  const normalizedPath = path.normalize(
    path.join(blogContentDir, `${slug}.json`)
  )

  // Ensure the normalized path starts with the blog-content directory
  if (!normalizedPath.startsWith(blogContentDir + path.sep)) {
    return null
  }

  return slug
}

// Analytics tracking function
function trackBlogRead(slug: string, category: string, request: Request) {
  try {
    // Get request metadata for analytics
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'
    // cSpell:ignore ipcountry
    const country = request.headers.get('cf-ipcountry') || 'unknown'

    // Create a unique request ID for sampling
    const requestId = crypto.randomUUID()

    // Write data point to Analytics Engine
    try {
      const { env } = getCloudflareContext()
      if (env?.viscalyx_se?.writeDataPoint) {
        env.viscalyx_se.writeDataPoint({
          blobs: [
            slug, // blob1: Article slug
            category, // blob2: Article category
            country, // blob3: Country from Cloudflare
            referer, // blob4: Referrer
            userAgent.substring(0, 100), // blob5: User agent (truncated)
          ],
          doubles: [
            1, // double1: Read count (always 1)
            Date.now(), // double2: Timestamp in milliseconds
          ],
          indexes: [requestId], // index1: Unique request ID for sampling
        })
      }
    } catch (contextError) {
      // Don't fail the request if analytics fails
      console.warn(
        'Failed to get Cloudflare context for analytics:',
        contextError
      )
    }
  } catch (error) {
    // Don't fail the request if analytics fails
    console.warn('Analytics tracking failed:', error)
  }
}

// Load blog content from static file via Cloudflare ASSETS binding or filesystem fallback
async function loadBlogContent(
  slug: string,
  request: Request
): Promise<string | null> {
  try {
    // Try to use Cloudflare ASSETS binding first (works in production)
    try {
      const { env } = getCloudflareContext()
      if (env?.ASSETS) {
        // Create a request to the static asset
        const assetUrl = new URL(`/blog-content/${slug}.json`, request.url)
        const assetResponse = await env.ASSETS.fetch(assetUrl.toString())
        if (assetResponse.ok) {
          const data = await assetResponse.json()
          return (data as { content: string }).content
        }
      }
    } catch {
      // ASSETS binding not available, fall through to filesystem
    }

    // Fallback: Read from filesystem (works in local development)
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const contentPath = path.join(
      process.cwd(),
      'public',
      'blog-content',
      `${slug}.json`
    )
    const contentData = await fs.readFile(contentPath, 'utf-8')
    const parsed = JSON.parse(contentData) as { content?: string }
    return typeof parsed.content === 'string' ? parsed.content : null
  } catch {
    return null
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Validate slug to prevent path traversal attacks
    const validatedSlug = validateSlug(slug)
    if (!validatedSlug) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    const postMetadata = getPostBySlug(validatedSlug)

    if (!postMetadata) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Load content from separate static file (via ASSETS binding or filesystem)
    const content = await loadBlogContent(validatedSlug, request)

    if (!content) {
      return NextResponse.json(
        { error: 'Post content not found' },
        { status: 404 }
      )
    }

    // Combine metadata with content
    const post = { ...postMetadata, content }

    // Track the blog read event
    // cSpell:ignore uncategorized
    trackBlogRead(validatedSlug, post.category || 'uncategorized', request)

    const relatedPosts = await getRelatedPosts(post.slug, post.category)

    return NextResponse.json({
      post,
      relatedPosts,
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
