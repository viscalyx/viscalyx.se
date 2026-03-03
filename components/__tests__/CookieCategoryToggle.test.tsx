import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CookieCategoryToggle from '@/components/CookieCategoryToggle'

describe('CookieCategoryToggle', () => {
  const defaultProps = {
    category: 'analytics' as const,
    checked: false,
    categoryName: 'Analytics Cookies',
    requiredLabel: 'Required',
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders an unchecked toggle', () => {
    render(<CookieCategoryToggle {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('renders a checked toggle', () => {
    render(<CookieCategoryToggle {...defaultProps} checked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('calls onChange when toggled', () => {
    const onChange = vi.fn()
    render(<CookieCategoryToggle {...defaultProps} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith('analytics')
  })

  it('disables toggle for strictly-necessary category', () => {
    render(
      <CookieCategoryToggle
        {...defaultProps}
        category="strictly-necessary"
        categoryName="Strictly Necessary"
        checked={true}
      />,
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('enables toggle for non-essential categories', () => {
    render(<CookieCategoryToggle {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeDisabled()
  })

  it('sets aria-describedby with category id', () => {
    render(<CookieCategoryToggle {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      'analytics-description',
    )
  })

  it('sets aria-label with category name', () => {
    render(<CookieCategoryToggle {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Analytics Cookies')
  })

  it('includes required label in aria-label for strictly-necessary', () => {
    render(
      <CookieCategoryToggle
        {...defaultProps}
        category="strictly-necessary"
        categoryName="Strictly Necessary"
        checked={true}
      />,
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute(
      'aria-label',
      'Strictly Necessary Required',
    )
  })

  it('omits required suffix in aria-label when requiredLabel is not provided', () => {
    render(
      <CookieCategoryToggle
        {...defaultProps}
        category="strictly-necessary"
        categoryName="Strictly Necessary"
        checked={true}
        requiredLabel={undefined}
      />,
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Strictly Necessary')
  })

  it('has consistent w-11 h-6 toggle track sizing', () => {
    const { container } = render(
      <CookieCategoryToggle {...defaultProps} checked={true} />,
    )
    const track = container.querySelector('[role="presentation"]')
    expect(track).toBeInTheDocument()
    expect(track?.className).toContain('w-11')
    expect(track?.className).toContain('h-6')
  })
})
