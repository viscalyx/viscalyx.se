import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const analyzeBundle = require('../analyze-bundle.js')

const createdTempDirs = []

const makeTempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-test-'))
  createdTempDirs.push(dir)
  return dir
}

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

afterEach(() => {
  vi.restoreAllMocks()
  createdTempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
  createdTempDirs.length = 0
  delete process.env.GITHUB_OUTPUT
})

const withPatchedProcessExit = fn => {
  const originalExit = process.exit
  process.exit = code => {
    throw new Error(`exit:${code}`)
  }
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      process.exit = originalExit
    })
}

describe('analyze-bundle.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('formats bytes correctly', () => {
    expect(analyzeBundle.formatBytes(0)).toBe('0 B')
    expect(analyzeBundle.formatBytes(1024)).toBe('1.00 KB')
    expect(analyzeBundle.formatBytes(1024 * 1024)).toBe('1.00 MB (1024 KB)')
  })

  it('returns expected status emojis', () => {
    expect(analyzeBundle.getStatusEmoji('error')).toBe('❌')
    expect(analyzeBundle.getStatusEmoji('warning')).toBe('⚠️')
    expect(analyzeBundle.getStatusEmoji('info')).toBe('ℹ️')
    expect(analyzeBundle.getStatusEmoji('success')).toBe('✅')
  })

  it('creates progress bars with bounds', () => {
    expect(analyzeBundle.createProgressBar(0, 10)).toBe('[░░░░░░░░░░]')
    expect(analyzeBundle.createProgressBar(50, 10)).toBe('[█████░░░░░]')
    expect(analyzeBundle.createProgressBar(150, 10)).toBe('[██████████]')
  })

  it('parses wrangler output in KiB and MiB formats', () => {
    expect(
      analyzeBundle.parseWranglerOutput(
        'Total Upload: 1500.00 KiB / gzip: 450.00 KiB'
      )
    ).toEqual({ uncompressedKB: 1500, compressedKB: 450 })

    expect(
      analyzeBundle.parseWranglerOutput(
        'Total Upload: 1.50 MiB / gzip: 0.45 MiB'
      )
    ).toEqual({ uncompressedKB: 1536, compressedKB: 460.8 })

    expect(analyzeBundle.parseWranglerOutput('no size info')).toBeNull()
  })

  it('handles file and directory size helpers', () => {
    const dir = makeTempDir()
    const fileA = path.join(dir, 'a.txt')
    const nested = path.join(dir, 'nested', 'b.txt')
    writeFile(fileA, 'hello')
    writeFile(nested, 'world!')

    expect(analyzeBundle.getFileSize(fileA)).toBe(5)
    expect(analyzeBundle.getFileSize(path.join(dir, 'missing.txt'))).toBe(0)

    const size = analyzeBundle.getDirSize(dir)
    expect(size).toBeGreaterThanOrEqual(11)
    expect(analyzeBundle.getDirSize(path.join(dir, 'missing-dir'))).toBe(0)
  })

  it('returns gzip size and handles missing files', () => {
    const dir = makeTempDir()
    const file = path.join(dir, 'data.txt')
    writeFile(file, 'content for gzip test')

    expect(analyzeBundle.getGzipSize(file)).toBeGreaterThan(0)
    expect(analyzeBundle.getGzipSize(path.join(dir, 'nope.txt'))).toBe(0)
  })

  it('detects fresh and stale builds', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    process.chdir(dir)

    try {
      expect(analyzeBundle.isBuildFresh(30).fresh).toBe(false)

      const handler = path.join(
        dir,
        '.open-next',
        'server-functions',
        'default',
        'handler.mjs'
      )
      writeFile(handler, 'export default {}')

      const fresh = analyzeBundle.isBuildFresh(30)
      expect(fresh.fresh).toBe(true)
    } finally {
      process.chdir(originalCwd)
    }
  })

  it('analyzes build output and computes usage', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    process.chdir(dir)

    try {
      const handler = path.join(
        dir,
        '.open-next',
        'server-functions',
        'default',
        'handler.mjs'
      )
      const middleware = path.join(
        dir,
        '.open-next',
        'middleware',
        'handler.mjs'
      )
      const asset = path.join(dir, '.open-next', 'assets', 'asset.txt')
      writeFile(handler, 'console.log("handler")')
      writeFile(middleware, 'console.log("middleware")')
      writeFile(asset, 'asset-content')

      const results = analyzeBundle.analyzeBuild({ dryRun: false })
      expect(results.serverHandler.size).toBeGreaterThan(0)
      expect(results.middleware.size).toBeGreaterThan(0)
      expect(results.assets.size).toBeGreaterThan(0)
      expect(results.total.size).toBeGreaterThan(0)
      expect(results.usage).toBeDefined()
      expect(['success', 'info', 'warning', 'error']).toContain(results.status)
    } finally {
      process.chdir(originalCwd)
    }
  })

  it('sets warning/error/info status branches based on usage thresholds', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    const originalLimits = { ...analyzeBundle.LIMITS }
    process.chdir(dir)

    try {
      const handler = path.join(
        dir,
        '.open-next',
        'server-functions',
        'default',
        'handler.mjs'
      )
      writeFile(handler, 'console.log("handler")')

      analyzeBundle.LIMITS.freeCompressedMB = 0.000001
      analyzeBundle.LIMITS.paidCompressedMB = 1
      analyzeBundle.LIMITS.warnPercentage = 99
      expect(analyzeBundle.analyzeBuild({ dryRun: false }).status).toBe(
        'warning'
      )

      analyzeBundle.LIMITS.freeCompressedMB = 10
      analyzeBundle.LIMITS.paidCompressedMB = 0.000001
      analyzeBundle.LIMITS.warnPercentage = 99
      expect(analyzeBundle.analyzeBuild({ dryRun: false }).status).toBe('error')

      analyzeBundle.LIMITS.freeCompressedMB = 10
      analyzeBundle.LIMITS.paidCompressedMB = 1
      analyzeBundle.LIMITS.warnPercentage = 0.001
      expect(analyzeBundle.analyzeBuild({ dryRun: false }).status).toBe('info')
    } finally {
      process.chdir(originalCwd)
      Object.assign(analyzeBundle.LIMITS, originalLimits)
    }
  })

  it('returns error result when server handler missing and dryRun is false', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    process.chdir(dir)

    try {
      fs.mkdirSync(path.join(dir, '.open-next', 'assets'), { recursive: true })
      const results = analyzeBundle.analyzeBuild({ dryRun: false })
      expect(results.status).toBe('error')
      expect(results.statusMessage).toContain('Server handler not found')
    } finally {
      process.chdir(originalCwd)
    }
  })

  it('exits when build directory is missing', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    process.chdir(dir)
    vi.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`exit:${code}`)
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      expect(() => analyzeBundle.analyzeBuild({ dryRun: false })).toThrow(
        'exit:1'
      )
    } finally {
      process.chdir(originalCwd)
    }
  })

  it('returns error result when dry-run cannot determine wrangler sizes', () => {
    const dir = makeTempDir()
    const originalCwd = process.cwd()
    process.chdir(dir)

    try {
      const handler = path.join(
        dir,
        '.open-next',
        'server-functions',
        'default',
        'handler.mjs'
      )
      writeFile(handler, 'console.log("handler")')
      const results = analyzeBundle.analyzeBuild({ dryRun: true })
      expect(results.status).toBe('error')
      expect(results.statusMessage).toContain('dry-run requested')
    } finally {
      process.chdir(originalCwd)
    }
  })

  it('writes CI output including usage fields', () => {
    const dir = makeTempDir()
    const outFile = path.join(dir, 'github-output.txt')
    process.env.GITHUB_OUTPUT = outFile

    analyzeBundle.outputForCI({
      serverHandler: { size: 2048, gzipSize: 1024 },
      middleware: { size: 1024, gzipSize: 512 },
      assets: { size: 4096 },
      total: { size: 8192 },
      wrangler: { uncompressedKB: 1500, compressedKB: 450 },
      usage: {
        compressedMB: 0.439,
        freePercent: 14.6,
        paidPercent: 4.4,
        exceedsFree: false,
        exceedsPaid: false,
      },
      status: 'success',
      statusMessage: 'Bundle size OK',
    })

    const content = fs.readFileSync(outFile, 'utf8')
    expect(content).toContain('status=success')
    expect(content).toContain('free-usage-percent=14.6')
    expect(content).toContain('wrangler-gzip-formatted=450.00 KB')
  })

  it('renders markdown output with expected sections', () => {
    const originalLog = console.log
    const lines = []
    console.log = message => {
      lines.push(String(message))
    }

    try {
      analyzeBundle.outputForMarkdown({
        serverHandler: { size: 2048, gzipSize: 1024 },
        middleware: { size: 1024, gzipSize: 512 },
        assets: { size: 4096 },
        total: { size: 8192 },
        wrangler: { uncompressedKB: 1500, compressedKB: 450 },
        usage: {
          compressedMB: 0.439,
          freePercent: 14.6,
          paidPercent: 4.4,
          exceedsFree: false,
          exceedsPaid: false,
        },
        status: 'success',
        statusMessage: 'Bundle size OK',
      })
    } finally {
      console.log = originalLog
    }

    const captured = lines.join('\n')
    expect(captured).toContain('Bundle Size Report')
    expect(captured).toContain('Wrangler Bundle')
    expect(captured).toContain('Plan Usage')
    expect(captured).toContain('**Status:** Bundle size OK')
  })

  it('renders markdown warning and error advisory text', () => {
    const originalLog = console.log
    const lines = []
    console.log = message => lines.push(String(message))

    const base = {
      serverHandler: { size: 2048, gzipSize: 1024 },
      middleware: { size: 1024, gzipSize: 512 },
      assets: { size: 4096 },
      total: { size: 8192 },
      wrangler: null,
      usage: null,
    }

    try {
      analyzeBundle.outputForMarkdown({
        ...base,
        status: 'warning',
        statusMessage: 'warning',
      })
      analyzeBundle.outputForMarkdown({
        ...base,
        status: 'error',
        statusMessage: 'error',
      })
    } finally {
      console.log = originalLog
    }

    const combined = lines.join('\n')
    expect(combined).toContain('Consider optimizing bundle size')
    expect(combined).toContain('Action required')
    expect(combined).toContain('N/A')
  })

  it('renders terminal output with plan limits', () => {
    const originalLog = console.log
    const logs = []
    console.log = message => {
      logs.push(String(message))
    }

    try {
      analyzeBundle.outputForTerminal({
        serverHandler: { size: 2048, gzipSize: 1024 },
        middleware: { size: 1024, gzipSize: 512 },
        assets: { size: 4096 },
        serverFunctions: { size: 2048 },
        total: { size: 8192 },
        wrangler: null,
        usage: {
          compressedMB: 0.439,
          freePercent: 14.6,
          paidPercent: 4.4,
          exceedsFree: false,
          exceedsPaid: false,
        },
        status: 'success',
        statusMessage: 'Bundle size OK',
      })
    } finally {
      console.log = originalLog
    }

    const combined = logs.join('\n')
    expect(combined).toContain('Bundle Size Analysis')
    expect(combined).toContain('Cloudflare Workers Limits')
  })

  it('renders terminal output including wrangler section', () => {
    const originalLog = console.log
    const logs = []
    console.log = message => {
      logs.push(String(message))
    }

    try {
      analyzeBundle.outputForTerminal({
        serverHandler: { size: 2048, gzipSize: 1024 },
        middleware: { size: 1024, gzipSize: 512 },
        assets: { size: 4096 },
        serverFunctions: { size: 2048 },
        total: { size: 8192 },
        wrangler: { uncompressedKB: 1500, compressedKB: 450 },
        usage: null,
        status: 'success',
        statusMessage: 'Bundle size OK',
      })
    } finally {
      console.log = originalLog
    }

    expect(logs.join('\n')).toContain('Wrangler Bundle (what Cloudflare sees)')
  })

  it('main prints help and exits 0', async () => {
    const originalLog = console.log
    const logs = []
    console.log = message => logs.push(String(message))

    try {
      await withPatchedProcessExit(() => {
        expect(() => analyzeBundle.main(['--help'])).toThrow('exit:0')
      })
    } finally {
      console.log = originalLog
    }

    expect(logs.join('\n')).toContain(
      'Bundle Size Analyzer for Cloudflare Workers'
    )
  })

  it('main rejects invalid --max-age and exits 1', async () => {
    const originalError = console.error
    const errs = []
    console.error = message => errs.push(String(message))

    try {
      await withPatchedProcessExit(() => {
        expect(() => analyzeBundle.main(['--max-age=abc'])).toThrow('exit:1')
      })
    } finally {
      console.error = originalError
    }

    expect(errs.join('\n')).toContain('Invalid --max-age value')
  })

  it('main routes to JSON/markdown/ci/terminal outputs', () => {
    const originalLog = console.log
    const logs = []
    console.log = message => logs.push(String(message))

    const mockResults = {
      serverHandler: { size: 1, gzipSize: 1 },
      middleware: { size: 1, gzipSize: 1 },
      assets: { size: 1 },
      serverFunctions: { size: 1 },
      total: { size: 1 },
      status: 'success',
      statusMessage: 'ok',
    }

    try {
      analyzeBundle.main(['--json', '--no-build'], {
        analyzeBuild: () => mockResults,
      })
      analyzeBundle.main(['--markdown', '--no-build'], {
        analyzeBuild: () => mockResults,
        outputForMarkdown: () => logs.push('markdown-out'),
      })
      analyzeBundle.main(['--ci', '--no-build'], {
        analyzeBuild: () => mockResults,
        outputForCI: () => logs.push('ci-out'),
      })
      analyzeBundle.main(['--no-build'], {
        analyzeBuild: () => mockResults,
        outputForTerminal: () => logs.push('terminal-out'),
      })
    } finally {
      console.log = originalLog
    }

    const combined = logs.join('\n')
    expect(combined).toContain('"status": "success"')
    expect(combined).toContain('markdown-out')
    expect(combined).toContain('ci-out')
    expect(combined).toContain('terminal-out')
  })

  it('main exits when build is stale and rebuild fails', async () => {
    const originalError = console.error
    console.error = () => {}
    try {
      await withPatchedProcessExit(() => {
        expect(() =>
          analyzeBundle.main(['--max-age=1'], {
            isBuildFresh: () => ({ fresh: false, reason: 'stale build' }),
            runBuild: () => false,
          })
        ).toThrow('exit:1')
      })
    } finally {
      console.error = originalError
    }
  })

  it('main exits when analysis status is error', async () => {
    const originalError = console.error
    console.error = () => {}
    try {
      await withPatchedProcessExit(() => {
        expect(() =>
          analyzeBundle.main(['--no-build'], {
            analyzeBuild: () => ({
              serverHandler: { size: 0, gzipSize: 0 },
              middleware: { size: 0, gzipSize: 0 },
              assets: { size: 0 },
              serverFunctions: { size: 0 },
              total: { size: 0 },
              status: 'error',
              statusMessage: 'too big',
            }),
          })
        ).toThrow('exit:1')
      })
    } finally {
      console.error = originalError
    }
  })

  it('main uses existing build when fresh and sets dry-run by default', () => {
    const originalError = console.error
    const errs = []
    console.error = message => errs.push(String(message))

    const seen = []
    try {
      analyzeBundle.main([], {
        isBuildFresh: () => ({ fresh: true, ageMinutes: 2 }),
        analyzeBuild: options => {
          seen.push(options)
          return {
            serverHandler: { size: 0, gzipSize: 0 },
            middleware: { size: 0, gzipSize: 0 },
            assets: { size: 0 },
            serverFunctions: { size: 0 },
            total: { size: 0 },
            status: 'success',
            statusMessage: 'ok',
          }
        },
        outputForTerminal: () => {},
      })
    } finally {
      console.error = originalError
    }

    expect(errs.join('\n')).toContain('Using existing build')
    expect(seen[0].dryRun).toBe(true)
  })
})
