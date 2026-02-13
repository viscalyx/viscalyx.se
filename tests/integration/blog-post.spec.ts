import { expect, test } from '@playwright/test'

/**
 * Integration tests for the blog post page after the Phase 2 server component
 * conversion. These tests validate that the page renders correctly as an RSC
 * with a BlogPostContent client island.
 */

// Use a known published post slug for all tests
const TEST_SLUG = 'ssh-signing-keys-for-github-codespaces'
const TEST_URL = `/blog/${TEST_SLUG}`

test.describe('Blog Post Page', () => {
  test.describe('Server-Side Rendering', () => {
    test('should render the post title as an h1', async ({ page }) => {
      await page.goto(TEST_URL)

      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()
      await expect(heading).toContainText('SSH Signing Keys')
    })

    test('should not show a loading spinner', async ({ page }) => {
      await page.goto(TEST_URL)

      // Server component renders content immediately — no loading state
      await expect(
        page.getByText('Loading blog post', { exact: false })
      ).not.toBeVisible()
    })

    test('should render blog content in the page', async ({ page }) => {
      await page.goto(TEST_URL)

      // The main article content area should have rendered HTML
      const article = page.locator('.prose, article, [class*="blog-content"]')
      await expect(article.first()).toBeVisible()
    })
  })

  test.describe('Page Metadata', () => {
    test('should have correct page title', async ({ page }) => {
      await page.goto(TEST_URL)

      const title = await page.title()
      expect(title).toContain('SSH Signing Keys')
    })

    test('should have meta description', async ({ page }) => {
      await page.goto(TEST_URL)

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
    })

    test('should have OG article type', async ({ page }) => {
      await page.goto(TEST_URL)

      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('article')
    })

    test('should have OG image', async ({ page }) => {
      await page.goto(TEST_URL)

      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content')
      expect(ogImage).toBeTruthy()
    })

    test('should have twitter card metadata', async ({ page }) => {
      await page.goto(TEST_URL)

      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute('content')
      expect(twitterCard).toBe('summary_large_image')
    })
  })

  test.describe('Post Content', () => {
    test('should display the featured image', async ({ page }) => {
      await page.goto(TEST_URL)

      const img = page.locator('img').first()
      await expect(img).toBeVisible()
    })

    test('should display author name', async ({ page }) => {
      await page.goto(TEST_URL)

      await expect(page.getByText('Johan Ljunggren').first()).toBeVisible()
    })

    test('should display post category', async ({ page }) => {
      await page.goto(TEST_URL)

      await expect(page.getByText('DevOps').first()).toBeVisible()
    })

    test('should display read time', async ({ page }) => {
      await page.goto(TEST_URL)

      await expect(page.getByText(/min read/i).first()).toBeVisible()
    })

    test('should display tags', async ({ page }) => {
      await page.goto(TEST_URL)

      // At least one tag should be visible
      await expect(page.getByText('Git').first()).toBeVisible()
    })
  })

  test.describe('Table of Contents', () => {
    test('should render table of contents when post has headings', async ({
      page,
    }) => {
      await page.goto(TEST_URL)

      // ToC should be present (desktop or mobile)
      const tocText = page.getByText(/Table of Contents/i)
      // May be visible on desktop viewport
      const count = await tocText.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Author Bio', () => {
    test('should display author bio section', async ({ page }) => {
      await page.goto(TEST_URL)

      // Team member bio should be visible
      await expect(page.getByText('Johan Ljunggren').first()).toBeVisible()
    })

    test('should display View Profile link', async ({ page }) => {
      await page.goto(TEST_URL)

      const viewProfile = page.getByText(/View Profile/i)
      const count = await viewProfile.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Navigation', () => {
    test('should have Back to Blog link', async ({ page }) => {
      await page.goto(TEST_URL)

      const backLink = page.getByText(/Back to Blog/i).first()
      await expect(backLink).toBeVisible()
    })

    test('should navigate back to blog listing when back link is clicked', async ({
      page,
    }) => {
      await page.goto(TEST_URL)

      const backLink = page
        .locator('a')
        .filter({ hasText: /Back to Blog/i })
        .first()
      await backLink.click()

      await page.waitForURL('**/blog')
      expect(page.url()).toContain('/blog')
    })

    test('should have header and footer', async ({ page }) => {
      await page.goto(TEST_URL)

      await expect(page.locator('header').first()).toBeVisible()
      await expect(page.locator('footer').first()).toBeVisible()
    })
  })

  test.describe('Share Functionality', () => {
    test('should have a share button', async ({ page }) => {
      await page.goto(TEST_URL)

      // Share button should be present
      await expect(page.getByText(/Share/i).first()).toBeVisible()
    })
  })

  test.describe('Related Posts', () => {
    test('should display Related Articles section', async ({ page }) => {
      await page.goto(TEST_URL)

      const relatedHeading = page.getByText(/Related Articles/i)
      const count = await relatedHeading.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Error Handling', () => {
    test('should return 404 for non-existent post', async ({ page }) => {
      const response = await page.goto(
        '/blog/this-post-absolutely-does-not-exist'
      )

      // Next.js returns a 404 page
      expect(response?.status()).toBe(404)
    })

    test('should return 404 for path traversal attempt', async ({
      request,
    }) => {
      // Use Playwright's raw HTTP API to send the traversal path without
      // browser URL normalization, so the server receives the raw chars
      // and validateSlug can reject them.
      const response = await request.get('/blog/%2e%2e%2f%2e%2e%2fetc%2fpasswd')

      // Should not leak filesystem content
      expect(response.status()).not.toBe(200)
    })
  })

  test.describe('Locale Support', () => {
    test('should render post at /en/blog/ path', async ({ page }) => {
      await page.goto(`/en${TEST_URL}`)

      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()
      await expect(heading).toContainText('SSH Signing Keys')
    })

    test('should render post at /sv/blog/ path', async ({ page }) => {
      await page.goto(`/sv${TEST_URL}`)

      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()
      await expect(heading).toContainText('SSH Signing Keys')
    })
  })
})
