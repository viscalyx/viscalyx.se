// Cloudflare Pages setup
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')

// Setup development platform if not in production
if (process.env.NODE_ENV === 'development') {
  try {
    setupDevPlatform()
  } catch (error) {
    console.warn(
      'Warning: Failed to setup Cloudflare development platform:',
      error.message
    )
  }
}

const withNextIntl = require('next-intl/plugin')('./i18n.ts')
const { codecovNextJSWebpackPlugin } = require('@codecov/nextjs-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  eslint: {
    ignoreDuringBuilds: false,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
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
                "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'",
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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ws://localhost:*; frame-ancestors 'none'; base-uri 'self'",
          },
        ],
      },
    ]
  },
  webpack: (config, options) => {
    // Add Codecov bundle analysis plugin
    config.plugins.push(
      codecovNextJSWebpackPlugin({
        enableBundleAnalysis: true,
        bundleName: 'viscalyx-se-bundle',
        uploadToken: process.env.CODECOV_TOKEN,
        webpack: options.webpack,
        // Disable telemetry for better privacy
        telemetry: false,
      })
    )

    return config
  },
}

module.exports = withNextIntl(nextConfig)
