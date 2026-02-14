import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import LegalSection, { safeTranslationArray } from '@/components/LegalSection'

describe('LegalSection', () => {
  it('renders title and description', () => {
    render(<LegalSection title="Test Title" description="Test description" />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Test Title' })
    ).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders list items when items are provided', () => {
    render(
      <LegalSection
        title="Title"
        description="Description"
        items={['Item A', 'Item B', 'Item C']}
      />
    )

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
    expect(screen.getByText('Item C')).toBeInTheDocument()
  })

  it('does not render list when items are not provided', () => {
    render(<LegalSection title="Title" description="Description" />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('does not render list when items array is empty', () => {
    render(<LegalSection title="Title" description="Description" items={[]} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('applies mb-6 to description when items are present', () => {
    render(
      <LegalSection title="Title" description="Description" items={['Item']} />
    )

    const description = screen.getByText('Description')
    expect(description).toHaveClass('mb-6')
    expect(description).not.toHaveClass('mb-8')
  })

  it('applies mb-8 to description when no items', () => {
    render(<LegalSection title="Title" description="Description" />)

    const description = screen.getByText('Description')
    expect(description).toHaveClass('mb-8')
    expect(description).not.toHaveClass('mb-6')
  })
})

describe('safeTranslationArray', () => {
  it('returns the array when input is an array', () => {
    expect(safeTranslationArray(['a', 'b'])).toEqual(['a', 'b'])
  })

  it('returns empty array when input is a string', () => {
    expect(safeTranslationArray('not an array')).toEqual([])
  })

  it('returns empty array when input is undefined', () => {
    expect(safeTranslationArray(undefined)).toEqual([])
  })

  it('returns empty array when input is null', () => {
    expect(safeTranslationArray(null)).toEqual([])
  })

  it('returns empty array when input is an object', () => {
    expect(safeTranslationArray({ key: 'value' })).toEqual([])
  })

  it('filters out non-string elements from arrays', () => {
    expect(safeTranslationArray(['a', 1, null, 'b', {}, undefined])).toEqual([
      'a',
      'b',
    ])
  })

  it('returns empty array when array has no string elements', () => {
    expect(safeTranslationArray([1, null, {}])).toEqual([])
  })
})
