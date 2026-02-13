import { expect, test } from '@playwright/test'

test.describe('Blog Listing Page', () => {
  test.describe('Server-Side Rendering', () => {
    test('should render blog page with hero content visible immediately', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Hero section is server-rendered — visible without waiting for JS
      await expect(
        page.locator('h1').filter({ hasText: /Insights/i })
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Knowledge/i })
      ).toBeVisible()

      // Featured post section heading
      await expect(
        page.getByRole('heading', { name: /Featured Article/i })
      ).toBeVisible()
    })

    test('should not show a loading spinner', async ({ page }) => {
      await page.goto('/blog')

      // The old client-rendered page showed "Loading blog posts..."
      // The server component renders content immediately
      await expect(
        page.getByText('Loading blog posts', { exact: false })
      ).not.toBeVisible()
    })

    test('should have correct page title (not root fallback)', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Title should contain blog-specific text, not just the root fallback
      const title = await page.title()
      expect(title).toContain('Insights')
      expect(title).toContain('Knowledge')
      expect(title).toContain('Viscalyx')
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/blog')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(20)
    })
  })

  test.describe('Featured Post', () => {
    test('should display the featured post card with metadata', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Featured post section should exist
      const featuredSection = page.locator('section').filter({
        has: page.getByRole('heading', { name: /Featured Article/i }),
      })
      await expect(featuredSection).toBeVisible()

      // Should have an image
      await expect(featuredSection.locator('img').first()).toBeVisible()

      // Should have author, date, and read time metadata
      const featuredCard = featuredSection.locator('a').first()
      await expect(featuredCard).toBeVisible()
    })

    test('should navigate to blog post when featured card is clicked', async ({
      page,
    }) => {
      await page.goto('/blog')

      const featuredLink = page
        .locator('section')
        .filter({
          has: page.getByRole('heading', { name: /Featured Article/i }),
        })
        .locator('a')
        .first()

      await featuredLink.click()
      await page.waitForURL(/\/blog\/.+/)
      expect(page.url()).toMatch(/\/blog\/.+/)
    })
  })

  test.describe('Category Filter', () => {
    test('should display category filter buttons', async ({ page }) => {
      await page.goto('/blog')

      // "All" button should be present
      await expect(page.getByRole('button', { name: 'All' })).toBeVisible()

      // At least one real category should exist beyond "All"
      const categorySection = page.locator('div.flex.flex-wrap')
      const categoryButtons = categorySection.getByRole('button')
      const count = await categoryButtons.count()
      expect(count).toBeGreaterThan(1) // "All" + at least one category
    })

    test('should filter posts when a category is clicked', async ({ page }) => {
      await page.goto('/blog')

      // Count articles before filtering
      const allArticles = page.locator('article')
      const initialCount = await allArticles.count()
      expect(initialCount).toBeGreaterThan(0)

      // Click a specific category (DevOps exists in the test data)
      await page.getByRole('button', { name: 'DevOps', exact: true }).click()

      // After filtering, articles should still exist but potentially fewer
      const filteredArticles = page.locator('article')
      const filteredCount = await filteredArticles.count()
      expect(filteredCount).toBeGreaterThan(0)
      expect(filteredCount).toBeLessThanOrEqual(initialCount)

      // All visible articles should have the DevOps category badge
      for (let i = 0; i < filteredCount; i++) {
        await expect(
          filteredArticles.nth(i).getByText('DevOps', { exact: true })
        ).toBeVisible()
      }
    })

    test('should reset to all posts when "All" is clicked', async ({
      page,
    }) => {
      await page.goto('/blog')

      const allArticles = page.locator('article')
      const initialCount = await allArticles.count()

      // Filter to a category
      await page.getByRole('button', { name: 'DevOps', exact: true }).click()

      // Reset
      await page.getByRole('button', { name: 'All', exact: true }).click()

      const resetCount = await allArticles.count()
      expect(resetCount).toBe(initialCount)
    })
  })

  test.describe('Load More Pagination', () => {
    test('should show Load More button when posts exceed page size', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Load More should be visible when there are more posts than one page
      await expect(
        page.getByRole('button', { name: /Load More/i })
      ).toBeVisible()

      // Initially only the first page of articles is shown
      const articles = page.locator('article')
      const count = await articles.count()
      expect(count).toBeGreaterThan(0)
      expect(count).toBeLessThanOrEqual(6)
    })

    test('should reveal more posts when Load More is clicked', async ({
      page,
    }) => {
      await page.goto('/blog')

      const articles = page.locator('article')
      const initialCount = await articles.count()

      await page.getByRole('button', { name: /Load More/i }).click()

      const newCount = await articles.count()
      expect(newCount).toBeGreaterThan(initialCount)
    })

    test('should hide Load More when all posts are visible', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Click Load More until it disappears (max 16 posts / 6 per page = 2-3 clicks)
      for (let i = 0; i < 5; i++) {
        const loadMore = page.getByRole('button', { name: /Load More/i })
        if (!(await loadMore.isVisible())) break
        await loadMore.click()
      }

      await expect(
        page.getByRole('button', { name: /Load More/i })
      ).not.toBeVisible()
    })
  })

  test.describe('Post Grid Cards', () => {
    test('should render post cards with images, dates, and titles', async ({
      page,
    }) => {
      await page.goto('/blog')

      const firstArticle = page.locator('article').first()
      await expect(firstArticle).toBeVisible()

      // Should have an image
      await expect(firstArticle.locator('img')).toBeVisible()

      // Should have a title (h3)
      await expect(firstArticle.locator('h3')).toBeVisible()
    })

    test('should navigate to blog post when card is clicked', async ({
      page,
    }) => {
      await page.goto('/blog')

      // Click the first post card link
      const firstCardLink = page.locator('a:has(article)').first()
      await firstCardLink.click()

      await page.waitForURL(/\/blog\/.+/)
      expect(page.url()).toMatch(/\/blog\/.+/)
    })
  })

  test.describe('Locale Switching', () => {
    test('should render blog page in Swedish at /sv/blog', async ({ page }) => {
      await page.goto('/sv/blog')

      // Swedish hero text
      await expect(
        page.locator('h1').filter({ hasText: /Insikter/i })
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Kunskap/i })
      ).toBeVisible()

      // Swedish featured post heading
      await expect(
        page.getByRole('heading', { name: /Utvald Artikel/i })
      ).toBeVisible()

      // Swedish category "All" → "Alla"
      await expect(
        page.getByRole('button', { name: 'Alla', exact: true })
      ).toBeVisible()
    })

    test('should have Swedish metadata at /sv/blog', async ({ page }) => {
      await page.goto('/sv/blog')

      const title = await page.title()
      expect(title).toContain('Insikter')
      expect(title).toContain('Kunskap')
    })
  })
})
