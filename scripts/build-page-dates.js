#!/usr/bin/env node

const { promisify } = require('node:util')
const { exec } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const execAsync = promisify(exec)

/**
 * Get the last modified date of multiple files from Git history
 * @param {string[]} filePaths - Array of file paths relative to the repository root
 * @returns {Promise<string>} - ISO date string of the most recently modified file or fallback date
 */
async function getFilesLastModified(filePaths) {
  // Execute git log commands in parallel for all files
  const gitCommands = filePaths.map(async filePath => {
    try {
      const command = `git log --follow --format="%ci" -- "${filePath}" | head -1`
      const { stdout } = await execAsync(command, {
        encoding: 'utf8',
        cwd: process.cwd(),
      })

      const result = stdout.trim()
      if (result) {
        return new Date(result)
      }
      return null
    } catch (error) {
      console.warn(
        `Could not get last modified date for ${filePath}:`,
        error.message
      )
      return null
    }
  })

  // Wait for all commands to complete
  const dates = await Promise.all(gitCommands)

  // Find the latest date from all files
  const validDates = dates.filter(date => date !== null)
  if (validDates.length > 0) {
    const latestDate = validDates.reduce((latest, current) =>
      current > latest ? current : latest
    )
    return latestDate.toISOString()
  }

  // Fallback to a reasonable default date for static pages
  return new Date('2024-01-01T00:00:00.000Z').toISOString()
}

/**
 * Get the last modified date of a file from Git history
 * @param {string} filePath - The file path relative to the repository root
 * @returns {Promise<string>} - ISO date string or fallback date
 */
async function getFileLastModified(filePath) {
  return await getFilesLastModified([filePath])
}

/**
 * Get all markdown files in the blog content directory
 * @returns {string[]} - Array of file paths relative to repository root
 */
function getBlogContentFiles() {
  const blogDir = path.join(process.cwd(), 'content/blog')
  try {
    const files = fs.readdirSync(blogDir)
    return files
      .filter(file => file.endsWith('.md') && file !== 'template.md')
      .map(file => `content/blog/${file}`)
  } catch (error) {
    console.warn('Could not read blog content directory:', error.message)
    return []
  }
}

/**
 * Build page dates data from Git history
 */
async function buildPageDates() {
  // Get all blog content files
  const blogContentFiles = getBlogContentFiles()

  const pageDates = {
    home: await getFileLastModified('app/[locale]/page.tsx'),
    // Blog page should track both the page component and all blog content
    blog: await getFilesLastModified([
      'app/[locale]/blog/page.tsx',
      ...blogContentFiles,
    ]),
    // For privacy and terms, check both page files and their specific translation files
    privacy: await getFilesLastModified([
      'app/[locale]/privacy/page.tsx',
      'messages/privacy.en.json',
      'messages/privacy.sv.json',
    ]),
    terms: await getFilesLastModified([
      'app/[locale]/terms/page.tsx',
      'messages/terms.en.json',
      'messages/terms.sv.json',
    ]),
    cookies: await getFilesLastModified([
      'app/[locale]/cookies/page.tsx',
      'messages/cookies.en.json',
      'messages/cookies.sv.json',
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
buildPageDates().catch(error => {
  console.error('❌ Failed to build page dates:', error)
  process.exit(1)
})
