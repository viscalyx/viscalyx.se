// NOTE: This file is intentionally named middleware.ts instead of proxy.ts
// OpenNext for Cloudflare does not yet support the new Next.js 16 "proxy" convention.
// The proxy.ts file runs on Node.js runtime, but Cloudflare Workers only supports
// edge middleware. Keep this as middleware.ts until OpenNext adds proxy support.
// See: https://github.com/opennextjs/opennextjs-cloudflare/issues/1093

import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales } from '@/i18n'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // When the user visits the root path, automatically detect the locale
  localeDetection: true,
})

// Production CSP with per-request nonce for inline scripts.
//
// Why middleware? CSP is set here instead of next.config.ts headers() because
// the app uses legitimate inline scripts (theme detection, JSON-LD structured
// data) that require a nonce to execute. A per-request nonce in script-src
// (e.g. 'nonce-<uuid>') blocks all injected scripts that lack the nonce —
// this is CSP's primary XSS defense. Static headers in next.config.ts cannot
// vary per request, so they would need script-src 'unsafe-inline' which
// permits any injected script and effectively disables CSP protection.
// See: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
//
// style-src-attr still requires 'unsafe-inline' due to Framer Motion runtime
// inline style attributes and Shiki syntax highlighting CSS custom properties.
// style-src-elem is locked to 'self' — injected <style> elements are blocked.
// See security_best_practices_report.md SBP-001.
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src-elem 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ')
}

function buildDevCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`,
    "style-src-elem 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' ws://localhost:* ws://0.0.0.0:* ws://127.0.0.1:* wss://localhost:* wss://0.0.0.0:* wss://127.0.0.1:*",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ')
}

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  const nonce = crypto.randomUUID()

  // Propagate nonce as a request-header override so Server Components
  // can read it via headers().get('x-nonce'). This mirrors what
  // NextResponse.next({ request: { headers } }) does internally.
  const overrideKey = 'x-middleware-override-headers'
  const existing = response.headers.get(overrideKey)
  const list = existing ? existing.split(',').map(h => h.trim()) : []
  if (!list.includes('x-nonce')) {
    list.push('x-nonce')
  }
  response.headers.set(overrideKey, list.join(','))
  response.headers.set('x-middleware-request-x-nonce', nonce)

  const csp =
    process.env.NODE_ENV === 'production' ? buildCsp(nonce) : buildDevCsp(nonce)
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    // Match root
    '/',
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - all files with a file extension (e.g. favicon.ico)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
