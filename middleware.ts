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
