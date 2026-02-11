import { execSync } from 'child_process'
import { existsSync } from 'fs'

/**
 * Playwright global setup — runs once before all tests.
 *
 * Checks that the Chromium browser binary is installed and exits with a
 * friendly, actionable message when it is not.
 */
export default function globalSetup() {
  let browserPath: string | undefined

  try {
    // Ask Playwright for the Chromium executable path it expects
    browserPath = execSync(
      'node -e "console.log(require(\'playwright-core\').chromium.executablePath())"',
      { encoding: 'utf-8', timeout: 10_000 }
    ).trim()
  } catch {
    // If we can't even resolve the path, the binary is certainly missing
    printInstallInstructions()
    process.exit(1)
  }

  if (!browserPath || !existsSync(browserPath)) {
    printInstallInstructions()
    process.exit(1)
  }
}

function printInstallInstructions(): void {
  const sep = '='.repeat(70)
  console.error(`
${sep}

  Playwright Chromium browser is not installed!

  Run one of the following commands to install it:

    npx playwright install chromium

  Or with system-level dependencies (CI / first-time setup):

    npx playwright install --with-deps chromium

${sep}
`)
}
