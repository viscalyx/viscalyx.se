#!/usr/bin/env node
/**
 * Bundle Size Analyzer for Cloudflare Workers
 *
 * Analyzes the OpenNext build output and reports sizes.
 * Can also run a dry-run deployment to get the actual wrangler bundle size.
 *
 * Usage:
 *   node scripts/analyze-bundle.js [options]
 *
 * Options:
 *   --ci          Output in GitHub Actions format
 *   --dry-run     Run wrangler deploy --dry-run to get actual bundle size
 *   --json        Output as JSON
 *   --help        Show help
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Cloudflare Workers limits (gzipped)
const LIMITS = {
  // Free plan: 3MB compressed
  freeCompressedMB: 3,
  // Paid plan: 10MB compressed
  paidCompressedMB: 10,
  // Warning threshold (percentage of paid limit)
  warnPercentage: 50,
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const kb = bytes / 1024
  const mb = kb / 1024
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB (${Math.round(kb)} KB)`
  }
  return `${kb.toFixed(2)} KB`
}

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size
  } catch {
    return 0
  }
}

/**
 * Get directory size recursively
 */
function getDirSize(dirPath) {
  let totalSize = 0
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name)
      if (item.isDirectory()) {
        totalSize += getDirSize(itemPath)
      } else {
        totalSize += getFileSize(itemPath)
      }
    }
  } catch {
    return 0
  }
  return totalSize
}

/**
 * Get gzipped size of a file using gzip command
 */
