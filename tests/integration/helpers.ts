import type { Page } from '@playwright/test'

/**
 * Seeds `localStorage` with a cookie-consent payload so the consent banner
 * does not appear during integration tests.
 *
 * Call this in `test.beforeEach` for any spec that needs the banner dismissed.
 */
export async function seedCookieConsent(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'viscalyx.org-cookie-consent',
      JSON.stringify({
        settings: {
          'strictly-necessary': true,
          analytics: false,
          preferences: false,
        },
        timestamp: new Date().toISOString(),
        version: '1.0',
      }),
    )
  })
}
