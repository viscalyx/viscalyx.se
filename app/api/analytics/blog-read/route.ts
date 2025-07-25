import { NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

interface BlogReadEvent {
  slug: string
  category: string
  title: string
  readProgress?: number
  timeSpent?: number
}

export async function POST(request: Request) {
  try {
    const body: BlogReadEvent = await request.json()

    // Validate required fields
    if (!body.slug || !body.category || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, category, and title' },
        { status: 400 }
      )
    }

    // Get request metadata for analytics
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'
    // cSpell:ignore ipcountry
    const country = request.headers.get('cf-ipcountry') || 'unknown'
    const clientIP = request.headers.get('cf-connecting-ip') || 'unknown'

    // Create a unique request ID for sampling
    const requestId = crypto.randomUUID()

    // Write data point to Analytics Engine
    try {
      const { env } = getRequestContext()
      if (env?.viscalyx_se?.writeDataPoint) {
        env.viscalyx_se.writeDataPoint({
          blobs: [
            body.slug, // blob1: Article slug
            body.category, // blob2: Article category
            country, // blob3: Country from Cloudflare
            referer, // blob4: Referrer
            userAgent.substring(0, 100), // blob5: User agent (truncated)
            body.title.substring(0, 100), // blob6: Article title (truncated)
            clientIP, // blob7: Client IP (for unique visitors)
          ],
          doubles: [
            1, // double1: Read count (always 1)
            body.readProgress || 0, // double2: Read progress percentage
            body.timeSpent || 0, // double3: Time spent on page (seconds)
            Date.now(), // double4: Timestamp in milliseconds
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking blog read:', error)
    return NextResponse.json(
      { error: 'Failed to track blog read' },
      { status: 500 }
    )
  }
}
