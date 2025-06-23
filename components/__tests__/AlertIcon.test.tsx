import { render } from '@testing-library/react'
import { AlertIcon, getAlertIcon } from '../BlogIcons'

describe('AlertIcon', () => {
  it('renders note icon by default', () => {
    const { container } = render(<AlertIcon type="note" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })

  it('renders tip icon correctly', () => {
    const { container } = render(<AlertIcon type="tip" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })

  it('renders important icon correctly', () => {
    const { container } = render(<AlertIcon type="important" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })

  it('renders warning icon correctly', () => {
    const { container } = render(<AlertIcon type="warning" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })

  it('renders caution icon correctly', () => {
    const { container } = render(<AlertIcon type="caution" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })

  it('applies custom className', () => {
    const { container } = render(
      <AlertIcon type="note" className="custom-class" />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('falls back to note icon for invalid type', () => {
    // @ts-expect-error - Testing invalid type
    const { container } = render(<AlertIcon type="invalid" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-5 h-5')
  })
})

describe('getAlertIcon', () => {
  it('returns correct icon component for each type', () => {
    expect(getAlertIcon('note')).toBeDefined()
    expect(getAlertIcon('tip')).toBeDefined()
    expect(getAlertIcon('important')).toBeDefined()
    expect(getAlertIcon('warning')).toBeDefined()
    expect(getAlertIcon('caution')).toBeDefined()
  })

  it('handles case insensitive input', () => {
    expect(getAlertIcon('NOTE')).toBeDefined()
    expect(getAlertIcon('TIP')).toBeDefined()
    expect(getAlertIcon('Important')).toBeDefined()
  })

  it('returns note icon for invalid type', () => {
    const IconComponent = getAlertIcon('invalid')
    expect(IconComponent).toBeDefined()

    const { container } = render(<IconComponent />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
