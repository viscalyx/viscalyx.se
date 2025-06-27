#!/usr/bin/env node
/**
 * Improved script to convert Jest test files to Vitest syntax
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
  
  // Remove Jest DOM import
  content = content.replace("import '@testing-library/jest-dom'\n", '')
  
  // Add vitest import if jest.fn() or jest.mock is used, but only if not already present
  if ((content.includes('jest.fn()') || content.includes('jest.mock(')) && !content.includes("import { vi }")) {
    // Find the first import line and add vi import after it
    const lines = content.split('\n')
    let insertIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1
        break
      }
    }
    
    lines.splice(insertIndex, 0, "import { vi } from 'vitest'")
    content = lines.join('\n')
  }
  
  // Convert jest.fn() to vi.fn()
  content = content.replace(/jest\.fn\(\)/g, 'vi.fn()')
  
  // Convert jest.mock() to vi.mock()
  content = content.replace(/jest\.mock\(/g, 'vi.mock(')
  
  // Convert jest timer methods
  content = content.replace(/jest\.useFakeTimers\(\{[^}]*\}\)/g, 'vi.useFakeTimers()')
  content = content.replace(/jest\.useFakeTimers\(\)/g, 'vi.useFakeTimers()')
  content = content.replace(/jest\.setSystemTime\(/g, 'vi.setSystemTime(')
  content = content.replace(/jest\.useRealTimers\(\)/g, 'vi.useRealTimers()')
  
  // Convert jest.Mock type to MockedFunction and add import if needed
  if (content.includes('jest.Mock')) {
    content = content.replace(/jest\.Mock/g, 'MockedFunction')
    
    // Add MockedFunction import if vi import exists
    if (content.includes("import { vi }")) {
      content = content.replace(
        "import { vi } from 'vitest'",
        "import { vi, MockedFunction } from 'vitest'"
      )
    }
  }
  
  // Only remove specific framer-motion mocks that are exactly the same as global ones
  const standaloneFramerMotionMock = /^jest\.mock\('framer-motion', \(\) => \{[\s\S]*?^\}\)$/gm
  if (content.match(standaloneFramerMotionMock)) {
    content = content.replace(standaloneFramerMotionMock, '// Mock framer-motion (handled globally in vitest.setup.ts)')
  }
  
  // Clean up multiple newlines
  content = content.replace(/\n\n\n+/g, '\n\n')
  content = content.replace(/\n+$/, '\n') // Ensure single newline at end
  
  fs.writeFileSync(filePath, content)
})

console.log('Conversion complete!')
