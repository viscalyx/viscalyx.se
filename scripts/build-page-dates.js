#!/usr/bin/env node

const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

/**
 * Get the last modified date of multiple files from Git history
 * @param {string[]} filePaths - Array of file paths relative to the repository root
 * @returns {string} - ISO date string of the most recently modified file or fallback date
 */
function getFilesLastModified(filePaths) {
  let latestDate = null

  for (const filePath of filePaths) {
    try {
      // Get the last commit date for the file
      const command = `git log --follow --format="%ci" -- "${filePath}" | head -1`
      const result = execSync(command, {
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
      }).trim()

      if (result) {
        const fileDate = new Date(result)
        if (!latestDate || fileDate > latestDate) {
          latestDate = fileDate
        }
      }
    } catch (error) {
      console.warn(
        `Could not get last modified date for ${filePath}:`,
        error.message
      )
    }
  }

  if (latestDate) {
    return latestDate.toISOString()
  }

  // Fallback to a reasonable default date for static pages
  return new Date('2024-01-01T00:00:00.000Z').toISOString()
}

/**
 * Get the last modified date of a file from Git history
 * @param {string} filePath - The file path relative to the repository root
 * @returns {string} - ISO date string or fallback date
 */
function getFileLastModified(filePath) {
  return getFilesLastModified([filePath])
}

/**
 * Build page dates data from Git history
 */
function buildPageDates() {
  const pageDates = {
    home: getFileLastModified('app/[locale]/page.tsx'),
    blog: getFileLastModified('app/[locale]/blog/page.tsx'),
    // For privacy and terms, check both page files and their specific translation files
    privacy: getFilesLastModified([
      'app/[locale]/privacy/page.tsx',
      'messages/privacy.en.json',
      'messages/privacy.sv.json',
    ]),
    terms: getFilesLastModified([
      'app/[locale]/terms/page.tsx',
      'messages/terms.en.json',
      'messages/terms.sv.json',
    ]),
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
