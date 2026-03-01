import { describe, expect, it } from 'vitest'
import { buildLocalizedAlternates } from '@/lib/metadata-utils'

describe('buildLocalizedAlternates', () => {
  it('returns an object with locale keys and full URLs', () => {
    const result = buildLocalizedAlternates('privacy')
    expect(result).toHaveProperty('en')
    expect(result).toHaveProperty('sv')
    expect(result.en).toContain('/en/privacy')
    expect(result.sv).toContain('/sv/privacy')
  })

  it('handles paths with dynamic segments', () => {
    const result = buildLocalizedAlternates('team/john-doe')
    expect(result.en).toContain('/en/team/john-doe')
    expect(result.sv).toContain('/sv/team/john-doe')
  })
})
