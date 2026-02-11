# Integration Tests

This directory contains Playwright integration tests for the Viscalyx.se website. These tests verify the functionality of the website by running real browser interactions.

## Test Structure

### Cookie Consent Tests (`cookie-consent.spec.ts`)

Tests the cookie consent banner functionality, including:

- **Basic Display**: Verifies the cookie banner appears on page load
- **Accept All**: Tests accepting all cookie categories
- **Reject All**: Tests rejecting non-essential cookies  
- **Individual Toggles**: Tests toggling specific cookie categories
- **Settings Persistence**: Verifies settings are saved and persist across page reloads
- **UI Navigation**: Tests opening/closing detailed settings view
- **Accessibility**: Basic keyboard navigation testing

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
npm install

# Install Playwright browsers
npx playwright install
```

### Local Development

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

### Specific Test Execution

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

## Test Configuration

- **Development Server**: Tests run against `http://127.0.0.1:3000` (Next.js dev server)
- **Preview Server**: Tests run against `http://127.0.0.1:8787` (OpenNext preview server)
- **Browsers**: Chromium (default), additional browsers can be added to the config
- **Reports**: HTML reports and JUnit XML for CI integration

## Continuous Integration

Integration tests run automatically on:
- Pull requests to main branch
- Pushes to main branch

The GitHub Actions workflow runs tests against both development and preview servers with proper artifact collection for debugging.

## Test Files and Artifacts

- Test results: `test-results/`
- Screenshots: Captured on test failures
- Videos: Recorded for failed tests
- Traces: Available for debugging (view with `npx playwright show-trace <trace-file>`)

## Development Tips

1. **Use `--headed` for visual debugging** (only works with display server)
2. **Check screenshots/videos** when tests fail to understand what happened
3. **Use `page.pause()`** in tests for interactive debugging
4. **Run specific browsers** to isolate issues: `--project=chromium`
5. **Use `--ui` mode** for the best debugging experience

## Test Coverage

The integration tests focus on:
- ✅ Cookie consent banner functionality
- ✅ User interactions (clicks, form submissions)
- ✅ State persistence (localStorage, cookies)
- ✅ Navigation between views
- ✅ Basic accessibility features

Future test areas could include:
- Blog post reading functionality
- Contact form submissions
- Search functionality
- Theme switching
- Language switching