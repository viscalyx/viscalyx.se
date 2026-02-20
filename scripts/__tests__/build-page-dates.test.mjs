import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const scriptPath = require.resolve('../build-page-dates.js')
const outputPath = path.join(path.dirname(scriptPath), '../lib/page-dates.json')

const waitForFile = async (filePath, timeoutMs = 15000) => {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (fs.existsSync(filePath)) return
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`Timed out waiting for ${filePath}`)
}

const write = (cwd, relPath, content) => {
  const fullPath = path.join(cwd, relPath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content)
}

const commitAllWithDate = (cwd, message, isoDate) => {
  const env = {
    ...process.env,
    GIT_AUTHOR_DATE: isoDate,
    GIT_COMMITTER_DATE: isoDate,
  }
  execSync('git add .', { cwd, env })
  execSync(`git commit -m "${message}"`, { cwd, env })
}

describe('build-page-dates script', () => {
  const originalCwd = process.cwd()
  const originalOutput = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8')
    : null

  let tempDir

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-page-dates-'))
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(process, 'exit').mockImplementation(() => undefined)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    vi.restoreAllMocks()

    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }

    if (originalOutput !== null) {
      fs.writeFileSync(outputPath, originalOutput)
    }

    delete require.cache[scriptPath]
  })

  it('writes page dates from git history and ignores template.md for blog date', async () => {
    write(tempDir, 'app/[locale]/page.tsx', 'home')
    write(tempDir, 'app/[locale]/blog/page.tsx', 'blog')
    write(tempDir, 'app/[locale]/privacy/page.tsx', 'privacy')
    write(tempDir, 'app/[locale]/terms/page.tsx', 'terms')
    write(tempDir, 'app/[locale]/cookies/page.tsx', 'cookies')
    write(tempDir, 'messages/privacy.en.json', '{}')
    write(tempDir, 'messages/privacy.sv.json', '{}')
    write(tempDir, 'messages/terms.en.json', '{}')
    write(tempDir, 'messages/terms.sv.json', '{}')
    write(tempDir, 'messages/cookies.en.json', '{}')
    write(tempDir, 'messages/cookies.sv.json', '{}')
    write(tempDir, 'content/blog/a.md', '# blog post')
    write(tempDir, 'content/blog/template.md', '# template')

    execSync('git init', { cwd: tempDir })
    execSync('git config user.email "test@example.com"', { cwd: tempDir })
    execSync('git config user.name "Test User"', { cwd: tempDir })

    commitAllWithDate(tempDir, 'initial', '2024-01-01T00:00:00Z')

    write(tempDir, 'content/blog/a.md', '# blog post updated')
    commitAllWithDate(tempDir, 'update-blog', '2024-02-01T00:00:00Z')

    // template.md is newer but should not affect blog date.
    write(tempDir, 'content/blog/template.md', '# template updated')
    commitAllWithDate(tempDir, 'update-template', '2024-03-01T00:00:00Z')

    process.chdir(tempDir)
    require(scriptPath)

    await waitForFile(outputPath)

    const pageDates = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    expect(pageDates).toHaveProperty('home')
    expect(pageDates).toHaveProperty('blog')
    expect(pageDates).toHaveProperty('privacy')
    expect(pageDates).toHaveProperty('terms')
    expect(pageDates).toHaveProperty('cookies')

    expect(pageDates.blog).toBe(new Date('2024-02-01T00:00:00Z').toISOString())
  }, 20000)

  it('falls back to default date when run outside a git repo', async () => {
    process.chdir(tempDir)
    require(scriptPath)

    await waitForFile(outputPath)

    const pageDates = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    const fallback = new Date('2024-01-01T00:00:00.000Z').toISOString()

    expect(pageDates.home).toBe(fallback)
    expect(pageDates.blog).toBe(fallback)
    expect(pageDates.privacy).toBe(fallback)
    expect(pageDates.terms).toBe(fallback)
    expect(pageDates.cookies).toBe(fallback)
  })
})
