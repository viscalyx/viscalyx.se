import { expect, Page, test } from '@playwright/test'

test.describe('Cookie Consent Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first so we have a page context for localStorage/cookie clearing
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('viscalyx.se-cookie-consent')

      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })
    })
    // Reload to ensure the banner appears fresh
    await page.reload()
  })

  /**
   * Helper: wait for the cookie banner to be visible and its entrance animation
   * (Framer Motion, 300 ms) to settle so that elements are stable for clicks.
   */
  const waitForBanner = async (page: Page) => {
    const banner = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(banner).toBeVisible()
    // Framer Motion animates y:100→0 over 300 ms; give it time to stabilize.
    // TODO: Replace waitForTimeout with a deterministic animation-complete check.
    await page.waitForTimeout(400)
    return banner
  }

  test('should display cookie consent banner on main page', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await expect(banner.locator('h2')).toBeVisible()
    await expect(
      banner.getByRole('button', { name: 'Accept All' })
    ).toBeVisible()
    await expect(
      banner.getByRole('button', { name: 'Reject All' })
    ).toBeVisible()
    await expect(banner.getByText('Customize Settings')).toBeVisible()
  })

  test('should accept all cookies when clicking "Accept All"', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await banner.getByRole('button', { name: 'Accept All' }).click()

    await expect(banner).not.toBeVisible()

    const consentData = await page.evaluate(() => {
      const stored = localStorage.getItem('viscalyx.se-cookie-consent')
      return stored ? JSON.parse(stored) : null
    })

    expect(consentData).toBeTruthy()
    expect(consentData.settings).toEqual({
      'strictly-necessary': true,
      analytics: true,
      preferences: true,
    })
    expect(consentData.timestamp).toBeTruthy()
    expect(consentData.version).toBe('1.0')
  })

  test('should reject all cookies when clicking "Reject All"', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await banner.getByRole('button', { name: 'Reject All' }).click()

    await expect(banner).not.toBeVisible()

    const consentData = await page.evaluate(() => {
      const stored = localStorage.getItem('viscalyx.se-cookie-consent')
      return stored ? JSON.parse(stored) : null
    })

    expect(consentData).toBeTruthy()
    expect(consentData.settings).toEqual({
      'strictly-necessary': true,
      analytics: false,
      preferences: false,
    })
    expect(consentData.timestamp).toBeTruthy()
    expect(consentData.version).toBe('1.0')
  })

  test('should open detailed cookie settings when clicking "Customize Settings"', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    // Use getByText to avoid strict-mode violation: the "Learn more" link
    // also carries aria-label="Customize Settings"
    await banner.getByText('Customize Settings').click()

    await expect(
      banner.locator('h2', { hasText: 'Cookie Settings' })
    ).toBeVisible()

    // Toggles are sr-only checkboxes — assert they exist in the DOM
    await expect(banner.locator('#toggle-strictly-necessary')).toBeAttached()
    await expect(banner.locator('#toggle-analytics')).toBeAttached()
    await expect(banner.locator('#toggle-preferences')).toBeAttached()

    // Strictly necessary is always checked and disabled
    await expect(banner.locator('#toggle-strictly-necessary')).toBeChecked()
    await expect(banner.locator('#toggle-strictly-necessary')).toBeDisabled()

    // Other toggles are enabled
    await expect(banner.locator('#toggle-analytics')).toBeEnabled()
    await expect(banner.locator('#toggle-preferences')).toBeEnabled()

    await expect(
      banner.getByRole('button', { name: 'Save Preferences' })
    ).toBeVisible()
  })

  test('should allow toggling individual cookie categories', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await banner.getByText('Customize Settings').click()

    // Initial state — only strictly-necessary is checked
    await expect(banner.locator('#toggle-strictly-necessary')).toBeChecked()
    await expect(banner.locator('#toggle-analytics')).not.toBeChecked()
    await expect(banner.locator('#toggle-preferences')).not.toBeChecked()

    // Toggle analytics on via its wrapping <label>
    await banner.locator('label:has(#toggle-analytics)').click()
    await expect(banner.locator('#toggle-analytics')).toBeChecked()

    // Toggle preferences on
    await banner.locator('label:has(#toggle-preferences)').click()
    await expect(banner.locator('#toggle-preferences')).toBeChecked()

    // Toggle analytics back off
    await banner.locator('label:has(#toggle-analytics)').click()
    await expect(banner.locator('#toggle-analytics')).not.toBeChecked()

    // Save
    await banner.getByRole('button', { name: 'Save Preferences' }).click()

    await expect(banner).not.toBeVisible()

    const consentData = await page.evaluate(() => {
      const stored = localStorage.getItem('viscalyx.se-cookie-consent')
      return stored ? JSON.parse(stored) : null
    })

    expect(consentData).toBeTruthy()
    expect(consentData.settings).toEqual({
      'strictly-necessary': true,
      analytics: false,
      preferences: true,
    })
  })

  test('should persist cookie consent choice across page reloads', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await banner.getByRole('button', { name: 'Accept All' }).click()
    await expect(banner).not.toBeVisible()

    // Reload and wait for the page to fully render before checking dialog absence
    await page.reload()
    await expect(page.locator('role=main')).toBeVisible()
    await expect(
      page.locator('[role="dialog"][aria-modal="true"]')
    ).not.toBeVisible()

    // Navigate away and back, waiting for page-ready each time
    await page.goto('/privacy')
    await expect(page.locator('role=main')).toBeVisible()
    await page.goto('/')
    await expect(page.locator('role=main')).toBeVisible()

    await expect(
      page.locator('[role="dialog"][aria-modal="true"]')
    ).not.toBeVisible()
  })

  test('should close detailed settings and return to simple banner view', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    await banner.getByText('Customize Settings').click()

    await expect(
      banner.locator('h2', { hasText: 'Cookie Settings' })
    ).toBeVisible()

    // The close button uses aria-label={t('close')} which resolves to "Close"
    await banner.getByRole('button', { name: 'Close' }).click()

    // Should return to the simple banner view
    await expect(
      banner.locator('h2', { hasText: 'Cookie Settings' })
    ).not.toBeVisible()
    await expect(
      banner.getByRole('button', { name: 'Accept All' })
    ).toBeVisible()
  })

  test('should handle keyboard navigation and focus management', async ({
    page,
  }) => {
    await page.goto('/')

    const banner = await waitForBanner(page)

    // Tab through the interactive elements
    await page.keyboard.press('Tab')

    // Escape should focus the Reject All button (as implemented in the component)
    await page.keyboard.press('Escape')

    // Assert the Reject All button received focus
    const rejectAllButton = banner.getByRole('button', { name: 'Reject All' })
    await expect(rejectAllButton).toBeFocused()

    // Assert that Accept All is NOT focused (focus is specifically on Reject All)
    const acceptAllButton = banner.getByRole('button', { name: 'Accept All' })
    await expect(acceptAllButton).not.toBeFocused()

    // The banner should still be visible with all buttons accessible
    await expect(rejectAllButton).toBeVisible()
    await expect(acceptAllButton).toBeVisible()
  })
})
