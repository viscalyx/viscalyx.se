import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitForFile } from './test-helpers.mjs'

const require = createRequire(import.meta.url)
const scriptPath = require.resolve('../build-blog-data.js')

describe('build-blog-data script', () => {
  const originalCwd = process.cwd()
  let tempDir

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.chdir(originalCwd)
    vi.restoreAllMocks()
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
    tempDir = undefined

    delete require.cache[scriptPath]
  })

  it('builds metadata and per-post content files from markdown', async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-blog-data-test-'))

    const blogDir = path.join(tempDir, 'content/blog')
    fs.mkdirSync(blogDir, { recursive: true })

    fs.writeFileSync(
      path.join(blogDir, 'newest.md'),
      `---
title: "Newest"
date: "2025-02-02"
author: "A"
excerpt: "Latest post"
tags: ["dev", "news"]
---

# Newest Post

Safe content with **bold** text.


a <script>alert('xss')</script> test.
`
    )

    fs.writeFileSync(
      path.join(blogDir, 'old-no-date.md'),
      `---
title: "Old Without Date"
author: "B"
---

# Old Post


A second post with code.

\`\`\`js
const a = 1
\`\`\`
`
    )

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined)

    process.chdir(tempDir)
    require(scriptPath)

    const metadataPath = path.join(tempDir, 'lib/blog-data.json')
    await waitForFile(metadataPath)

    const blogData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    expect(blogData.posts).toHaveLength(2)
    expect(blogData.slugs).toEqual(
      expect.arrayContaining(['newest', 'old-no-date'])
    )
    expect(typeof blogData.lastBuilt).toBe('string')

    // Valid dated posts should be sorted first.
    expect(blogData.posts[0].slug).toBe('newest')
    expect(blogData.posts[1].slug).toBe('old-no-date')

    const newestContentPath = path.join(
      tempDir,
      'public/blog-content/newest.json'
    )
    const oldContentPath = path.join(
      tempDir,
      'public/blog-content/old-no-date.json'
    )

    expect(fs.existsSync(newestContentPath)).toBe(true)
    expect(fs.existsSync(oldContentPath)).toBe(true)

    const newestContent = JSON.parse(
      fs.readFileSync(newestContentPath, 'utf8')
    ).content
    expect(newestContent).toContain('<h1')
    expect(newestContent).toContain('<strong>bold</strong>')
    expect(newestContent).not.toContain('<script>')

    expect(logSpy).toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('old-no-date.md')
    )
    expect(errorSpy).not.toHaveBeenCalled()
    expect(exitSpy).not.toHaveBeenCalled()
  })

  it('writes empty output when content/blog is missing', async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-blog-data-empty-'))
    fs.mkdirSync(path.join(tempDir, 'lib'), { recursive: true })

    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined)

    process.chdir(tempDir)
    require(scriptPath)

    const metadataPath = path.join(tempDir, 'lib/blog-data.json')
    await waitForFile(metadataPath)

    const data = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    expect(data.posts).toEqual([])
    expect(data.slugs).toEqual([])
    expect(typeof data.lastBuilt).toBe('string')
    expect(errorSpy).not.toHaveBeenCalled()
    expect(exitSpy).not.toHaveBeenCalled()
  })
})
