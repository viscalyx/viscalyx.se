import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const og = require('../generate-og-images.js')

const createSharpMock = () => {
  const sharpImpl = input => {
    const api = {
      resize: () => api,
      png: () => api,
      composite: () => api,
      toBuffer: async () => Buffer.from(String(input).slice(0, 8)),
      toFile: async outputPath => {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true })
        fs.writeFileSync(outputPath, 'png-data')
      },
    }
    return api
  }
  return sharpImpl
}

const withPreservedFile = async (filePath, run) => {
  const existed = fs.existsSync(filePath)
  const original = existed ? fs.readFileSync(filePath) : null

  try {
    await run()
  } finally {
    if (existed) {
      fs.writeFileSync(filePath, original)
    } else if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

describe('generate-og-images.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports expected OG constants', () => {
    expect(og.OG_WIDTH).toBe(1200)
    expect(og.OG_HEIGHT).toBe(630)
    expect(og.LOGO_SIZE).toBe(280)
    expect(og.LOCALES).toEqual(['en', 'sv'])
  })

  it('loadSharp returns null or a function depending on environment', () => {
    const sharp = og.loadSharp()
    expect(sharp === null || typeof sharp === 'function').toBe(true)
  })

  it('escapes xml-sensitive characters', () => {
    expect(og.escapeXml(`A & B <tag> "x" 'y'`)).toBe(
      'A &amp; B &lt;tag&gt; &quot;x&quot; &apos;y&apos;'
    )
  })

  it('loads locale strings from messages', () => {
    const en = og.getLocaleStrings('en')
    expect(en.title).toBeTypeOf('string')
    expect(en.tagline).toBeTypeOf('string')
    expect(en.title.length).toBeGreaterThan(0)
    expect(en.tagline.length).toBeGreaterThan(0)
  })

  it('throws for missing locale file', () => {
    expect(() => og.getLocaleStrings('xx')).toThrow()
  })

  it('throws when locale file exists but required keys are missing', () => {
    const testLocale = 'unit-test-missing-og'
    const tempMessagesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'og-msg-'))
    const filePath = path.join(tempMessagesDir, `${testLocale}.json`)
    return withPreservedFile(filePath, async () => {
      fs.mkdirSync(tempMessagesDir, { recursive: true })
      fs.writeFileSync(filePath, JSON.stringify({ blog: {} }))
      expect(() => og.getLocaleStrings(testLocale, tempMessagesDir)).toThrow(
        `Missing blog.og.title or blog.og.tagline in messages/${testLocale}.json`
      )
    }).finally(() => {
      fs.rmSync(tempMessagesDir, { recursive: true, force: true })
    })
  })

  it('builds background svg and escapes injected content', () => {
    const svg = og.buildBackgroundSVG(`A & B`, `<unsafe>`)
    expect(svg).toContain('<svg')
    expect(svg).toContain('A &amp; B')
    expect(svg).toContain('&lt;unsafe&gt;')
    expect(svg).toContain(`width="${og.OG_WIDTH}"`)
    expect(svg).toContain(`height="${og.OG_HEIGHT}"`)
  })

  it('throws when generateBlogOG is called without sharp', async () => {
    await expect(og.generateBlogOG('en', null)).rejects.toThrow(
      'sharp is not installed'
    )
  })

  it('generates an OG image using injected sharp implementation', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'og-script-'))
    const tempScriptsDir = path.join(tempRoot, 'scripts')
    const tempMessagesDir = path.join(tempRoot, 'messages')
    const tempPublicDir = path.join(tempRoot, 'public')
    const copiedScriptPath = path.join(tempScriptsDir, 'generate-og-images.js')
    fs.mkdirSync(tempScriptsDir, { recursive: true })
    fs.mkdirSync(tempMessagesDir, { recursive: true })
    fs.mkdirSync(tempPublicDir, { recursive: true })

    fs.copyFileSync(
      path.join(process.cwd(), 'scripts', 'generate-og-images.js'),
      copiedScriptPath
    )
    fs.copyFileSync(
      path.join(process.cwd(), 'messages', 'en.json'),
      path.join(tempMessagesDir, 'en.json')
    )
    fs.copyFileSync(
      path.join(process.cwd(), 'public', 'viscalyx_logo.svg'),
      path.join(tempPublicDir, 'viscalyx_logo.svg')
    )

    const tempRequire = createRequire(copiedScriptPath)
    const tempOg = tempRequire('./generate-og-images.js')
    const outputPath = path.join(tempPublicDir, 'og-blog-en.png')
    try {
      await withPreservedFile(outputPath, async () => {
        await tempOg.generateBlogOG('en', createSharpMock())
        expect(fs.existsSync(outputPath)).toBe(true)
        const stat = fs.statSync(outputPath)
        expect(stat.size).toBeGreaterThan(0)
      })
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('main exits when sharp is unavailable', async () => {
    vi.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`exit:${code}`)
    })
    await expect(() => og.main(null)).rejects.toThrow('exit:1')
  })

  it('main runs successfully with injected sharp and locale list', async () => {
    const outputPath = path.join(process.cwd(), 'public', 'og-blog-en.png')
    await withPreservedFile(outputPath, async () => {
      await og.main(createSharpMock(), ['en'])
      expect(fs.existsSync(outputPath)).toBe(true)
    })
  })

  it('main exits when at least one locale generation fails', async () => {
    vi.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`exit:${code}`)
    })

    const failingSharp = () => {
      throw new Error('sharp failed')
    }

    await expect(() => og.main(failingSharp, ['en'])).rejects.toThrow('exit:1')
  })
})
