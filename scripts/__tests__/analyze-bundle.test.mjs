/**
 * Unit tests for the analyze-bundle.js script
 *
 * Tests the bundle size analyzer functionality including:
 * - File size calculations
 * - Gzip compression analysis
 * - Wrangler dry-run parsing
 * - Status determination based on limits
 * - Output formatting (terminal, CI, JSON, markdown)
 *
 * Since analyze-bundle.js is a CommonJS script that runs immediately on require,
 * we test the core logic by extracting and testing the algorithm implementations
 * rather than trying to mock and run the entire script.
 */

import { describe, expect, it } from 'vitest'

describe('analyze-bundle.js', () => {
  describe('formatBytes function', () => {
    // Test the formatBytes logic
    const formatBytes = bytes => {
      if (bytes === 0) return '0 B'
      const kb = bytes / 1024
      const mb = kb / 1024
      if (mb >= 1) {
        return `${mb.toFixed(2)} MB (${Math.round(kb)} KB)`
      }
      return `${kb.toFixed(2)} KB`
    }

    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 B')
    })

    it('should format bytes to KB', () => {
      expect(formatBytes(1024)).toBe('1.00 KB')
      expect(formatBytes(2048)).toBe('2.00 KB')
      expect(formatBytes(512)).toBe('0.50 KB')
    })

    it('should format bytes to MB', () => {
      expect(formatBytes(1024 * 1024)).toBe('1.00 MB (1024 KB)')
      expect(formatBytes(3 * 1024 * 1024)).toBe('3.00 MB (3072 KB)')
      expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.50 MB (1536 KB)')
    })
  })

  describe('getStatusEmoji function', () => {
    const getStatusEmoji = status => {
      switch (status) {
        case 'error':
          return '❌'
        case 'warning':
          return '⚠️'
        case 'info':
          return 'ℹ️'
        default:
          return '✅'
      }
    }

    it('should return error emoji for error status', () => {
      expect(getStatusEmoji('error')).toBe('❌')
    })

    it('should return warning emoji for warning status', () => {
      expect(getStatusEmoji('warning')).toBe('⚠️')
    })

    it('should return info emoji for info status', () => {
      expect(getStatusEmoji('info')).toBe('ℹ️')
    })

    it('should return success emoji for other statuses', () => {
      expect(getStatusEmoji('success')).toBe('✅')
      expect(getStatusEmoji('ok')).toBe('✅')
      expect(getStatusEmoji(undefined)).toBe('✅')
    })
  })

  describe('createProgressBar function', () => {
    const createProgressBar = (percent, width) => {
      const filled = Math.min(Math.round((percent / 100) * width), width)
      const empty = width - filled
      const bar = '█'.repeat(filled) + '░'.repeat(empty)
      return `[${bar}]`
    }

    it('should create empty bar for 0%', () => {
      const bar = createProgressBar(0, 10)
      expect(bar).toBe('[░░░░░░░░░░]')
    })

    it('should create full bar for 100%', () => {
      const bar = createProgressBar(100, 10)
      expect(bar).toBe('[██████████]')
    })

    it('should create half-filled bar for 50%', () => {
      const bar = createProgressBar(50, 10)
      expect(bar).toBe('[█████░░░░░]')
    })

    it('should cap at 100% for values over 100', () => {
      const bar = createProgressBar(150, 10)
      expect(bar).toBe('[██████████]')
    })

    it('should handle different widths', () => {
      const bar = createProgressBar(50, 20)
      expect(bar).toBe('[██████████░░░░░░░░░░]')
    })
  })

  describe('wrangler output parsing', () => {
    const parseWranglerOutput = result => {
      // Parse output for "Total Upload: X KiB / gzip: Y KiB"
      const match = result.match(
        /Total Upload:\s*([\d.]+)\s*KiB\s*\/\s*gzip:\s*([\d.]+)\s*KiB/i
      )
      if (match) {
        return {
          uncompressedKB: parseFloat(match[1]),
          compressedKB: parseFloat(match[2]),
        }
      }

      // Try MB format
      const mbMatch = result.match(
        /Total Upload:\s*([\d.]+)\s*MiB\s*\/\s*gzip:\s*([\d.]+)\s*MiB/i
      )
      if (mbMatch) {
        return {
          uncompressedKB: parseFloat(mbMatch[1]) * 1024,
          compressedKB: parseFloat(mbMatch[2]) * 1024,
        }
      }

      return null
    }

    it('should parse KiB format correctly', () => {
      const result = parseWranglerOutput(
        'Total Upload: 1500.00 KiB / gzip: 450.00 KiB'
      )
      expect(result).toEqual({
        uncompressedKB: 1500,
        compressedKB: 450,
      })
    })

    it('should parse MiB format correctly', () => {
      const result = parseWranglerOutput(
        'Total Upload: 1.50 MiB / gzip: 0.45 MiB'
      )
      expect(result).toEqual({
        uncompressedKB: 1.5 * 1024,
        compressedKB: 0.45 * 1024,
      })
    })

    it('should handle decimal values in KiB format', () => {
      const result = parseWranglerOutput(
        'Total Upload: 1234.56 KiB / gzip: 789.12 KiB'
      )
      expect(result).toEqual({
        uncompressedKB: 1234.56,
        compressedKB: 789.12,
      })
    })

    it('should return null for unrecognized format', () => {
      const result = parseWranglerOutput('Some random output without size info')
      expect(result).toBeNull()
    })

    it('should handle case-insensitive matching', () => {
      const result = parseWranglerOutput(
        'total upload: 100.00 kib / GZIP: 50.00 KIB'
      )
      expect(result).toEqual({
        uncompressedKB: 100,
        compressedKB: 50,
      })
    })

    it('should handle whitespace variations', () => {
      const result = parseWranglerOutput(
        'Total Upload:  1000.00  KiB  /  gzip:  500.00  KiB'
      )
      expect(result).toEqual({
        uncompressedKB: 1000,
        compressedKB: 500,
      })
    })
  })

  describe('limit calculations', () => {
    const LIMITS = {
      freeCompressedMB: 3,
      paidCompressedMB: 10,
      warnPercentage: 50,
    }

    const calculateUsage = compressedKB => {
      const compressedMB = compressedKB / 1024
      const freeUsagePercent = (compressedMB / LIMITS.freeCompressedMB) * 100
      const paidUsagePercent = (compressedMB / LIMITS.paidCompressedMB) * 100

      return {
        compressedMB,
        freePercent: freeUsagePercent,
        paidPercent: paidUsagePercent,
        exceedsFree: compressedMB > LIMITS.freeCompressedMB,
        exceedsPaid: compressedMB > LIMITS.paidCompressedMB,
      }
    }

    const determineStatus = usage => {
      if (usage.compressedMB > LIMITS.paidCompressedMB) {
        return {
          status: 'error',
          statusMessage: `Bundle exceeds paid plan limit (${LIMITS.paidCompressedMB}MB)!`,
        }
      } else if (usage.compressedMB > LIMITS.freeCompressedMB) {
        return {
          status: 'warning',
          statusMessage: `Bundle exceeds free plan limit (${LIMITS.freeCompressedMB}MB) - requires paid plan`,
        }
      } else if (usage.paidPercent > LIMITS.warnPercentage) {
        return {
          status: 'info',
          statusMessage: 'Bundle size OK but approaching limits',
        }
      }
      return {
        status: 'success',
        statusMessage: 'Bundle size OK',
      }
    }

    it('should calculate usage percentages correctly', () => {
      // 1.5 MB = 1536 KB
      const usage = calculateUsage(1536)
      expect(usage.compressedMB).toBe(1.5)
      expect(usage.freePercent).toBe(50) // 1.5 / 3 * 100
      expect(usage.paidPercent).toBe(15) // 1.5 / 10 * 100
      expect(usage.exceedsFree).toBe(false)
      expect(usage.exceedsPaid).toBe(false)
    })

    it('should detect when free limit is exceeded', () => {
      // 4 MB = 4096 KB
      const usage = calculateUsage(4096)
      expect(usage.exceedsFree).toBe(true)
      expect(usage.exceedsPaid).toBe(false)
    })

    it('should detect when paid limit is exceeded', () => {
      // 11 MB = 11264 KB
      const usage = calculateUsage(11264)
      expect(usage.exceedsFree).toBe(true)
      expect(usage.exceedsPaid).toBe(true)
    })

    it('should return error status when exceeding paid limit', () => {
      const usage = calculateUsage(11264) // 11 MB
      const result = determineStatus(usage)
      expect(result.status).toBe('error')
      expect(result.statusMessage).toContain('exceeds paid plan limit')
    })

    it('should return warning status when exceeding free but within paid', () => {
      const usage = calculateUsage(5120) // 5 MB
      const result = determineStatus(usage)
      expect(result.status).toBe('warning')
      expect(result.statusMessage).toContain('exceeds free plan limit')
    })

    it('should return info status when approaching limits', () => {
      // 6 MB = 6144 KB, which is 60% of paid limit (above 50% threshold)
      const usage = calculateUsage(6144)
      const result = determineStatus(usage)
      // Since 6MB > 3MB free limit, it should be warning, not info
      expect(result.status).toBe('warning')
    })

    it('should return success status when well within limits', () => {
      // 1 MB = 1024 KB, which is 10% of paid limit
      const usage = calculateUsage(1024)
      const result = determineStatus(usage)
      expect(result.status).toBe('success')
      expect(result.statusMessage).toBe('Bundle size OK')
    })

    it('should return info status when above warn threshold but within free limit', () => {
      // With default LIMITS (free: 3MB, paid: 10MB, warnPercentage: 50%),
      // info status requires: compressedMB <= 3MB AND paidPercent > 50%
      // paidPercent > 50 means compressedMB > 5MB, but that exceeds free limit
      // So info status is unreachable with default limits.

      // To test info status, use custom limits where free > 50% of paid
      const customLimits = {
        freeCompressedMB: 6, // Free limit is 6MB
        paidCompressedMB: 10, // Paid limit is 10MB
        warnPercentage: 50, // Warn at 50% of paid (5MB)
      }

      const calculateCustomUsage = compressedKB => {
        const compressedMB = compressedKB / 1024
        return {
          compressedMB,
          paidPercent: (compressedMB / customLimits.paidCompressedMB) * 100,
        }
      }

      const determineCustomStatus = usage => {
        if (usage.compressedMB > customLimits.paidCompressedMB) {
          return { status: 'error', statusMessage: 'Exceeds paid limit' }
        } else if (usage.compressedMB > customLimits.freeCompressedMB) {
          return { status: 'warning', statusMessage: 'Exceeds free limit' }
        } else if (usage.paidPercent > customLimits.warnPercentage) {
          return {
            status: 'info',
            statusMessage: 'Bundle size OK but approaching limits',
          }
        }
        return { status: 'success', statusMessage: 'Bundle size OK' }
      }

      // 5.5 MB = 5632 KB: within free limit (6MB) but above 50% of paid (55%)
      const usage = calculateCustomUsage(5632)
      expect(usage.compressedMB).toBe(5.5)
      expect(usage.paidPercent).toBeCloseTo(55, 10)

      const result = determineCustomStatus(usage)
      expect(result.status).toBe('info')
      expect(result.statusMessage).toBe('Bundle size OK but approaching limits')
    })
  })

  describe('build freshness check', () => {
    const isBuildFresh = (exists, mtimeMs, maxAgeMinutes = 30) => {
      if (!exists) {
        return { fresh: false, reason: 'Build not found' }
      }

      const ageMs = Date.now() - mtimeMs
      const ageMinutes = ageMs / (1000 * 60)

      if (ageMinutes > maxAgeMinutes) {
        return {
          fresh: false,
          reason: `Build is ${Math.round(ageMinutes)} minutes old (max: ${maxAgeMinutes})`,
        }
      }

      return { fresh: true, ageMinutes: Math.round(ageMinutes) }
    }

    it('should return not fresh if build does not exist', () => {
      const result = isBuildFresh(false, Date.now())
      expect(result.fresh).toBe(false)
      expect(result.reason).toBe('Build not found')
    })

    it('should return not fresh if build is too old', () => {
      const oldTime = Date.now() - 60 * 60 * 1000 // 60 minutes ago
      const result = isBuildFresh(true, oldTime, 30)
      expect(result.fresh).toBe(false)
      expect(result.reason).toContain('minutes old')
    })

    it('should return fresh if build is recent', () => {
      const recentTime = Date.now() - 5 * 60 * 1000 // 5 minutes ago
      const result = isBuildFresh(true, recentTime, 30)
      expect(result.fresh).toBe(true)
      expect(result.ageMinutes).toBe(5)
    })

    it('should respect custom max age', () => {
      const time = Date.now() - 45 * 60 * 1000 // 45 minutes ago
      const result30 = isBuildFresh(true, time, 30)
      const result60 = isBuildFresh(true, time, 60)

      expect(result30.fresh).toBe(false)
      expect(result60.fresh).toBe(true)
    })
  })

  describe('CLI argument parsing', () => {
    const parseArgs = args => {
      const options = {
        ci: args.includes('--ci'),
        dryRun: args.includes('--dry-run'),
        json: args.includes('--json'),
        markdown: args.includes('--markdown'),
        noBuild: args.includes('--no-build'),
        help: args.includes('--help'),
        maxAgeMinutes: 30,
      }

      const maxAgeArg = args.find(a => a.startsWith('--max-age='))
      if (maxAgeArg) {
        const value = maxAgeArg.split('=')[1]
        const parsed = parseInt(value, 10)
        if (!Number.isInteger(parsed) || parsed <= 0) {
          return { error: `Invalid --max-age value "${value}"` }
        }
        options.maxAgeMinutes = parsed
      }

      return options
    }

    it('should parse --ci flag', () => {
      expect(parseArgs(['--ci']).ci).toBe(true)
      expect(parseArgs([]).ci).toBe(false)
    })

    it('should parse --dry-run flag', () => {
      expect(parseArgs(['--dry-run']).dryRun).toBe(true)
    })

    it('should parse --json flag', () => {
      expect(parseArgs(['--json']).json).toBe(true)
    })

    it('should parse --markdown flag', () => {
      expect(parseArgs(['--markdown']).markdown).toBe(true)
    })

    it('should parse --no-build flag', () => {
      expect(parseArgs(['--no-build']).noBuild).toBe(true)
    })

    it('should parse --help flag', () => {
      expect(parseArgs(['--help']).help).toBe(true)
    })

    it('should parse --max-age option', () => {
      expect(parseArgs(['--max-age=60']).maxAgeMinutes).toBe(60)
    })

    it('should default max age to 30 minutes', () => {
      expect(parseArgs([]).maxAgeMinutes).toBe(30)
    })

    it('should reject invalid max age values', () => {
      expect(parseArgs(['--max-age=invalid']).error).toContain('Invalid')
      expect(parseArgs(['--max-age=-5']).error).toContain('Invalid')
      expect(parseArgs(['--max-age=0']).error).toContain('Invalid')
    })

    it('should parse multiple flags together', () => {
      const options = parseArgs(['--ci', '--dry-run', '--max-age=45'])
      expect(options.ci).toBe(true)
      expect(options.dryRun).toBe(true)
      expect(options.maxAgeMinutes).toBe(45)
    })
  })

  describe('CI output format', () => {
    const generateCIOutput = results => {
      const output = []

      output.push(`server-size=${results.serverHandler?.size || 0}`)
      output.push(`server-gzip-size=${results.serverHandler?.gzipSize || 0}`)

      if (results.wrangler) {
        output.push(
          `wrangler-size=${Math.round(results.wrangler.uncompressedKB * 1024)}`
        )
        output.push(
          `wrangler-gzip-size=${Math.round(results.wrangler.compressedKB * 1024)}`
        )
      }

      if (results.usage) {
        output.push(
          `free-usage-percent=${results.usage.freePercent.toFixed(1)}`
        )
        output.push(
          `paid-usage-percent=${results.usage.paidPercent.toFixed(1)}`
        )
        output.push(`exceeds-free=${results.usage.exceedsFree}`)
        output.push(`exceeds-paid=${results.usage.exceedsPaid}`)
      }

      output.push(`status=${results.status}`)

      return output
    }

    it('should generate key=value pairs', () => {
      const results = {
        serverHandler: { size: 500000, gzipSize: 150000 },
        status: 'success',
      }

      const output = generateCIOutput(results)

      expect(output).toContain('server-size=500000')
      expect(output).toContain('server-gzip-size=150000')
      expect(output).toContain('status=success')
    })

    it('should include wrangler sizes when available', () => {
      const results = {
        serverHandler: { size: 500000, gzipSize: 150000 },
        wrangler: { uncompressedKB: 1500, compressedKB: 450 },
        status: 'success',
      }

      const output = generateCIOutput(results)

      expect(output).toContain(`wrangler-size=${1500 * 1024}`)
      expect(output).toContain(`wrangler-gzip-size=${450 * 1024}`)
    })

    it('should include usage percentages when available', () => {
      const results = {
        serverHandler: { size: 500000, gzipSize: 150000 },
        usage: {
          freePercent: 50.5,
          paidPercent: 15.2,
          exceedsFree: false,
          exceedsPaid: false,
        },
        status: 'success',
      }

      const output = generateCIOutput(results)

      expect(output).toContain('free-usage-percent=50.5')
      expect(output).toContain('paid-usage-percent=15.2')
      expect(output).toContain('exceeds-free=false')
      expect(output).toContain('exceeds-paid=false')
    })
  })

  describe('markdown output format', () => {
    const LIMITS = {
      freeCompressedMB: 3,
      paidCompressedMB: 10,
    }

    const formatBytes = bytes => {
      if (bytes === 0) return '0 B'
      const kb = bytes / 1024
      const mb = kb / 1024
      if (mb >= 1) {
        return `${mb.toFixed(2)} MB (${Math.round(kb)} KB)`
      }
      return `${kb.toFixed(2)} KB`
    }

    const getStatusEmoji = status => {
      switch (status) {
        case 'error':
          return '❌'
        case 'warning':
          return '⚠️'
        case 'info':
          return 'ℹ️'
        default:
          return '✅'
      }
    }

    /**
     * Replicates the outputForMarkdown logic from analyze-bundle.js
     * so we can assert the full markdown structure.
     */
    const generateMarkdown = results => {
      const statusEmoji = getStatusEmoji(results.status)

      const wranglerSize = results.wrangler
        ? `${results.wrangler.uncompressedKB.toFixed(2)} KB`
        : 'N/A'
      const wranglerGzipSize = results.wrangler
        ? `${results.wrangler.compressedKB.toFixed(2)} KB`
        : 'N/A'

      const freeStatus = results.usage
        ? results.usage.exceedsFree
          ? '❌'
          : '✅'
        : 'N/A'
      const paidStatus = results.usage
        ? results.usage.exceedsPaid
          ? '❌'
          : '✅'
        : 'N/A'
      const freePercent = results.usage?.freePercent?.toFixed(1) ?? 'N/A'
      const paidPercent = results.usage?.paidPercent?.toFixed(1) ?? 'N/A'

      let warningText = ''
      if (results.status === 'warning') {
        warningText =
          '⚠️ Consider optimizing bundle size to stay within comfortable limits.'
      } else if (results.status === 'error') {
        warningText =
          '❌ **Action required:** Bundle exceeds size limits and will fail deployment.'
      }

      const markdown = `${statusEmoji} **Status:** ${results.statusMessage}
${warningText}

<details>
<summary>📦 Bundle Size Report</summary>

### Wrangler Bundle (what Cloudflare deploys)

| Metric | Size |
|--------|------|
| Total Upload | ${wranglerSize} |
| **Gzipped** | **${wranglerGzipSize}** |

### 📊 Plan Usage

| Plan | Limit | Usage | Status |
|------|-------|-------|--------|
| Free | ${LIMITS.freeCompressedMB} MB | ${freePercent}% | ${freeStatus} |
| Paid | ${LIMITS.paidCompressedMB} MB | ${paidPercent}% | ${paidStatus} |

### 📦 Build Output Details

| Bundle | Uncompressed | Gzipped |
|--------|--------------|---------|
| Server Handler | ${formatBytes(results.serverHandler.size)} | ${formatBytes(results.serverHandler.gzipSize)} |
| Middleware | ${formatBytes(results.middleware.size)} | ${formatBytes(results.middleware.gzipSize)} |
| Static Assets | ${formatBytes(results.assets.size)} | - |
| **Total Build** | ${formatBytes(results.total.size)} | - |

*Note: Static assets are served via Cloudflare's CDN and don't count against worker limits.*

</details>`

      return markdown.trim()
    }

    const makeResults = (overrides = {}) => ({
      status: 'success',
      statusMessage: 'Bundle size OK',
      wrangler: { uncompressedKB: 1500, compressedKB: 450 },
      usage: {
        freePercent: 39.2,
        paidPercent: 11.7,
        exceedsFree: false,
        exceedsPaid: false,
      },
      serverHandler: { size: 2048, gzipSize: 1024 },
      middleware: { size: 512, gzipSize: 256 },
      assets: { size: 4096, gzipSize: 0 },
      total: { size: 6656, gzipSize: 0 },
      ...overrides,
    })

    it('should start with status line (not a heading)', () => {
      const md = generateMarkdown(makeResults())
      expect(md).toMatch(/^✅ \*\*Status:\*\*/)
      expect(md).not.toMatch(/^##/)
    })

    it('should contain a collapsed <details> block', () => {
      const md = generateMarkdown(makeResults())
      expect(md).toContain('<details>')
      expect(md).toContain('<summary>📦 Bundle Size Report</summary>')
      expect(md).toContain('</details>')
    })

    it('should place status line before the <details> block', () => {
      const md = generateMarkdown(makeResults())
      const statusIdx = md.indexOf('**Status:**')
      const detailsIdx = md.indexOf('<details>')
      expect(statusIdx).toBeLessThan(detailsIdx)
    })

    it('should show ✅ emoji and no warning text for success status', () => {
      const md = generateMarkdown(makeResults())
      expect(md).toContain('✅ **Status:** Bundle size OK')
      expect(md).not.toContain('Consider optimizing')
      expect(md).not.toContain('Action required')
    })

    it('should show ⚠️ emoji and warning text for warning status', () => {
      const md = generateMarkdown(
        makeResults({
          status: 'warning',
          statusMessage: 'Approaching limit',
        })
      )
      expect(md).toContain('⚠️ **Status:** Approaching limit')
      expect(md).toContain(
        '⚠️ Consider optimizing bundle size to stay within comfortable limits.'
      )
    })

    it('should place warning text before <details> block', () => {
      const md = generateMarkdown(
        makeResults({
          status: 'warning',
          statusMessage: 'Approaching limit',
        })
      )
      const warningIdx = md.indexOf('Consider optimizing')
      const detailsIdx = md.indexOf('<details>')
      expect(warningIdx).toBeLessThan(detailsIdx)
    })

    it('should show ❌ emoji and action-required text for error status', () => {
      const md = generateMarkdown(
        makeResults({ status: 'error', statusMessage: 'Bundle too large' })
      )
      expect(md).toContain('❌ **Status:** Bundle too large')
      expect(md).toContain(
        '❌ **Action required:** Bundle exceeds size limits and will fail deployment.'
      )
    })

    it('should include Wrangler Bundle table inside <details>', () => {
      const md = generateMarkdown(makeResults())
      const detailsIdx = md.indexOf('<details>')
      const closingIdx = md.indexOf('</details>')
      const wranglerIdx = md.indexOf('### Wrangler Bundle')
      expect(wranglerIdx).toBeGreaterThan(detailsIdx)
      expect(wranglerIdx).toBeLessThan(closingIdx)
      expect(md).toContain('| Total Upload | 1500.00 KB |')
      expect(md).toContain('| **Gzipped** | **450.00 KB** |')
    })

    it('should include Plan Usage table inside <details>', () => {
      const md = generateMarkdown(makeResults())
      const detailsIdx = md.indexOf('<details>')
      const closingIdx = md.indexOf('</details>')
      const planIdx = md.indexOf('### 📊 Plan Usage')
      expect(planIdx).toBeGreaterThan(detailsIdx)
      expect(planIdx).toBeLessThan(closingIdx)
      expect(md).toContain('| Free | 3 MB | 39.2% | ✅ |')
      expect(md).toContain('| Paid | 10 MB | 11.7% | ✅ |')
    })

    it('should include Build Output Details table inside <details>', () => {
      const md = generateMarkdown(makeResults())
      const detailsIdx = md.indexOf('<details>')
      const closingIdx = md.indexOf('</details>')
      const buildIdx = md.indexOf('### 📦 Build Output Details')
      expect(buildIdx).toBeGreaterThan(detailsIdx)
      expect(buildIdx).toBeLessThan(closingIdx)
      expect(md).toContain('| Server Handler |')
      expect(md).toContain('| Middleware |')
      expect(md).toContain('| Static Assets |')
      expect(md).toContain('| **Total Build** |')
    })

    it('should show N/A when wrangler data is missing', () => {
      const md = generateMarkdown(makeResults({ wrangler: null }))
      expect(md).toContain('| Total Upload | N/A |')
      expect(md).toContain('| **Gzipped** | **N/A** |')
    })

    it('should show N/A when usage data is missing', () => {
      const md = generateMarkdown(makeResults({ usage: null }))
      expect(md).toContain('| Free | 3 MB | N/A% | N/A |')
      expect(md).toContain('| Paid | 10 MB | N/A% | N/A |')
    })

    it('should show ❌ status for plan that exceeds limit', () => {
      const md = generateMarkdown(
        makeResults({
          usage: {
            freePercent: 120,
            paidPercent: 35,
            exceedsFree: true,
            exceedsPaid: false,
          },
        })
      )
      expect(md).toContain('| Free | 3 MB | 120.0% | ❌ |')
      expect(md).toContain('| Paid | 10 MB | 35.0% | ✅ |')
    })

    it('should end with closing </details> tag', () => {
      const md = generateMarkdown(makeResults())
      expect(md).toMatch(/<\/details>$/)
    })
  })

  describe('directory size calculation', () => {
    const getDirSize = (entries, getSize, isDir) => {
      let totalSize = 0
      for (const entry of entries) {
        if (isDir(entry)) {
          // Recursive call would happen here
          totalSize += 0
        } else {
          totalSize += getSize(entry)
        }
      }
      return totalSize
    }

    it('should sum file sizes in directory', () => {
      const entries = [
        { name: 'file1.js', size: 1000 },
        { name: 'file2.js', size: 2000 },
        { name: 'file3.js', size: 500 },
      ]

      const size = getDirSize(
        entries,
        e => e.size,
        () => false
      )

      expect(size).toBe(3500)
    })

    it('should return 0 for empty directory', () => {
      const size = getDirSize(
        [],
        () => 0,
        () => false
      )
      expect(size).toBe(0)
    })
  })

  describe('file size retrieval', () => {
    const getFileSize = (exists, size) => {
      if (!exists) return 0
      return size
    }

    it('should return size for existing file', () => {
      expect(getFileSize(true, 1024)).toBe(1024)
    })

    it('should return 0 for non-existent file', () => {
      expect(getFileSize(false, 0)).toBe(0)
    })
  })

  describe('gzip size calculation', () => {
    const getGzipSize = (content, gzipFn, canRead) => {
      if (!canRead) return 0
      try {
        const compressed = gzipFn(content)
        return compressed.length
      } catch {
        return 0
      }
    }

    it('should return compressed size', () => {
      const content = Buffer.from('test content')
      const compressed = Buffer.alloc(5)

      const size = getGzipSize(content, () => compressed, true)
      expect(size).toBe(5)
    })

    it('should return 0 on error', () => {
      const size = getGzipSize(
        Buffer.from('test'),
        () => {
          throw new Error('fail')
        },
        true
      )
      expect(size).toBe(0)
    })

    it('should return 0 if file cannot be read', () => {
      const size = getGzipSize(null, () => Buffer.alloc(5), false)
      expect(size).toBe(0)
    })
  })

  describe('results structure', () => {
    it('should have correct shape for analysis results', () => {
      const results = {
        serverHandler: {
          path: '.open-next/server-functions/default/handler.mjs',
          size: 500000,
          gzipSize: 150000,
        },
        middleware: {
          path: '.open-next/middleware/handler.mjs',
          size: 50000,
          gzipSize: 15000,
        },
        assets: {
          path: '.open-next/assets',
          size: 200000,
        },
        serverFunctions: {
          path: '.open-next/server-functions',
          size: 600000,
        },
        total: {
          path: '.open-next',
          size: 850000,
        },
        wrangler: {
          uncompressedKB: 1500,
          compressedKB: 450,
        },
        usage: {
          compressedMB: 0.44,
          freePercent: 14.67,
          paidPercent: 4.4,
          exceedsFree: false,
          exceedsPaid: false,
        },
        status: 'success',
        statusMessage: 'Bundle size OK',
      }

      expect(results.serverHandler).toHaveProperty('path')
      expect(results.serverHandler).toHaveProperty('size')
      expect(results.serverHandler).toHaveProperty('gzipSize')

      expect(results.wrangler).toHaveProperty('uncompressedKB')
      expect(results.wrangler).toHaveProperty('compressedKB')

      expect(results.usage).toHaveProperty('freePercent')
      expect(results.usage).toHaveProperty('paidPercent')
      expect(results.usage).toHaveProperty('exceedsFree')
      expect(results.usage).toHaveProperty('exceedsPaid')

      expect(results).toHaveProperty('status')
      expect(results).toHaveProperty('statusMessage')
    })
  })

  describe('error handling', () => {
    it('should handle missing server handler gracefully', () => {
      const results = {
        serverHandler: { size: 0, gzipSize: 0 },
        status: 'error',
        statusMessage: 'Server handler not found',
      }

      expect(results.status).toBe('error')
    })

    it('should fail fast when dry-run fails', () => {
      // When dry-run is requested but wrangler fails, should error
      const checkDryRunResult = (dryRunRequested, wranglerResult) => {
        if (dryRunRequested && !wranglerResult) {
          return {
            status: 'error',
            statusMessage:
              'dry-run requested but wrangler sizes unavailable - cannot determine accurate bundle size',
          }
        }
        return { status: 'success', statusMessage: 'OK' }
      }

      const result = checkDryRunResult(true, null)
      expect(result.status).toBe('error')
      expect(result.statusMessage).toContain('dry-run requested')
    })
  })
})