function getGzipSize(filePath) {
  try {
    const result = execSync(`gzip -c "${filePath}" | wc -c`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return parseInt(result.trim(), 10)
  } catch {
    return 0
  }
}

/**
 * Run wrangler deploy --dry-run to get actual bundle size
 */
function getWranglerBundleSize() {
  try {
    console.error('📦 Running wrangler dry-run to get actual bundle size...\n')
    const result = execSync('npx wrangler deploy --dry-run 2>&1', {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    // Parse output for "Total Upload: X KiB / gzip: Y KiB"
    const match = result.match(
      /Total Upload:\s*([\d.]+)\s*KiB\s*\/\s*gzip:\s*([\d.]+)\s*KiB/i
    )
    if (match) {
      return {
        uncompressedKB: parseFloat(match[1]),
        compressedKB: parseFloat(match[2]),
        raw: result,
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
        raw: result,
      }
    }

    return null
  } catch (error) {
    // Try to extract from error output
    const errorOutput = error.stdout || error.stderr || ''
    const match = errorOutput.match(
      /Total Upload:\s*([\d.]+)\s*KiB\s*\/\s*gzip:\s*([\d.]+)\s*KiB/i
    )
    if (match) {
      return {
        uncompressedKB: parseFloat(match[1]),
        compressedKB: parseFloat(match[2]),
        raw: errorOutput,
      }
    }
    return null
  }
}

/**
 * Check if build exists and is recent (default: 30 minutes)
 */
function isBuildFresh(maxAgeMinutes = 30) {
  const buildDir = path.join(process.cwd(), '.open-next')
  const serverHandler = path.join(buildDir, 'server-functions/default/handler.mjs')

  if (!fs.existsSync(serverHandler)) {
    return { fresh: false, reason: 'Build not found' }
  }

  const stats = fs.statSync(serverHandler)
  const ageMs = Date.now() - stats.mtimeMs
  const ageMinutes = ageMs / (1000 * 60)

  if (ageMinutes > maxAgeMinutes) {
    return {
      fresh: false,
      reason: `Build is ${Math.round(ageMinutes)} minutes old (max: ${maxAgeMinutes})`,
    }
  }

  return { fresh: true, ageMinutes: Math.round(ageMinutes) }
}

/**
 * Run the OpenNext build
 */
function runBuild() {
  console.error('🔨 Building for Cloudflare Workers...\n')
  try {
    execSync('npx opennextjs-cloudflare build', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.error('')
    return true
  } catch (error) {
    console.error('❌ Build failed!')
    return false
  }
}


/**
 * Analyze the bundle and return results
 */
function analyzeBuild(options = {}) {
  const buildDir = path.join(process.cwd(), '.open-next')

  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory .open-next not found!')
    console.error('   Run "npm run preview" or "npx opennextjs-cloudflare build" first.')
    process.exit(1)
  }

  const results = {
    serverHandler: {
      path: '.open-next/server-functions/default/handler.mjs',
      size: 0,
      gzipSize: 0,
    },
    middleware: {
      path: '.open-next/middleware/handler.mjs',
      size: 0,
      gzipSize: 0,
    },
    assets: {
      path: '.open-next/assets',
      size: 0,
    },
    serverFunctions: {
      path: '.open-next/server-functions',
      size: 0,
    },
    total: {
      path: '.open-next',
      size: 0,
    },
    wrangler: null,
    status: 'success',
    statusMessage: 'Bundle size OK',
  }

  // Analyze server handler
  const serverHandlerPath = path.join(
    buildDir,
    'server-functions/default/handler.mjs'
  )
  if (fs.existsSync(serverHandlerPath)) {
    results.serverHandler.size = getFileSize(serverHandlerPath)
    results.serverHandler.gzipSize = getGzipSize(serverHandlerPath)
  }

  // Analyze middleware
  const middlewarePath = path.join(buildDir, 'middleware/handler.mjs')
  if (fs.existsSync(middlewarePath)) {
    results.middleware.size = getFileSize(middlewarePath)
    results.middleware.gzipSize = getGzipSize(middlewarePath)
  }

  // Analyze assets
  const assetsPath = path.join(buildDir, 'assets')
  if (fs.existsSync(assetsPath)) {
    results.assets.size = getDirSize(assetsPath)
  }

  // Analyze server functions directory
  const serverFuncsPath = path.join(buildDir, 'server-functions')
  if (fs.existsSync(serverFuncsPath)) {
    results.serverFunctions.size = getDirSize(serverFuncsPath)
  }

  // Total build size
  results.total.size = getDirSize(buildDir)

  // Get actual wrangler bundle size if requested
  if (options.dryRun) {
    results.wrangler = getWranglerBundleSize()
  }

  // Determine status based on wrangler size or estimated size
  const compressedKB = results.wrangler
    ? results.wrangler.compressedKB
    : results.serverHandler.gzipSize / 1024

  const compressedMB = compressedKB / 1024

  // Calculate percentages for both plans
  const freeUsagePercent = (compressedMB / LIMITS.freeCompressedMB) * 100
  const paidUsagePercent = (compressedMB / LIMITS.paidCompressedMB) * 100

  results.usage = {
    compressedMB,
    freePercent: freeUsagePercent,
    paidPercent: paidUsagePercent,
    exceedsFree: compressedMB > LIMITS.freeCompressedMB,
    exceedsPaid: compressedMB > LIMITS.paidCompressedMB,
  }

  if (compressedMB > LIMITS.paidCompressedMB) {
    results.status = 'error'
    results.statusMessage = `Bundle exceeds paid plan limit (${LIMITS.paidCompressedMB}MB)!`
  } else if (compressedMB > LIMITS.freeCompressedMB) {
    results.status = 'warning'
    results.statusMessage = `Bundle exceeds free plan limit (${LIMITS.freeCompressedMB}MB) - requires paid plan`
  } else if (paidUsagePercent > LIMITS.warnPercentage) {
    results.status = 'info'
    results.statusMessage = 'Bundle size OK but approaching limits'
  }

  return results
}

/**
 * Output results for GitHub Actions
 */
function outputForCI(results) {
  const output = []

  output.push(`server-size=${results.serverHandler.size}`)
  output.push(`server-size-formatted=${formatBytes(results.serverHandler.size)}`)
  output.push(`server-gzip-size=${results.serverHandler.gzipSize}`)
  output.push(`server-gzip-formatted=${formatBytes(results.serverHandler.gzipSize)}`)

  output.push(`middleware-size=${results.middleware.size}`)
  output.push(`middleware-size-formatted=${formatBytes(results.middleware.size)}`)
  output.push(`middleware-gzip-size=${results.middleware.gzipSize}`)
  output.push(`middleware-gzip-formatted=${formatBytes(results.middleware.gzipSize)}`)

  output.push(`assets-size=${results.assets.size}`)
  output.push(`assets-size-formatted=${formatBytes(results.assets.size)}`)

  output.push(`total-size=${results.total.size}`)
  output.push(`total-size-formatted=${formatBytes(results.total.size)}`)

  if (results.wrangler) {
    output.push(`wrangler-size=${Math.round(results.wrangler.uncompressedKB * 1024)}`)
    output.push(`wrangler-size-formatted=${results.wrangler.uncompressedKB.toFixed(2)} KB`)
    output.push(`wrangler-gzip-size=${Math.round(results.wrangler.compressedKB * 1024)}`)
    output.push(`wrangler-gzip-formatted=${results.wrangler.compressedKB.toFixed(2)} KB`)
  }

  if (results.usage) {
    output.push(`free-usage-percent=${results.usage.freePercent.toFixed(1)}`)
    output.push(`paid-usage-percent=${results.usage.paidPercent.toFixed(1)}`)
    output.push(`exceeds-free=${results.usage.exceedsFree}`)
    output.push(`exceeds-paid=${results.usage.exceedsPaid}`)
  }

  output.push(`status=${results.status}`)
  output.push(`status-emoji=${results.status === 'error' ? '❌' : results.status === 'warning' ? '⚠️' : results.status === 'info' ? 'ℹ️' : '✅'}`)
  output.push(`status-message=${results.statusMessage}`)

  // Write to GITHUB_OUTPUT if available
  const githubOutput = process.env.GITHUB_OUTPUT
  if (githubOutput) {
    fs.appendFileSync(githubOutput, output.join('\n') + '\n')
  }

  // Also print to stdout for debugging
  output.forEach(line => console.log(line))
}

/**
 * Output results as Markdown (for PR comments)
 */
function outputForMarkdown(results) {
  const statusEmoji =
    results.status === 'error' ? '❌' : results.status === 'warning' ? '⚠️' : results.status === 'info' ? 'ℹ️' : '✅'

  const wranglerSize = results.wrangler ? `${results.wrangler.uncompressedKB.toFixed(2)} KB` : 'N/A'
  const wranglerGzipSize = results.wrangler ? `${results.wrangler.compressedKB.toFixed(2)} KB` : 'N/A'

  const freeStatus = results.usage?.exceedsFree ? '❌' : '✅'
  const paidStatus = results.usage?.exceedsPaid ? '❌' : '✅'
  const freePercent = results.usage?.freePercent.toFixed(1) ?? 'N/A'
  const paidPercent = results.usage?.paidPercent.toFixed(1) ?? 'N/A'

  let warningText = ''
  if (results.status === 'warning') {
    warningText = '⚠️ Consider optimizing bundle size to stay within comfortable limits.'
  } else if (results.status === 'error') {
    warningText = '❌ **Action required:** Bundle exceeds size limits and will fail deployment.'
  }

  const markdown = `## 📦 Bundle Size Report

${statusEmoji} **Status:** ${results.statusMessage}

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

<details>
<summary>📦 Build Output Details</summary>

| Bundle | Uncompressed | Gzipped |
|--------|--------------|---------|
| Server Handler | ${formatBytes(results.serverHandler.size)} | ${formatBytes(results.serverHandler.gzipSize)} |
| Middleware | ${formatBytes(results.middleware.size)} | ${formatBytes(results.middleware.gzipSize)} |
| Static Assets | ${formatBytes(results.assets.size)} | - |
| **Total Build** | ${formatBytes(results.total.size)} | - |

*Note: Static assets are served via Cloudflare's CDN and don't count against worker limits.*

</details>

---
${warningText}`

  console.log(markdown.trim())
}

/**
 * Output results for terminal (human readable)
 */
function outputForTerminal(results) {
  const statusEmoji =
    results.status === 'error' ? '❌' : results.status === 'warning' ? '⚠️' : results.status === 'info' ? 'ℹ️' : '✅'

  console.log('\n📦 Bundle Size Analysis\n')
  console.log('=' .repeat(60))

  console.log('\n📊 Build Output Sizes:\n')
  console.log(`  Server Handler:     ${formatBytes(results.serverHandler.size)}`)
  console.log(`    └─ gzipped:       ${formatBytes(results.serverHandler.gzipSize)}`)
  console.log(`  Middleware:         ${formatBytes(results.middleware.size)}`)
  console.log(`    └─ gzipped:       ${formatBytes(results.middleware.gzipSize)}`)
  console.log(`  Static Assets:      ${formatBytes(results.assets.size)}`)
  console.log(`  Server Functions:   ${formatBytes(results.serverFunctions.size)}`)
  console.log(`  Total Build:        ${formatBytes(results.total.size)}`)

  if (results.wrangler) {
    console.log('\n🚀 Wrangler Bundle (what Cloudflare sees):\n')
    console.log(`  Total Upload:       ${results.wrangler.uncompressedKB.toFixed(2)} KB`)
    console.log(`  Gzipped:            ${results.wrangler.compressedKB.toFixed(2)} KB`)
    console.log(`                      (${(results.wrangler.compressedKB / 1024).toFixed(2)} MB)`)
  }

  console.log('\n' + '=' .repeat(60))
  console.log(`\n${statusEmoji} Status: ${results.statusMessage}`)

  console.log('\n📋 Cloudflare Workers Limits:\n')
  console.log(`  Plan        Limit     Your Usage`)
  console.log(`  ──────────  ────────  ──────────────────────────────`)

  if (results.usage) {
    const freeBar = createProgressBar(results.usage.freePercent, 20)
    const paidBar = createProgressBar(results.usage.paidPercent, 20)
    const freeStatus = results.usage.exceedsFree ? '❌ EXCEEDS' : '✅'
    const paidStatus = results.usage.exceedsPaid ? '❌ EXCEEDS' : '✅'

    console.log(`  Free        ${LIMITS.freeCompressedMB} MB      ${freeBar} ${results.usage.freePercent.toFixed(1)}% ${freeStatus}`)
    console.log(`  Paid        ${LIMITS.paidCompressedMB} MB     ${paidBar} ${results.usage.paidPercent.toFixed(1)}% ${paidStatus}`)
  } else {
    console.log(`  Free        ${LIMITS.freeCompressedMB} MB`)
    console.log(`  Paid        ${LIMITS.paidCompressedMB} MB`)
  }

  console.log('')
}

/**
 * Create a simple progress bar
 */
function createProgressBar(percent, width) {
  const filled = Math.min(Math.round((percent / 100) * width), width)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  return `[${bar}]`
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2)

  if (args.includes('--help')) {
    console.log(`
Bundle Size Analyzer for Cloudflare Workers

Usage:
  node scripts/analyze-bundle.js [options]

Options:
  --ci          Output in GitHub Actions format
  --dry-run     Run wrangler deploy --dry-run to get actual bundle size
  --json        Output as JSON
  --markdown    Output as Markdown (for PR comments)
  --no-build    Skip automatic build even if stale
  --max-age=N   Max build age in minutes before rebuilding (default: 30)
  --help        Show this help message

By default, the script will automatically rebuild if the existing build
is older than 30 minutes or doesn't exist.

Examples:
  node scripts/analyze-bundle.js                    # Auto-build if needed, full analysis
  node scripts/analyze-bundle.js --no-build         # Skip build, analyze existing
  node scripts/analyze-bundle.js --max-age=60       # Rebuild if older than 60 min
  node scripts/analyze-bundle.js --ci --dry-run     # For GitHub Actions
  node scripts/analyze-bundle.js --markdown         # Markdown output
`)
    process.exit(0)
  }

  // Parse max-age option
  const maxAgeArg = args.find(a => a.startsWith('--max-age='))
  const maxAgeMinutes = maxAgeArg ? parseInt(maxAgeArg.split('=')[1], 10) : 30

  const options = {
    ci: args.includes('--ci'),
    dryRun: args.includes('--dry-run'),
    json: args.includes('--json'),
    markdown: args.includes('--markdown'),
    noBuild: args.includes('--no-build'),
    maxAgeMinutes,
  }

  // Check if we need to build
  if (!options.noBuild && !options.ci) {
    const buildStatus = isBuildFresh(options.maxAgeMinutes)
    if (!buildStatus.fresh) {
      console.error(`⏰ ${buildStatus.reason}`)
      if (!runBuild()) {
        process.exit(1)
      }
    } else {
      console.error(`✅ Using existing build (${buildStatus.ageMinutes} minutes old)\n`)
    }
  }

  // Default to --dry-run for full accuracy unless --no-build or --ci
  if (!options.noBuild && !options.ci && !args.includes('--dry-run')) {
    options.dryRun = true
  }

  const results = analyzeBuild(options)

  if (options.json) {
    console.log(JSON.stringify(results, null, 2))
  } else if (options.markdown) {
    outputForMarkdown(results)
  } else if (options.ci) {
    outputForCI(results)
  } else {
    outputForTerminal(results)
  }

  // Exit with error code if bundle exceeds limit
  if (results.status === 'error') {
    process.exit(1)
  }
}

main()
