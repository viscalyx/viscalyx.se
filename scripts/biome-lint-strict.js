#!/usr/bin/env node

const { spawnSync } = require('node:child_process')

function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx'
}

function runBiomeJsonLint(args) {
  return spawnSync(
    getNpxCommand(),
    ['biome', 'lint', '--reporter=json', '--max-diagnostics=none', ...args],
    { encoding: 'utf8' }
  )
}

function parseBiomeJson(stdout) {
  const jsonStart = stdout.indexOf('{')
  if (jsonStart === -1) {
    throw new Error('Biome JSON output was not found in stdout.')
  }
  return JSON.parse(stdout.slice(jsonStart))
}

function runReadableLint(args) {
  return spawnSync(
    getNpxCommand(),
    ['biome', 'lint', '--error-on-warnings', ...args],
    { stdio: 'inherit' }
  )
}

function main() {
  const args = process.argv.slice(2)
  const jsonRun = runBiomeJsonLint(args)

  if (jsonRun.error) {
    console.error(jsonRun.error.message)
    process.exit(1)
  }

  let result
  try {
    result = parseBiomeJson(jsonRun.stdout)
  } catch (error) {
    if (jsonRun.stdout) process.stdout.write(jsonRun.stdout)
    if (jsonRun.stderr) process.stderr.write(jsonRun.stderr)
    console.error(`Failed to parse Biome JSON output: ${error.message}`)
    process.exit(jsonRun.status ?? 1)
  }

  const errors = result?.summary?.errors ?? 0
  const warnings = result?.summary?.warnings ?? 0
  const infos = result?.summary?.infos ?? 0
  const hasAnyDiagnostics = errors > 0 || warnings > 0 || infos > 0

  if (!hasAnyDiagnostics) {
    process.stdout.write(
      'Checked with strict mode: 0 errors, 0 warnings, 0 infos.\n'
    )
    process.exit(0)
  }

  const readableRun = runReadableLint(args)
  if (readableRun.error) {
    console.error(readableRun.error.message)
    process.exit(1)
  }

  const summaryParts = []
  if (errors > 0) {
    summaryParts.push(`${errors} error${errors === 1 ? '' : 's'}`)
  }
  if (warnings > 0) {
    summaryParts.push(`${warnings} warning${warnings === 1 ? '' : 's'}`)
  }
  if (infos > 0) {
    summaryParts.push(`${infos} info${infos === 1 ? '' : 's'}`)
  }
  console.error(
    `Strict lint failed because Biome reported ${summaryParts.join(', ')}.`
  )

  process.exit(1)
}

main()
