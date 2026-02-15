import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { SITE_URL } from '@/lib/constants'

interface BlogReadEvent {
  slug: string
  category: string
  title: string
  readProgress?: number
  timeSpent?: number
}

/** In-memory rate limiter: hashed-IP → last request timestamp */
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 5_000 // 5 seconds between requests per IP

/**
 * Generate a SHA-256 hash of an IP address with a daily-rotating salt.
 * This allows unique-visitor counting without storing raw IP addresses (GDPR).
 */
async function hashIP(ip: string): Promise<string> {
  const dailySalt = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const data = new TextEncoder().encode(`${dailySalt}:${ip}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate that the request originates from the same site.
 * Checks both Origin and Referer headers against the configured SITE_URL.
 */
function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const siteHost = new URL(SITE_URL).host

  if (origin) {
    try {
      return new URL(origin).host === siteHost
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      return new URL(referer).host === siteHost
    } catch {
      return false
    }
  }

  // Neither header present — reject (sendBeacon always sends Origin)
  return false
}

export async function POST(request: Request) {
  try {
    // Validate request origin to prevent cross-site abuse
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    // Hash the IP for GDPR compliance — never store raw IPs
    const hashedIP = await hashIP(clientIP)

    // Rate limiting per hashed IP
    const now = Date.now()
    const lastRequest = rateLimitMap.get(hashedIP)
    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    rateLimitMap.set(hashedIP, now)

    // Periodically clean old entries to prevent memory growth
    if (rateLimitMap.size > 10_000) {
      const cutoff = now - RATE_LIMIT_WINDOW_MS
      for (const [key, ts] of rateLimitMap) {
        if (ts < cutoff) rateLimitMap.delete(key)
      }
    }

    // Create a unique request ID for sampling
    const requestId = crypto.randomUUID()

    // Write data point to Analytics Engine
    try {
      const { env } = getCloudflareContext()
      if (env?.viscalyx_se?.writeDataPoint) {
        env.viscalyx_se.writeDataPoint({
          blobs: [
            body.slug, // blob1: Article slug
            body.category, // blob2: Article category
            country, // blob3: Country from Cloudflare
            referer, // blob4: Referrer
            userAgent.substring(0, 100), // blob5: User agent (truncated)
            body.title.substring(0, 100), // blob6: Article title (truncated)
            hashedIP, // blob7: Hashed IP (GDPR-safe, for unique visitors)
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
