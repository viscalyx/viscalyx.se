import { SITE_URL } from '@/lib/constants'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

interface BlogReadEvent {
  slug: string
  category: string
  title: string
  readProgress?: number
  timeSpent?: number
}

/**
 * In-memory rate limiter: hashed-IP → last request timestamp.
 *
 * NOTE: This is a best-effort mitigation. In serverless/edge deployments
 * (e.g. Cloudflare Workers via @opennextjs/cloudflare), each isolate gets its
 * own map instance, so requests hitting different isolates bypass this limit.
 * Isolate recycling also resets the map.
 *
 * TODO: Switch to Cloudflare WAF Rate Limiting Rules once on a paid plan.
 * This moves enforcement to the edge (before the Worker runs) and is reliable
 * across all isolates. Steps to enable:
 *   1. Upgrade to Cloudflare Pro plan ($20/mo) or higher.
 *   2. Add the custom domain in Cloudflare Dashboard → Domains and switch to
 *      Cloudflare nameservers. WAF (and other proxy features) require traffic
 *      to flow through Cloudflare's network, which needs the domain on
 *      Cloudflare. On the Free and Pro plans this means migrating DNS to
 *      Cloudflare's nameservers entirely — custom nameservers are only
 *      available on the Business plan ($200/mo) or higher, where you can keep
 *      your existing nameservers and proxy individual CNAME records to the
 *      Cloudflare network (e.g. CNAME www → {hostname}.cdn.cloudflare.net).
 *      In short: Free/Pro cannot use WAF without moving DNS to Cloudflare.
 *   3. Go to Cloudflare Dashboard → Protect & Connect → Application Security
 *      → WAF → Rate limiting rules.
 *   4. Create a rule with:
 *      - Name: "Analytics blog-read rate limit"
 *      - Expression: (http.request.uri.path eq "/api/analytics/blog-read"
 *                      and http.request.method eq "POST")
 *      - Characteristics: IP address
 *      - Rate: 12 requests per 1 minute
 *      - Mitigation timeout: 60 seconds
 *      - Action: Block (returns 429)
 *   5. Remove rateLimitMap, RATE_LIMIT_WINDOW_MS, and the rate-limit check
 *      block from this file.
 */
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 5_000 // 5 seconds between requests per IP
const RATE_LIMIT_MAX_ENTRIES = 50_000 // Hard cap to prevent unbounded growth

/** Parsed host from SITE_URL — validated once at module load for fail-fast. */
let siteHost: string
try {
  siteHost = new URL(SITE_URL).host
} catch {
  throw new Error(
    `SITE_URL is not a valid URL: "${SITE_URL}". ` +
      'Check the SITE_URL constant in @/lib/constants.'
  )
}

/** Cached HMAC key — re-imported only when the secret changes. */
let cachedKey: CryptoKey | null = null
let cachedSecret: string | null = null

/**
 * Generate an HMAC-SHA-256 hash of an IP address with a daily-rotating salt.
 * Uses a server-side secret to prevent brute-force reversal of hashed IPs.
 * This allows unique-visitor counting without storing raw IP addresses (GDPR).
 */
async function hashIP(ip: string): Promise<string> {
  const secret = process.env.ANALYTICS_HASH_SECRET
  if (!secret) {
    throw new Error(
      'ANALYTICS_HASH_SECRET environment variable is required for IP hashing'
    )
  }

  // Cache the imported key — re-import only when the secret rotates
  if (!cachedKey || cachedSecret !== secret) {
    cachedKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    cachedSecret = secret
  }

  const dailySalt = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const data = new TextEncoder().encode(`${dailySalt}:${ip}`)
  const signature = await crypto.subtle.sign('HMAC', cachedKey, data)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate that the request originates from the same site.
 * Checks both Origin and Referer headers against the configured SITE_URL.
 */
function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

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

  // Neither header present — reject (sendBeacon typically sends Origin)
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
    const clientIP =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      null

    // Hash the IP for GDPR compliance — never store raw IPs
    // Skip rate limiting when no client IP is available to avoid
    // funnelling all unknown-IP requests into a single bucket.
    const hashedIP = clientIP ? await hashIP(clientIP) : null

    if (hashedIP) {
      // Rate limiting per hashed IP
      const now = Date.now()
      const lastRequest = rateLimitMap.get(hashedIP)
      if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
      rateLimitMap.set(hashedIP, now)
    }

    // Periodically clean old entries to prevent memory growth
    if (rateLimitMap.size > 10_000) {
      const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
      for (const [key, ts] of rateLimitMap) {
        if (ts < cutoff) rateLimitMap.delete(key)
      }
      // Hard cap: if the map is still too large after sweeping expired
      // entries (e.g. sustained attack from many unique IPs), clear it
      // entirely. The serverless isolate already acts as an implicit
      // reset, so losing in-flight rate-limit state is acceptable.
      if (rateLimitMap.size > RATE_LIMIT_MAX_ENTRIES) {
        rateLimitMap.clear()
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
            hashedIP ?? 'anonymous', // blob7: Hashed IP (GDPR-safe, for unique visitors)
          ],
          doubles: [
            1, // double1: Read count (always 1)
            body.readProgress ?? 0, // double2: Read progress percentage
            body.timeSpent ?? 0, // double3: Time spent on page (seconds)
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
