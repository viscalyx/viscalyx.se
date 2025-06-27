#!/usr/bin/env node
/**
 * Script to convert Jest test files to Vitest syntax
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Find all test files
const testFiles = glob.sync('**/*.test.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'out/**'],
})

console.log(`Found ${testFiles.length} test files to convert...`)

testFiles.forEach((filePath) => {
  console.log(`Converting ${filePath}...`)
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Convert Jest imports to Vitest
  if (content.includes("import '@testing-library/jest-dom'")) {
    content = content.replace("import '@testing-library/jest-dom'", '')
  }
  
  // Add vitest import if jest.fn() or jest.mock is used
  if ((content.includes('jest.fn()') || content.includes('jest.mock(')) && !content.includes("import { vi }")) {
    const importMatch = content.match(/^import.*from.*$/m)
    if (importMatch) {
      const firstImportLine = importMatch[0]
      content = content.replace(firstImportLine, `import { vi } from 'vitest'\n${firstImportLine}`)
    } else {
      content = `import { vi } from 'vitest'\n${content}`
    }
  }
  
  // Convert jest.fn() to vi.fn()
  content = content.replace(/jest\.fn\(\)/g, 'vi.fn()')
  
  // Convert jest.mock() to vi.mock()
  content = content.replace(/jest\.mock\(/g, 'vi.mock(')
  
  // Convert jest.Mock type to vi.Mock
  content = content.replace(/jest\.Mock/g, 'MockedFunction')
  
  // Add MockedFunction import if needed
  if (content.includes('MockedFunction') && !content.includes('MockedFunction')) {
    const vitestImportMatch = content.match(/import { (.*) } from 'vitest'/)
    if (vitestImportMatch) {
      const imports = vitestImportMatch[1]
      content = content.replace(
        `import { ${imports} } from 'vitest'`,
        `import { ${imports}, MockedFunction } from 'vitest'`
      )
    }
  }
  
  // Remove duplicate framer-motion mocks (now handled globally)
  const framermotionMockRegex = /\/\/ Mock framer-motion[\s\S]*?^\}\)\s*$/gm
  if (content.match(framermotionMockRegex)) {
    content = content.replace(framermotionMockRegex, '// Mock framer-motion (handled globally in vitest.setup.ts)')
  }
  
  // Remove duplicate next/image mocks (now handled globally)  
  const nextImageMockRegex = /\/\/ Mock next\/image[\s\S]*?^\}\)\s*$/gm
  if (content.match(nextImageMockRegex)) {
    content = content.replace(nextImageMockRegex, '// Mock next/image (handled globally in vitest.setup.ts)')
  }
  
  // Clean up extra newlines
  content = content.replace(/\n\n\n+/g, '\n\n')
  
  fs.writeFileSync(filePath, content)
})

console.log('Conversion complete!')
