import { expect, test } from '@playwright/test'
import { spawn } from 'child_process'
import fs from 'fs'
import http from 'http'

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
 * This test spawns its own dev server so it can capture stdout and check
 * for the warning after a browser navigates to http://0.0.0.0:<port>.
 */

// Port 3099 is hardcoded. If CI flakiness occurs due to port conflicts,
// consider detecting a free port dynamically (e.g., via get-port or binding to port 0).
const CROSS_ORIGIN_PORT = 3099

/**
 * Wait for a URL to respond with a 2xx/3xx status.
 */
function waitForServer(url: string, timeoutMs: number = 60_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs
    const check = () => {
      http
        .get(url, res => {
          res.resume() // Drain the response to free the socket
          if (res.statusCode && res.statusCode < 400) {
            resolve()
          } else if (Date.now() < deadline) {
            setTimeout(check, 500)
          } else {
            reject(new Error(`Server at ${url} not ready within timeout`))
          }
        })
        .on('error', () => {
          if (Date.now() < deadline) {
            setTimeout(check, 500)
          } else {
            reject(new Error(`Server at ${url} not ready within timeout`))
          }
        })
    }
    check()
  })
}

for (const origin of ['0.0.0.0', '127.0.0.1']) {
  test(`should not produce cross-origin warning in server output when accessing via ${origin}`, async ({
    browser,
  }) => {
    test.setTimeout(90_000)

    let serverOutput = ''

    // Spawn a dedicated dev server on a separate port so we can capture its stdout
    const serverProcess = spawn(
      'npx',
      ['next', 'dev', '--port', String(CROSS_ORIGIN_PORT)],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'development' },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )

    serverProcess.stdout.on('data', (data: Buffer) => {
      serverOutput += data.toString()
    })
    serverProcess.stderr.on('data', (data: Buffer) => {
      serverOutput += data.toString()
    })

    try {
      // Wait for the dev server to be ready
      await waitForServer(`http://127.0.0.1:${CROSS_ORIGIN_PORT}`)

      // Use a browser to navigate via the cross-origin address — this triggers
      // /_next/* sub-resource requests that cause the warning
      const context = await browser.newContext()
      const page = await context.newPage()

      await page.goto(`http://${origin}:${CROSS_ORIGIN_PORT}`, {
        waitUntil: 'load',
      })

      // Give the server a moment to flush any warnings
      await page.waitForTimeout(3000)
      await context.close()

      // Check for cross-origin warnings/blocks in the server output
      const hasCrossOriginWarning =
        serverOutput.includes('Cross origin request detected') ||
        serverOutput.includes('Blocked cross-origin request')

      if (hasCrossOriginWarning) {
        // Print for visibility in CI/test output
        const warningLines = serverOutput
          .split('\n')
          .filter(
            line =>
              line.includes('Cross origin') ||
              line.includes('cross-origin') ||
              line.includes('allowedDevOrigins')
          )
        console.log('Server cross-origin warnings found:')
        warningLines.forEach(line => {
          console.log(`  ${line.trim()}`)
        })
      }

      expect(
        hasCrossOriginWarning,
        `Server should NOT emit cross-origin warnings when accessing via ${origin}. ` +
          'Add it to allowedDevOrigins in next.config.ts to fix.'
      ).toBe(false)
    } finally {
      // Always clean up the server process
      serverProcess.kill('SIGTERM')
      // Give it a moment to shut down gracefully
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL')
      }
    }
  })
}

test('next.config.ts should have allowedDevOrigins configured', async () => {
  const configContent = fs.readFileSync('next.config.ts', 'utf-8')

  expect(configContent).toContain('allowedDevOrigins')
  expect(configContent).toMatch(/0\.0\.0\.0/)
  expect(configContent).toMatch(/127\.0\.0\.1/)
})
