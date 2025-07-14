import { render, screen } from '@testing-library/react'
import {
  AlertIcon,
  CheckmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  getAlertIcon,
} from '../BlogIcons'

describe('BlogIcons', () => {
  describe('CopyIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<CopyIcon />)
      const icon = screen.getByRole('img', { name: /copy to clipboard/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<CopyIcon className="custom-class" />)
      const icon = screen.getByRole('img', { name: /copy to clipboard/i })
      expect(icon).toHaveClass('custom-class')
    })
  })

  describe('CheckmarkIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<CheckmarkIcon />)
      const icon = screen.getByRole('img', { name: /copied to clipboard/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'currentColor')
      expect(icon).not.toHaveAttribute('stroke')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<CheckmarkIcon className="another-class" />)
      const icon = screen.getByRole('img', { name: /copied to clipboard/i })
      expect(icon).toHaveClass('another-class')
    })
  })

  describe('ChevronUpIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<ChevronUpIcon />)
      const icon = screen.getByRole('img', { name: /scroll up/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<ChevronUpIcon className="up-class" />)
      const icon = screen.getByRole('img', { name: /scroll up/i })
      expect(icon).toHaveClass('up-class')
    })
  })

  describe('ChevronDownIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<ChevronDownIcon />)
      const icon = screen.getByRole('img', { name: /scroll down/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<ChevronDownIcon className="down-class" />)
      const icon = screen.getByRole('img', { name: /scroll down/i })
      expect(icon).toHaveClass('down-class')
    })
  })

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
      expect(getAlertIcon('nOtE')).toBeDefined()
      expect(getAlertIcon('tIp')).toBeDefined()
      expect(getAlertIcon('imPORtant')).toBeDefined()
      expect(getAlertIcon('WaRnInG')).toBeDefined()
      expect(getAlertIcon('CaUtIoN')).toBeDefined()
      expect(getAlertIcon('wArNiNg')).toBeDefined()
      expect(getAlertIcon('cAuTiOn')).toBeDefined()
    })

    it('returns note icon for invalid type', () => {
      const IconComponent = getAlertIcon('invalid')
      expect(IconComponent).toBeDefined()

      const { container } = render(<IconComponent />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })
})
