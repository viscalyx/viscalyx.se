import { expect, test } from '@playwright/test'

test.describe('Page Metadata', () => {
  test.describe('Homepage', () => {
    test('should have page title with template suffix', async ({ page }) => {
      await page.goto('/en')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/en')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/en')

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      expect(ogTitle).toBeTruthy()

      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content')
      expect(ogDescription).toBeTruthy()

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')

      const ogLocale = await page
        .locator('meta[property="og:locale"]')
        .getAttribute('content')
      expect(ogLocale).toBe('en_US')
    })

    test('should have Twitter card metadata', async ({ page }) => {
      await page.goto('/en')

      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute('content')
      expect(twitterCard).toBe('summary_large_image')
    })
  })

  test.describe('Team Page', () => {
    test('should have team-specific page title', async ({ page }) => {
      await page.goto('/en/team')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
      // Title should not be just the root fallback
      expect(title.length).toBeGreaterThan('Viscalyx'.length)
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/en/team')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/en/team')

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      expect(ogTitle).toBeTruthy()

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')
    })
  })

  test.describe('Team Member Page', () => {
    test('should have member-specific page title', async ({ page }) => {
      await page.goto('/en/team/johlju')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
      expect(title.length).toBeGreaterThan('Viscalyx'.length)
    })

    test('should have Open Graph profile type', async ({ page }) => {
      await page.goto('/en/team/johlju')

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('profile')
    })

    test('should have member image in OG metadata', async ({ page }) => {
      await page.goto('/en/team/johlju')

      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content')
      expect(ogImage).toBeTruthy()
    })
  })

  test.describe('Cookies Page', () => {
    test('should have cookies-specific page title', async ({ page }) => {
      await page.goto('/en/cookies')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
      expect(title.length).toBeGreaterThan('Viscalyx'.length)
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/en/cookies')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/en/cookies')

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')
    })
  })

  test.describe('Privacy Page', () => {
    test('should have privacy-specific page title', async ({ page }) => {
      await page.goto('/en/privacy')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
      expect(title.length).toBeGreaterThan('Viscalyx'.length)
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/en/privacy')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/en/privacy')

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')
    })
  })

  test.describe('Terms Page', () => {
    test('should have terms-specific page title', async ({ page }) => {
      await page.goto('/en/terms')

      const title = await page.title()
      expect(title).toContain('Viscalyx')
      expect(title.length).toBeGreaterThan('Viscalyx'.length)
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/en/terms')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/en/terms')

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')
    })
  })

  test.describe('Locale Switching', () => {
    test('should use sv_SE locale for Swedish homepage', async ({ page }) => {
      await page.goto('/sv')

      const ogLocale = await page
        .locator('meta[property="og:locale"]')
        .getAttribute('content')
      expect(ogLocale).toBe('sv_SE')
    })

    test('should use sv_SE locale for Swedish team page', async ({ page }) => {
      await page.goto('/sv/team')

      const ogLocale = await page
        .locator('meta[property="og:locale"]')
        .getAttribute('content')
      expect(ogLocale).toBe('sv_SE')
    })
  })
})
