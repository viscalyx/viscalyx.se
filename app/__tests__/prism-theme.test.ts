import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'

describe('prism-theme.css', () => {
  const cssContent = readFileSync(
    resolve(__dirname, '../prism-theme.css'),
    'utf-8'
  )

  const coreTokenVars = [
    '--color-token-comment',
    '--color-token-punctuation',
    '--color-token-property',
    '--color-token-selector',
    '--color-token-operator',
    '--color-token-keyword',
    '--color-token-function',
    '--color-token-variable',
  ]

  const powershellTokenVars = [
    '--color-token-powershell-variable',
    '--color-token-powershell-cmdlet',
    '--color-token-powershell-parameter',
  ]

  const allTokenVars = [...coreTokenVars, ...powershellTokenVars]

  it('should not use prefers-color-scheme media query', () => {
    expect(cssContent).not.toContain('prefers-color-scheme')
  })

  it('should use .dark class selector for dark mode variables', () => {
    expect(cssContent).toMatch(/\.dark\s*\{/)
  })

  it('should define all token variables in :root (light theme)', () => {
    // Extract :root block content
    const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/)
    expect(rootMatch).not.toBeNull()
    const rootBlock = rootMatch![1]

    for (const varName of allTokenVars) {
      expect(rootBlock).toContain(varName)
    }
  })

  it('should define all token variables in .dark (dark theme)', () => {
    // Extract .dark block content
    const darkMatch = cssContent.match(/\.dark\s*\{([^}]+)\}/)
    expect(darkMatch).not.toBeNull()
    const darkBlock = darkMatch![1]

    for (const varName of allTokenVars) {
      expect(darkBlock).toContain(varName)
    }
  })

  it('should have light theme token selectors', () => {
    expect(cssContent).toContain('.token.comment')
    expect(cssContent).toContain('.token.keyword')
    expect(cssContent).toContain('.token.function')
  })

  it('should have dark theme token selectors using .dark class', () => {
    expect(cssContent).toContain('.dark .token.comment')
    expect(cssContent).toContain('.dark .token.keyword')
    expect(cssContent).toContain('.dark .token.function')
  })
})
