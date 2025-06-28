#!/usr/bin/env node

/**
 * Security audit script for build-time sanitization
 *
 * This script runs the sanitization security tests to ensure that
 * the blog data generation process is properly sanitizing content.
 */

const { execSync } = require('node:child_process')
const path = require('node:path')

console.log('🔒 Running security audit for build-time sanitization...\n')

try {
  // Run the sanitization-specific tests
  const testCommand =
    'npx vitest run scripts/__tests__/build-blog-data-sanitization.test.mjs --reporter=verbose'
  console.log('Running sanitization security tests...')
  execSync(testCommand, { stdio: 'inherit', cwd: process.cwd() })

  console.log('\n✅ Sanitization security tests passed!')

  // Run the integration tests
  const integrationTestCommand =
    'npx vitest run scripts/__tests__/build-blog-data-integration.test.js --reporter=verbose'
  console.log('\nRunning integration security tests...')
  execSync(integrationTestCommand, { stdio: 'inherit', cwd: process.cwd() })

  console.log('\n✅ Integration security tests passed!')
  console.log('\n🎉 Security audit completed successfully!')
  console.log('\n📊 Security audit summary:')
  console.log('  ✓ XSS prevention tests')
  console.log('  ✓ Content sanitization tests')
  console.log('  ✓ Legitimate content preservation tests')
  console.log('  ✓ Integration tests with actual build process')
  console.log('  ✓ Reading time calculation security tests')
} catch (error) {
  console.error('\n❌ Security audit failed!')
  console.error('\nError details:')
  console.error(error.message)

  // Analyze error type and provide specific guidance
  const errorMessage = error.message.toLowerCase()
  const errorOutput = error.stdout ? error.stdout.toString() : ''
  const combinedError = `${errorMessage} ${errorOutput}`.toLowerCase()

  console.log('\n🚨 Specific troubleshooting guidance:')

  if (
    combinedError.includes('command not found') ||
    combinedError.includes('npx')
  ) {
    console.log('  📦 Dependency Issue:')
    console.log(
      '    • Run "npm install" to ensure all dependencies are installed'
    )
    console.log('    • Verify Vitest is properly installed in package.json')
    console.log('    • Check if npx is available in your PATH')
  } else if (combinedError.includes('test') && combinedError.includes('fail')) {
    console.log('  🧪 Test Failure Analysis:')
    if (combinedError.includes('sanitization')) {
      console.log(
        '    • XSS prevention tests failed - review sanitize-html configuration'
      )
      console.log(
        '    • Check if new malicious patterns need to be added to tests'
      )
      console.log('    • Verify sanitization rules in build-blog-data.js')
    } else if (combinedError.includes('integration')) {
      console.log(
        '    • Integration tests failed - check build process compatibility'
      )
      console.log('    • Verify blog content files are accessible and valid')
      console.log('    • Review file system permissions for content directory')
    } else {
      console.log(
        '    • Review test output above for specific assertion failures'
      )
      console.log('    • Check if test data or expectations need updating')
    }
  } else if (
    combinedError.includes('enoent') ||
    combinedError.includes('no such file')
  ) {
    console.log('  📁 File System Issue:')
    console.log(
      '    • Missing test files - ensure test directory structure is correct'
    )
    console.log('    • Check if build-blog-data-sanitization.test.js exists')
    console.log('    • Check if build-blog-data-integration.test.js exists')
    console.log('    • Verify content/blog directory exists with test files')
  } else if (
    combinedError.includes('permission') ||
    combinedError.includes('eacces')
  ) {
    console.log('  🔒 Permission Issue:')
    console.log('    • Check file permissions for test files and directories')
    console.log('    • Ensure current user has read/execute permissions')
    console.log('    • Consider running with appropriate permissions')
  } else if (combinedError.includes('timeout')) {
    console.log('  ⏱️ Timeout Issue:')
    console.log('    • Tests are taking too long - check for infinite loops')
    console.log('    • Consider increasing Vitest timeout configuration')
    console.log('    • Review performance of sanitization operations')
  } else if (
    combinedError.includes('memory') ||
    combinedError.includes('heap')
  ) {
    console.log('  💾 Memory Issue:')
    console.log('    • Increase Node.js memory limit with --max-old-space-size')
    console.log('    • Check for memory leaks in sanitization process')
    console.log('    • Review size of test data files')
  } else {
    console.log('  🔍 General Recommendations:')
    console.log(
      '    • Review the sanitization configuration in build-blog-data.js'
    )
    console.log('    • Ensure sanitize-html is up to date')
    console.log('    • Check for any new XSS vectors in the failing tests')
    console.log(
      '    • Verify that legitimate content is not being over-sanitized'
    )
  }

  console.log('\n📋 Next steps:')
  console.log('  1. Address the specific issue identified above')
  console.log('  2. Re-run the security audit: npm run security-audit')
  console.log('  3. If issues persist, check the full error output above')
  console.log('  4. Consider running individual test files for debugging')

  process.exit(1)
}
