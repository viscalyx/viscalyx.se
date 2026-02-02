// NOTE: This file is intentionally named middleware.ts instead of proxy.ts
// OpenNext for Cloudflare does not yet support the new Next.js 16 "proxy" convention.
// The proxy.ts file runs on Node.js runtime, but Cloudflare Workers only supports
// edge middleware. Keep this as middleware.ts until OpenNext adds proxy support.
// See: https://github.com/opennextjs/opennextjs-cloudflare/issues/1093

import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // When the user visits the root path, automatically detect the locale
  localeDetection: true,
})

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
