import { NextResponse } from 'next/server'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

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
      const { env } = getRequestContext()
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Track the blog read event
    // cSpell:ignore uncategorized
    trackBlogRead(slug, post.category || 'uncategorized', request)

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
