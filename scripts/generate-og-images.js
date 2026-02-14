#!/usr/bin/env node

/**
 * Generate Open Graph images for social sharing.
 *
 * Uses sharp to composite the Viscalyx logo onto a branded gradient
 * background at the standard OG image size (1200×630).
 *
 * Reads localized text from the translation files in messages/ so each
 * locale gets its own OG image with the correct language.
 *
 * Usage:
 *   node scripts/generate-og-images.js
 *
 * Output:
 *   public/og-blog-en.png   — OG image for the English blog page
 *   public/og-blog-sv.png   — OG image for the Swedish blog page
 */

let sharp
try {
  sharp = require('sharp')
} catch {
  console.error(
    '\n\x1b[31mError: "sharp" is not installed.\x1b[0m\n\n' +
      'This script requires the sharp package to generate OG images.\n' +
      'Install it manually and re-run:\n\n' +
      '  npm install sharp\n\n' +
      'sharp is intentionally not a project devDependency because this\n' +
      'script is run rarely. You can remove it afterwards with:\n\n' +
      '  npm uninstall sharp\n'
  )
  process.exit(1)
}
const fs = require('fs')
const path = require('path')

// Brand colors (from globals.css --color-primary-*)
const PRIMARY_600 = '#2563eb'
const PRIMARY_700 = '#1d4ed8'
const PRIMARY_900 = '#1e3a8a'
const SECONDARY_900 = '#0f172a'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const LOGO_SIZE = 280

const LOCALES = ['en', 'sv']

/**
 * Escape a string for safe inclusion in SVG text content.
 */
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Read localized blog OG strings from the messages JSON for a given locale.
 */
function getLocaleStrings(locale) {
  const filePath = path.join(__dirname, '..', 'messages', `${locale}.json`)
  const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const blog = messages.blog
  if (!blog?.og?.title || !blog?.og?.tagline) {
    throw new Error(`Missing blog.og.title or blog.og.tagline in messages/${locale}.json`)
  }
  return {
    title: blog.og.title,
    tagline: blog.og.tagline,
  }
}

async function generateBlogOG(locale) {
  const logoPath = path.join(__dirname, '..', 'public', 'viscalyx_logo.svg')
  const outputPath = path.join(
    __dirname,
    '..',
    'public',
    `og-blog-${locale}.png`
  )

  const { title, tagline } = getLocaleStrings(locale)

  // Render the SVG logo at the target size with a transparent background
  const logo = await sharp(logoPath)
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  // Create an SVG background with a gradient and localized text
  const backgroundSVG = `
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${SECONDARY_900}" />
      <stop offset="50%" stop-color="${PRIMARY_900}" />
      <stop offset="100%" stop-color="${PRIMARY_700}" />
    </linearGradient>
    <!-- Subtle dot pattern for texture -->
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1" fill="white" opacity="0.06" />
    </pattern>
    <!-- Decorative circles -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${PRIMARY_600}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${PRIMARY_600}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Base gradient -->
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)" />

  <!-- Dot pattern overlay -->
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#dots)" />

  <!-- Decorative glow blobs -->
  <circle cx="200" cy="500" r="300" fill="url(#glow)" />
  <circle cx="1000" cy="150" r="250" fill="url(#glow)" />

  <!-- Bottom accent line -->
  <rect x="0" y="${OG_HEIGHT - 4}" width="${OG_WIDTH}" height="4" fill="${PRIMARY_600}" />

  <!-- Title text on the right side -->
  <text
    x="780"
    y="${OG_HEIGHT / 2 - 20}"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-size="72"
    font-weight="700"
    fill="white"
    text-anchor="middle"
  >${escapeXml(title)}</text>

  <!-- Tagline -->
  <text
    x="780"
    y="${OG_HEIGHT / 2 + 40}"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-size="24"
    font-weight="400"
    fill="white"
    opacity="0.7"
    text-anchor="middle"
  >${escapeXml(tagline)}</text>

  <!-- Viscalyx name at bottom -->
  <text
    x="780"
    y="${OG_HEIGHT - 40}"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-size="18"
    font-weight="500"
    fill="white"
    opacity="0.5"
    text-anchor="middle"
    letter-spacing="4"
  >VISCALYX</text>
</svg>`

  const background = await sharp(Buffer.from(backgroundSVG))
    .resize(OG_WIDTH, OG_HEIGHT)
    .png()
    .toBuffer()

  // Composite: place logo on the left-center area
  const logoX = Math.round(OG_WIDTH * 0.18 - LOGO_SIZE / 2) // ~216 - 140 = 76
  const logoY = Math.round((OG_HEIGHT - LOGO_SIZE) / 2)

  await sharp(background)
    .composite([
      {
        input: logo,
        left: logoX,
        top: logoY,
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  const stats = fs.statSync(outputPath)
  console.log(
    `✓ Generated ${path.relative(process.cwd(), outputPath)} (${Math.round(stats.size / 1024)}KB)`
  )
}

Promise.allSettled(LOCALES.map(locale => generateBlogOG(locale))).then(results => {
  const failures = results.filter(r => r.status === 'rejected')
  if (failures.length > 0) {
    failures.forEach(f => console.error('OG image generation failed:', f.reason))
    process.exit(1)
  }
})
