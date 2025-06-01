#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * Get the last modified date of a file from Git history
 * @param {string} filePath - The file path relative to the repository root
 * @returns {string} - ISO date string or fallback date
 */
function getFileLastModified(filePath) {
  try {
    // Get the last commit date for the file
    const command = `git log --follow --format="%ci" -- "${filePath}" | head -1`
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
    }).trim()

    if (result) {
      return new Date(result).toISOString()
    }
  } catch (error) {
    console.warn(
      `Could not get last modified date for ${filePath}:`,
      error.message
    )
  }

  // Fallback to a reasonable default date for static pages
  return new Date('2024-01-01T00:00:00.000Z').toISOString()
}

/**
 * Build page dates data from Git history
 */
function buildPageDates() {
  const pageDates = {
    home: getFileLastModified('app/[locale]/page.tsx'),
    blog: getFileLastModified('app/[locale]/blog/page.tsx'),
    caseStudies: getFileLastModified('app/[locale]/case-studies/page.tsx'),
    privacy: getFileLastModified('app/[locale]/privacy/page.tsx'),
    terms: getFileLastModified('app/[locale]/terms/page.tsx'),
  }

  // Write the data to JSON file
  const outputPath = path.join(__dirname, '../lib/page-dates.json')
  fs.writeFileSync(outputPath, JSON.stringify(pageDates, null, 2))

  console.log('✅ Page dates built successfully!')
  console.log('📄 Output:', outputPath)
  console.log('📅 Dates generated:')
  Object.entries(pageDates).forEach(([page, date]) => {
    console.log(`   ${page}: ${new Date(date).toLocaleDateString()}`)
  })
}

// Run the build
buildPageDates()
