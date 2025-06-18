import { render, screen } from '@testing-library/react'
import {
  CheckmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
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
})
