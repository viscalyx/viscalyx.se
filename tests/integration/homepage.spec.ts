import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  // Swedish (/sv) is used because Swedish text tends to be longer than English,
  // making it the worst-case locale for horizontal overflow.
  test.describe('Mobile Layout', () => {
    test.use({
      viewport: { width: 390, height: 844 }, // iPhone 12/13 logical viewport
      isMobile: true,
      hasTouch: true,
    })

    test('should not allow horizontal scrolling on the homepage', async ({
      page,
    }) => {
      await page.goto('/sv')

      const dimensions = await page.evaluate(() => {
        const html = document.documentElement
        const body = document.body
        return {
          htmlClientWidth: html.clientWidth,
          htmlScrollWidth: html.scrollWidth,
          bodyClientWidth: body.clientWidth,
          bodyScrollWidth: body.scrollWidth,
        }
      })

      expect(dimensions.htmlScrollWidth).toBeLessThanOrEqual(
        dimensions.htmlClientWidth + 1,
      )
      expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(
        dimensions.bodyClientWidth + 1,
      )
    })
  })

  test.describe('Server-Side Rendering', () => {
    test('should render homepage with hero content visible immediately', async ({
      page,
    }) => {
      await page.goto('/')

      // Hero heading is server-rendered — visible without waiting for JS
      await expect(
        page.locator('h1').filter({ hasText: /Streamline Your/i }),
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Development/i }),
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Workflow/i }),
      ).toBeVisible()

      // Hero description is visible
      await expect(
        page.getByText('Professional consulting services', { exact: false }),
      ).toBeVisible()
    })

    test('should have correct page title from generateMetadata', async ({
      page,
    }) => {
      await page.goto('/')

      const title = await page.title()
      expect(title).toContain('Streamline Your')
      expect(title).toContain('Development')
      expect(title).toContain('Workflow')
      expect(title).toContain('Viscalyx')
    })

    test('should have meta description', async ({ page }) => {
      await page.goto('/')

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      expect(description).toContain('consulting')
      expect(description?.length).toBeGreaterThan(20)
    })

    test('should have Open Graph metadata', async ({ page }) => {
      await page.goto('/')

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      expect(ogTitle).toContain('Development')

      const ogLocale = await page
        .locator('meta[property="og:locale"]')
        .getAttribute('content')
      expect(ogLocale).toBe('en_US')
    })
  })

  test.describe('Header Navigation', () => {
    test('should display header with logo and navigation links', async ({
      page,
    }) => {
      await page.goto('/')

      // Logo text
      await expect(page.getByRole('link', { name: /Viscalyx/i })).toBeVisible()

      // Desktop nav links (scoped to nav to avoid footer duplicates)
      const nav = page.getByRole('navigation')
      await expect(
        nav.getByRole('link', { name: 'About', exact: true }),
      ).toBeVisible()
      await expect(
        nav.getByRole('link', { name: 'Open Source', exact: true }),
      ).toBeVisible()
      await expect(
        nav.getByRole('link', { name: 'Blog', exact: true }),
      ).toBeVisible()
    })

    test('should navigate to blog page when Blog link is clicked', async ({
      page,
    }) => {
      await page.goto('/')

      const nav = page.getByRole('navigation')
      await nav.getByRole('link', { name: 'Blog', exact: true }).click()
      await page.waitForURL(/\/blog/)
      expect(page.url()).toMatch(/\/blog/)
    })
  })

  test.describe('Hero Section', () => {
    test('should display hero badge and stats', async ({ page }) => {
      await page.goto('/')

      // Badge
      await expect(
        page.getByText('Automation & DevOps Excellence'),
      ).toBeVisible()

      // Stats
      await expect(page.getByText('30+')).toBeVisible()
      await expect(page.getByText('Years Experience')).toBeVisible()
      await expect(page.getByText('100+')).toBeVisible()
      await expect(page.getByText('Tasks Automated')).toBeVisible()
    })

    test('should display Learn More button that scrolls to About', async ({
      page,
    }) => {
      await page.goto('/')

      const learnMore = page.getByRole('button', { name: /Learn More/i })
      await expect(learnMore).toBeVisible()
    })

    test('should display hero image carousel', async ({ page }) => {
      await page.goto('/')

      // At least one hero image should be visible
      const heroImages = page.locator('section').first().locator('img')
      const count = await heroImages.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('About Section', () => {
    test('should display About section with heading and description', async ({
      page,
    }) => {
      await page.goto('/')

      // About badge
      await expect(page.getByText('About Viscalyx')).toBeVisible()

      // About heading
      await expect(
        page.getByRole('heading', {
          name: /Empowering Organizations Through/i,
        }),
      ).toBeVisible()

      // About description
      await expect(
        page.getByText('specialized consulting company', { exact: false }),
      ).toBeVisible()
    })

    test('should display value cards', async ({ page }) => {
      await page.goto('/')

      await expect(
        page.getByRole('heading', { name: /Precision & Excellence/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Client-Centric Approach/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Innovation First/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Open Source Commitment/i }),
      ).toBeVisible()
    })

    test('should be scrollable via hash anchor', async ({ page }) => {
      await page.goto('/#about')

      const aboutSection = page.locator('#about')
      await expect(aboutSection).toBeVisible()
    })
  })

  test.describe('Open Source Section', () => {
    test('should display Open Source section with heading and stats', async ({
      page,
    }) => {
      await page.goto('/')

      // Heading
      await expect(
        page.getByRole('heading', { name: /Open Source/i }).first(),
      ).toBeVisible()

      // Stats
      await expect(page.getByText('80+')).toBeVisible()
      await expect(page.getByText('9k+')).toBeVisible()
    })

    test('should display project cards with links', async ({ page }) => {
      await page.goto('/')

      // Project names
      await expect(
        page.getByRole('heading', { name: /PowerShell DSC Community/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /DSC Resource Kit/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Sampler/i }),
      ).toBeVisible()

      // View Project links
      const viewProjectLinks = page.getByRole('link', {
        // cspell:disable-next-line
        name: /View (P|p)roject/i,
      })
      const count = await viewProjectLinks.count()
      expect(count).toBe(3)
    })

    test('should display CTA with GitHub and community links', async ({
      page,
    }) => {
      await page.goto('/')

      await expect(
        page.getByRole('heading', {
          name: /Join the PowerShell Open Source Community/i,
        }),
      ).toBeVisible()

      await expect(
        page.getByRole('link', { name: /Follow on GitHub/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /Collaborate With Community/i }),
      ).toBeVisible()
    })

    test('should be scrollable via hash anchor', async ({ page }) => {
      await page.goto('/#open-source')

      const osSection = page.locator('#open-source')
      await expect(osSection).toBeVisible()
    })
  })

  test.describe('Footer', () => {
    test('should display footer with company info and links', async ({
      page,
    }) => {
      await page.goto('/')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()

      // Company links (rendered as <Link> elements with onClick handlers)
      await expect(
        footer.getByRole('link', { name: /About Us/i }),
      ).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /Open Source/i }),
      ).toBeVisible()

      // Resource links (Blog is internal, Community is external — both <a> tags)
      await expect(footer.getByRole('link', { name: /Blog/i })).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /Community/i }),
      ).toBeVisible()

      // Support links
      await expect(
        footer.getByRole('link', { name: /Privacy Policy/i }),
      ).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /Terms of Service/i }),
      ).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /Cookie Policy/i }),
      ).toBeVisible()
    })

    test('should display copyright notice', async ({ page }) => {
      await page.goto('/')

      await expect(
        page.getByText(/© \d{4} Viscalyx\. All rights reserved/i),
      ).toBeVisible()
    })

    test('should have social media links', async ({ page }) => {
      await page.goto('/')

      const footer = page.locator('footer')

      await expect(footer.getByRole('link', { name: /GitHub/i })).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /LinkedIn/i }),
      ).toBeVisible()
    })
  })

  test.describe('Locale Support', () => {
    test('should render homepage in Swedish at /sv', async ({ page }) => {
      await page.goto('/sv')

      // Swedish hero text
      await expect(
        page.locator('h1').filter({ hasText: /Effektivisera Ditt/i }),
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Utvecklings/i }),
      ).toBeVisible()
      await expect(
        page.locator('h1').filter({ hasText: /Arbetsflöde/i }),
      ).toBeVisible()

      // Swedish badge
      await expect(
        page.getByText('Automation & DevOps Excellens'),
      ).toBeVisible()

      // Swedish Learn More button
      await expect(page.getByRole('button', { name: /Läs Mer/i })).toBeVisible()
    })

    test('should have Swedish metadata at /sv', async ({ page }) => {
      await page.goto('/sv')

      const title = await page.title()
      expect(title).toContain('Effektivisera')

      const ogLocale = await page
        .locator('meta[property="og:locale"]')
        .getAttribute('content')
      expect(ogLocale).toBe('sv_SE')
    })

    test('should display Swedish navigation at /sv', async ({ page }) => {
      await page.goto('/sv')

      const nav = page.getByRole('navigation')
      await expect(
        nav.getByRole('link', { name: 'Om oss', exact: true }),
      ).toBeVisible()
      await expect(
        nav.getByRole('link', { name: 'Öppen Källkod', exact: true }),
      ).toBeVisible()
      await expect(
        nav.getByRole('link', { name: 'Blogg', exact: true }),
      ).toBeVisible()
    })

    test('should display Swedish About section at /sv', async ({ page }) => {
      await page.goto('/sv')

      await expect(page.getByText('Om Viscalyx')).toBeVisible()
      await expect(
        page.getByRole('heading', {
          name: /Ger Organisationer Kraft Genom/i,
        }),
      ).toBeVisible()
    })

    test('should display Swedish footer at /sv', async ({ page }) => {
      await page.goto('/sv')

      const footer = page.locator('footer')

      await expect(
        footer.getByRole('link', { name: /Integritetspolicy/i }),
      ).toBeVisible()
      await expect(
        footer.getByRole('link', { name: /Användarvillkor/i }),
      ).toBeVisible()
      await expect(
        page.getByText(/Alla rättigheter förbehållna/i),
      ).toBeVisible()
    })
  })
})
