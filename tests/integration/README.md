# Integration Tests

This directory contains Playwright integration tests for the
Viscalyx.se website. These tests verify the functionality of the
website by running real browser interactions.

## Test Structure

### Cookie Consent Tests (`cookie-consent.spec.ts`)

Tests the cookie consent banner functionality, including:

- **Basic Display**: Verifies the cookie banner appears on page load
- **Accept All**: Tests accepting all cookie categories
- **Reject All**: Tests rejecting non-essential cookies
- **Individual Toggles**: Tests toggling specific cookie categories
- **Settings Persistence**: Verifies settings are saved and persist across page
  reloads
- **UI Navigation**: Tests opening/closing detailed settings view
- **Accessibility**: Basic keyboard navigation testing

### Blog Listing Tests (`blog-listing.spec.ts`)

Tests the server-rendered blog listing page, including:

- **Server-Side Rendering**: Verifies content is in the initial HTML (no
  loading spinner)
- **SEO Metadata**: Checks page title and meta description from
  `generateMetadata`
- **Featured Post**: Validates the featured post card display and navigation
- **Category Filter**: Tests filtering posts by category and resetting to all
- **Load More Pagination**: Tests progressive loading of post cards
- **Post Grid Cards**: Validates card structure, images, and navigation links
- **Locale Support**: Verifies Swedish translations at `/sv/blog`

### Blog Post Tests (`blog-post.spec.ts`)

Tests the server-rendered blog post page, including:

- **Server-Side Rendering**: Verifies content is in the initial HTML (no
  loading spinner)
- **SEO Metadata**: Checks page title, meta description, OG tags, and Twitter
  card
- **Post Content**: Validates featured image, author, category, read time, and
  tags
- **Table of Contents**: Verifies the desktop sidebar ToC renders for posts
  with headings
- **Author Bio**: Validates author bio section and View Profile link
- **Navigation**: Tests Back to Blog link, header/footer, and navigation flow
- **Share Functionality**: Verifies the share button is present
- **Related Posts**: Checks the Related Articles section
- **Error Handling**: 404 for non-existent slugs and path traversal attempts
- **Locale Support**: Verifies English and Swedish post rendering

### Homepage Tests (`homepage.spec.ts`)

Tests the server-rendered homepage, including:

- **Server-Side Rendering**: Verifies hero content is in the initial HTML
- **SEO Metadata**: Checks page title, meta description, and OG tags from
  `generateMetadata`
- **Header Navigation**: Validates logo, nav links, and blog link navigation
- **Hero Section**: Tests badge, stats, Learn More button, and image carousel
- **About Section**: Validates heading, description, value cards, and hash
  anchor
- **Open Source Section**: Tests heading, stats, project cards, CTA links, and
  hash anchor
- **Footer**: Validates company/resource/support links, copyright, and social
  links
- **Locale Support**: Verifies Swedish translations at `/sv` for all sections

### Cross-Origin Warning Tests (`cross-origin-warning.spec.ts`)

Tests that the Next.js dev server does not emit cross-origin warnings when
accessed via `0.0.0.0` (common in devcontainer/Docker setups):

- **Runtime Verification**: Spawns a dev server, navigates via `0.0.0.0`, and
  asserts no cross-origin warnings appear in server output
- **Config Guard-Rail**: Verifies `next.config.ts` contains `allowedDevOrigins:
  ['0.0.0.0']`

## Running Tests

### Prerequisites

<!-- markdownlint-disable MD013 -->
```bash
# Install dependencies (includes Playwright)
npm install

# Install Playwright browsers and their OS-level dependencies
npx playwright install --with-deps
```
<!-- markdownlint-enable MD013 -->

### Local Development

<!-- markdownlint-disable MD013 -->
```bash
# Run all integration tests against dev server (default)
npm run test:integration

# Run against development server specifically
npm run test:integration:dev

# Run against preview/production server
npm run test:integration:preview

# Run both dev and preview tests
npm run test:integration:all

# Run with Playwright UI for debugging
npm run test:integration:ui

# View last test report
npm run test:integration:report
```
<!-- markdownlint-enable MD013 -->

### Specific Test Execution

<!-- markdownlint-disable MD013 -->
```bash
# Run specific test file
npx playwright test tests/integration/cookie-consent.spec.ts

# Run specific test by name
npx playwright test --grep "should accept all cookies"

# Run in specific browser
npx playwright test --project=chromium

# Run with debugging
npx playwright test --debug
```
<!-- markdownlint-enable MD013 -->

## Test Configuration

- **Development Server**: Tests run against `http://127.0.0.1:3000` (Next.js
  dev server)
- **Preview Server**: Tests run against `http://127.0.0.1:8787` (OpenNext
  preview server)
- **Browsers**: Chromium (default), additional browsers can be added to the
  config
- **Reports**: HTML reports and JUnit XML for CI integration

## Continuous Integration

Integration tests run automatically on:

- Pull requests to main branch
- Pushes to main branch

The GitHub Actions workflow runs tests against both development and
preview servers with proper artifact collection for debugging.

## Test Files and Artifacts

- Test results: `test-results/`
- Screenshots: Captured on test failures
- Videos: Recorded for failed tests
- Traces: Available for debugging (view with `npx playwright show-trace
  <trace-file>`)

## Development Tips

1. **Use `--headed` for visual debugging** (only works with display server)
1. **Check screenshots/videos** when tests fail to understand what happened
1. **Use `page.pause()`** in tests for interactive debugging
1. **Run specific browsers** to isolate issues: `--project=chromium`
1. **Use `--ui` mode** for the best debugging experience

## Test Coverage

The integration tests focus on:

- ✅ Homepage (SSR, metadata, hero, about, open source, footer, locale)
- ✅ Cookie consent banner functionality
- ✅ Blog listing page (SSR, metadata, filtering, pagination, locale)
- ✅ Blog post page (SSR, metadata, content, ToC, navigation, errors, locale)
- ✅ User interactions (clicks, form submissions)
- ✅ State persistence (localStorage, cookies)
- ✅ Navigation between views
- ✅ Basic accessibility features
- ✅ Cross-origin dev server configuration verification

Future test areas could include:

- Contact form submissions
- Search functionality
- Theme switching
