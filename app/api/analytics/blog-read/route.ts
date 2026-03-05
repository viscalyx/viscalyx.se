import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'
import { SAFE_CATEGORY_PATTERN, SAFE_SLUG_PATTERN } from '@/lib/blog'
import { SITE_URL } from '@/lib/constants'

/** Maximum allowed length for string fields (slug, category, title). */
const MAX_STRING_FIELD_LENGTH = 200

/** Maximum allowed value for timeSpent in seconds (24 hours). */
const MAX_TIME_SPENT = 86_400

/** Title must contain only printable characters (no C0 control chars or DEL). */
// biome-ignore lint/suspicious/noControlCharactersInRegex: Intentional — this pattern exists specifically to reject control characters in user input.
const SAFE_TITLE_PATTERN = /^[^\x00-\x1F\x7F]+$/u

interface BlogReadEvent {
  category: unknown
  readProgress?: unknown
  slug: unknown
  timeSpent?: unknown
  title: unknown
}

/**
 * Rate limiting is enforced at the Cloudflare edge via a WAF Rate Limiting Rule,
 * configured in the Cloudflare Dashboard under:
 *   Protect & Connect → Application Security → WAF → Rate limiting rules.
 *
 * Active rule: "Analytics blog-read rate limit"
 *   - Expression: URI Path equals /api/analytics/blog-read AND Method equals POST
 *   - Characteristics: IP address
 *   - Rate: 12 requests per 10 seconds (unable to choose different)
 *   - Mitigation timeout: 10 seconds (unable to choose different)
 *   - Action: Block (returns 429)
 *
 * This requires the custom domain to be added in Cloudflare Dashboard → Domains
 * with Cloudflare nameservers (DNS must be delegated to Cloudflare on the Free
 * and Pro plans). To keep existing/custom nameservers, the Business plan ($200/mo)
 * or higher is required, which allows proxying individual CNAME records to the
 * Cloudflare network (e.g. CNAME www → {hostname}.cdn.cloudflare.net).
 */

/** Parsed host from SITE_URL — validated once at module load for fail-fast. */
let siteHost: string
try {
  siteHost = new URL(SITE_URL).host
} catch {
  throw new Error(
    `SITE_URL is not a valid URL: "${SITE_URL}". ` +
      'Check the SITE_URL constant in @/lib/constants.',
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
      'ANALYTICS_HASH_SECRET environment variable is required for IP hashing',
    )
  }

  // Cache the imported key — re-import only when the secret rotates
  if (!cachedKey || cachedSecret !== secret) {
    cachedKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function parseFiniteMetric(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    if (trimmedValue === '') {
      return null
    }

    // Strict numeric validation to reject partial parses like "50abc".
    if (
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(trimmedValue)
    ) {
      return null
    }

    const parsedValue = Number.parseFloat(trimmedValue)
    return Number.isFinite(parsedValue) ? parsedValue : null
  }

  return null
}

export async function POST(request: Request) {
  try {
    // Validate request origin to prevent cross-site abuse
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Request body must be a JSON object' },
        { status: 400 },
      )
    }

    const event = body as BlogReadEvent
    const {
      slug: rawSlug,
      category: rawCategory,
      title: rawTitle,
      readProgress: rawReadProgress,
      timeSpent: rawTimeSpent,
    } = event

    // Validate required fields with runtime type checks
    if (
      !isNonEmptyString(rawSlug) ||
      !isNonEmptyString(rawCategory) ||
      !isNonEmptyString(rawTitle)
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid fields: slug, category, title' },
        { status: 400 },
      )
    }

    // Reject excessively long strings before further processing
    if (
      rawSlug.length > MAX_STRING_FIELD_LENGTH ||
      rawCategory.length > MAX_STRING_FIELD_LENGTH ||
      rawTitle.length > MAX_STRING_FIELD_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Field value exceeds maximum length' },
        { status: 400 },
      )
    }

    // Normalize validated strings to avoid fragmented analytics
    const slug = rawSlug.trim()
    const category = rawCategory.trim()
    const title = rawTitle.trim()

    // Validate character sets to prevent injection / polluted analytics
    if (
      !SAFE_SLUG_PATTERN.test(slug) ||
      !SAFE_CATEGORY_PATTERN.test(category) ||
      !SAFE_TITLE_PATTERN.test(title)
    ) {
      return NextResponse.json(
        { error: 'Field contains invalid characters' },
        { status: 400 },
      )
    }

    const parsedReadProgress = parseFiniteMetric(rawReadProgress)
    const parsedTimeSpent = parseFiniteMetric(rawTimeSpent)
    const readProgress =
      parsedReadProgress === null
        ? null
        : Math.min(Math.max(parsedReadProgress, 0), 100)
    const timeSpent =
      parsedTimeSpent === null
        ? null
        : Math.min(Math.max(parsedTimeSpent, 0), MAX_TIME_SPENT)

    // Get request metadata for analytics
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'
    // cSpell:ignore ipcountry
    const country = request.headers.get('cf-ipcountry') || 'unknown'
    const clientIP =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      null

    // Gate: set STORE_HASHED_IP=true to re-enable pseudonymized visitor
    // ID storage (HMAC-SHA-256 hashed IP). Defaults to anonymous tracking
    // (no IP data stored) for GDPR compliance.
    // See docs/analytics-privacy-design.md for rationale.
    const storeHashedIP = process.env.STORE_HASHED_IP === 'true'

    // Conditionally hash the client IP for pseudonymized visitor tracking.
    // When storeHashedIP is false (current default), hashedIP stays null
    // and no IP-derived identifier is stored, keeping analytics
    // fully anonymous under GDPR. Other metadata such as
    // user-agent, referer, and timestamp may still be retained.
    // Skip rate limiting when no client IP is available to avoid
    // funnelling all unknown-IP requests into a single bucket.
    let hashedIP: string | null = null
    if (storeHashedIP && clientIP) {
      try {
        hashedIP = await hashIP(clientIP)
      } catch (hashError) {
        console.warn('Failed to hash client IP:', hashError)
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
            slug.substring(0, 100), // blob1: Article slug (truncated)
            category.substring(0, 100), // blob2: Article category (truncated)
            country, // blob3: Country from Cloudflare
            referer, // blob4: Referrer
            userAgent.substring(0, 100), // blob5: User agent (truncated)
            title.substring(0, 100), // blob6: Article title (truncated)
            hashedIP ?? 'anonymous', // blob7: Hashed IP (GDPR-safe, for unique visitors)
          ],
          doubles: [
            1, // double1: Read count (always 1)
            readProgress ?? 0, // double2: Read progress percentage
            timeSpent ?? 0, // double3: Time spent on page (seconds)
            Date.now(), // double4: Timestamp in milliseconds
          ],
          indexes: [requestId], // index1: Unique request ID for sampling
        })
      }
    } catch (contextError) {
      // Don't fail the request if analytics fails
      console.warn(
        'Failed to get Cloudflare context for analytics:',
        contextError,
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking blog read:', error)
    return NextResponse.json(
      { error: 'Failed to track blog read' },
      { status: 500 },
    )
  }
}
