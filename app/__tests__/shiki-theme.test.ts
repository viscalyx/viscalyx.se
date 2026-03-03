import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('shiki-theme.css', () => {
  const cssContent = readFileSync(
    resolve(__dirname, '../shiki-theme.css'),
    'utf-8',
  )

  it('should not use prefers-color-scheme media query', () => {
    expect(cssContent).not.toContain('prefers-color-scheme')
  })

  it('should use .dark class selector for dark mode', () => {
    expect(cssContent).toMatch(/\.dark\s/)
  })

  it('should apply --shiki-light color by default', () => {
    expect(cssContent).toContain('var(--shiki-light)')
  })

  it('should apply --shiki-dark color in dark mode', () => {
    expect(cssContent).toContain('var(--shiki-dark)')
  })

  it('should target code[data-theme] spans for token colors', () => {
    expect(cssContent).toContain('code[data-theme] span')
  })

  it('should target pre[data-theme] for container colors', () => {
    expect(cssContent).toContain('pre[data-theme]')
  })

  it('should include highlighted line styling', () => {
    expect(cssContent).toContain('data-highlighted-line')
    expect(cssContent).toContain('--color-highlight-line-bg')
  })
})
