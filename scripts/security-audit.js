#!/usr/bin/env node

/**
 * Security audit script for build-time sanitization
 *
 * This script runs the sanitization security tests to ensure that
 * the blog data generation process is properly sanitizing content.
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🔒 Running security audit for build-time sanitization...\n')

try {
  // Run the sanitization-specific tests
  const testCommand =
    'npx jest scripts/__tests__/build-blog-data-sanitization.test.js --verbose'
  console.log('Running sanitization security tests...')
  execSync(testCommand, { stdio: 'inherit', cwd: process.cwd() })

  console.log('\n✅ Sanitization security tests passed!')

  // Run the integration tests
  const integrationTestCommand =
    'npx jest scripts/__tests__/build-blog-data-integration.test.js --verbose'
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

  console.log('\n🚨 Security recommendations:')
  console.log('  • Review the sanitization configuration in build-blog-data.js')
  console.log('  • Ensure sanitize-html is up to date')
  console.log('  • Check for any new XSS vectors in the failing tests')
  console.log('  • Verify that legitimate content is not being over-sanitized')

  process.exit(1)
}
