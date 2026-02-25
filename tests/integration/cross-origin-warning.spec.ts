import fs from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * Test to verify GitHub issue #128 is resolved:
 * Cross origin request warning when accessing dev server via 0.0.0.0
 *
 * In Next.js 16, cross-origin requests to /_next/* resources produce a
 * server-side warning (not visible in the browser):
 * "⚠ Cross origin request detected from <origin> to /_next/* resource."
 *
 * The fix is adding `allowedDevOrigins: ['0.0.0.0', '127.0.0.1']` to next.config.ts.
 *
 * Strategy:
 * 1. Static test: verify allowedDevOrigins is configured in next.config.ts
 *    (primary guard — fast and deterministic).
 * 2. Dynamic tests: access the Playwright-managed dev server (port 3000) via
 *    each origin and verify that /_next/* resources load without failures.
 *    These reuse the existing server instead of spawning additional ones,
 *    which avoids .next cache conflicts and resource starvation.
 */

// The Playwright-managed dev server port (from playwright.config.ts baseURL).
const DEV_PORT = 3000

for (const origin of ['0.0.0.0', '127.0.0.1']) {
  test(`should load page without cross-origin resource errors when accessing via ${origin}`, async ({
    browser,
  }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    // Collect failed requests — cross-origin blocks would surface as network failures
    // cSpell:ignore requestfailed
    const failedRequests: string[] = []
    page.on('requestfailed', request => {
      failedRequests.push(`${request.url()} → ${request.failure()?.errorText}`)
    })

    // Collect browser console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto(`http://${origin}:${DEV_PORT}`, {
      waitUntil: 'load',
    })

    // Verify that /_next/* resources (JS, CSS) actually loaded.
    // If cross-origin requests were blocked these would fail or be absent.
    const nextResourceCount = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src*="/_next/"]')
      const links = document.querySelectorAll('link[href*="/_next/"]')
      return scripts.length + links.length
    })

    await context.close()

    // No /_next/* resource loads should have failed
    const nextFailures = failedRequests.filter(r => r.includes('/_next/'))
    expect(
      nextFailures,
      `/_next/* resources should not fail when accessing via ${origin}`
    ).toHaveLength(0)

    // The page should have loaded at least some Next.js resources
    expect(
      nextResourceCount,
      `Page accessed via ${origin} should contain /_next/* resources`
    ).toBeGreaterThan(0)

    // No cross-origin related console errors
    const crossOriginErrors = consoleErrors.filter(
      e =>
        e.toLowerCase().includes('cross-origin') ||
        e.toLowerCase().includes('blocked')
    )
    expect(
      crossOriginErrors,
      `No cross-origin console errors expected when accessing via ${origin}`
    ).toHaveLength(0)
  })
}

test('next.config.ts should have allowedDevOrigins configured', async () => {
  const configContent = fs.readFileSync('next.config.ts', 'utf-8')

  expect(configContent).toContain('allowedDevOrigins')
  expect(configContent).toMatch(/0\.0\.0\.0/)
  expect(configContent).toMatch(/127\.0\.0\.1/)
})
