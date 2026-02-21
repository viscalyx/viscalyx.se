import { SITE_URL } from '@/lib/constants'
import { describe, expect, it } from 'vitest'
import { metadata } from '../metadata'

describe('app metadata', () => {
  it('contains expected core metadata fields', () => {
    expect(metadata.title.default).toContain('Viscalyx')
    expect(metadata.title.template).toBe('%s | Viscalyx')
    expect(metadata.description).toContain('automation consulting')
    expect(metadata.metadataBase.toString()).toBe(`${SITE_URL}/`)
  })

  it('includes canonical alternates and social metadata', () => {
    expect(metadata.alternates.canonical).toBe('/')
    expect(metadata.alternates.languages.en).toBe('/en')
    expect(metadata.alternates.languages.sv).toBe('/sv')
    expect(metadata.openGraph?.type).toBe('website')
    expect(metadata.twitter?.card).toBe('summary_large_image')
  })
})
