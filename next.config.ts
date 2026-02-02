import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  // Exclude heavy packages from server bundle to reduce Cloudflare Worker size
  // These packages are either client-only or not needed in the worker runtime
  serverExternalPackages: ['mermaid', '@mermaid-js/parser', 'dompurify'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  typedRoutes: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'Permissions-Policy',
              value:
                'accelerometer=(), attribution-reporting=(), autoplay=(), bluetooth=(), browsing-topics=(), camera=(), compute-pressure=(), cross-origin-isolated=(), deferred-fetch=(), deferred-fetch-minimal=(), display-capture=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(self), gyroscope=(), hid=(), identity-credentials-get=(), idle-detection=(), language-detector=(), local-fonts=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), summarizer=(), translator=(), usb=(), web-share=(), window-management=(), xr-spatial-tracking=()',
            },
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'",
            },
          ],
        },
      ]
    }
    // Development (non-production) headers, including HMR/eval and ws for dev tooling
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value:
              'accelerometer=(), attribution-reporting=(), autoplay=(), bluetooth=(), browsing-topics=(), camera=(), compute-pressure=(), cross-origin-isolated=(), deferred-fetch=(), deferred-fetch-minimal=(), display-capture=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(self), gyroscope=(), hid=(), identity-credentials-get=(), idle-detection=(), language-detector=(), local-fonts=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), summarizer=(), translator=(), usb=(), web-share=(), window-management=(), xr-spatial-tracking=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; connect-src 'self' ws://localhost:*; frame-ancestors 'none'; base-uri 'self'",
          },
        ],
      },
    ]
  },
}

// Initialize OpenNext Cloudflare for development (non-production)
// This needs to be done conditionally and without top-level await
if (process.env.NODE_ENV !== 'production') {
  import('@opennextjs/cloudflare')
    .then(({ initOpenNextCloudflareForDev }) => {
      initOpenNextCloudflareForDev()
    })
    .catch(error => {
      console.warn(
        'Warning: Failed to load @opennextjs/cloudflare module:',
        error instanceof Error ? error.message : 'Unknown error'
      )
    })
}

export default withNextIntl(nextConfig)
