import { cleanup, render, screen } from '@testing-library/react'
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
      render(<CopyIcon label="Copy to clipboard" />)
      const icon = screen.getByRole('img', { name: /copy to clipboard/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<CopyIcon className="custom-class" label="Copy to clipboard" />)
      const icon = screen.getByRole('img', { name: /copy to clipboard/i })
      expect(icon).toHaveClass('custom-class')
    })

    it('is decorative when no label is provided', () => {
      const { container } = render(<CopyIcon />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      expect(icon).not.toHaveAttribute('aria-label')
    })
  })

  describe('CheckmarkIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<CheckmarkIcon label="Copied to clipboard" />)
      const icon = screen.getByRole('img', { name: /copied to clipboard/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'currentColor')
      expect(icon).not.toHaveAttribute('stroke')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(
        <CheckmarkIcon className="another-class" label="Copied to clipboard" />,
      )
      const icon = screen.getByRole('img', { name: /copied to clipboard/i })
      expect(icon).toHaveClass('another-class')
    })
  })

  describe('ChevronUpIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<ChevronUpIcon label="Scroll up" />)
      const icon = screen.getByRole('img', { name: /scroll up/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<ChevronUpIcon className="up-class" label="Scroll up" />)
      const icon = screen.getByRole('img', { name: /scroll up/i })
      expect(icon).toHaveClass('up-class')
    })
  })

  describe('ChevronDownIcon', () => {
    it('renders with correct attributes and default className', () => {
      render(<ChevronDownIcon label="Scroll down" />)
      const icon = screen.getByRole('img', { name: /scroll down/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24')
      expect(icon).toHaveAttribute('fill', 'none')
      expect(icon).toHaveAttribute('stroke', 'currentColor')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('accepts a custom className', () => {
      render(<ChevronDownIcon className="down-class" label="Scroll down" />)
      const icon = screen.getByRole('img', { name: /scroll down/i })
      expect(icon).toHaveClass('down-class')
    })
  })

  describe('AlertIcon', () => {
    it('renders note icon by default', () => {
      render(<AlertIcon label="Note information" type="note" />)
      const icon = screen.getByRole('img', { name: /note information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      expect(icon).toHaveAttribute('data-icon-type', 'note')
    })

    it('renders tip icon correctly', () => {
      render(<AlertIcon label="Tip information" type="tip" />)
      const icon = screen.getByRole('img', { name: /tip information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      expect(icon).toHaveAttribute('data-icon-type', 'tip')
    })

    it('renders important icon correctly', () => {
      render(<AlertIcon label="Important information" type="important" />)
      const icon = screen.getByRole('img', { name: /important information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      expect(icon).toHaveAttribute('data-icon-type', 'important')
    })

    it('renders warning icon correctly', () => {
      render(<AlertIcon label="Warning information" type="warning" />)
      const icon = screen.getByRole('img', { name: /warning information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      expect(icon).toHaveAttribute('data-icon-type', 'warning')
    })

    it('renders caution icon correctly', () => {
      render(<AlertIcon label="Caution icon" type="caution" />)
      const icon = screen.getByRole('img', { name: /caution icon/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      expect(icon).toHaveAttribute('data-icon-type', 'caution')
    })

    it('applies custom className', () => {
      const { container } = render(
        <AlertIcon
          className="custom-class"
          label="Note information"
          type="note"
        />,
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    it('falls back to note icon for invalid type', () => {
      // @ts-expect-error - Testing invalid type
      render(<AlertIcon label="Note information" type="invalid" />)
      const icon = screen.getByRole('img', { name: /note information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      // Verify it's actually the note icon by checking its data attribute
      expect(icon).toHaveAttribute('data-icon-type', 'note')
    })
  })

  describe('getAlertIcon', () => {
    it('returns note icon component', () => {
      const NoteComponent = getAlertIcon('note')
      expect(NoteComponent).toBeDefined()
      render(<NoteComponent label="Note information" />)
      expect(
        screen.getByRole('img', { name: /note information/i }),
      ).toBeInTheDocument()
    })

    it('returns tip icon component', () => {
      const TipComponent = getAlertIcon('tip')
      expect(TipComponent).toBeDefined()
      render(<TipComponent label="Tip information" />)
      expect(
        screen.getByRole('img', { name: /tip information/i }),
      ).toBeInTheDocument()
    })

    it('returns important icon component', () => {
      const ImportantComponent = getAlertIcon('important')
      expect(ImportantComponent).toBeDefined()
      render(<ImportantComponent label="Important information" />)
      expect(
        screen.getByRole('img', { name: /important information/i }),
      ).toBeInTheDocument()
    })

    it('returns warning icon component', () => {
      const WarningComponent = getAlertIcon('warning')
      expect(WarningComponent).toBeDefined()
      render(<WarningComponent label="Warning information" />)
      expect(
        screen.getByRole('img', { name: /warning information/i }),
      ).toBeInTheDocument()
    })

    it('returns caution icon component', () => {
      const CautionComponent = getAlertIcon('caution')
      expect(CautionComponent).toBeDefined()
      render(<CautionComponent label="Caution icon" />)
      expect(
        screen.getByRole('img', { name: /caution icon/i }),
      ).toBeInTheDocument()
    })

    it.each<{
      typeName: string
      testCases: string[]
      renderedLabel: string
    }>([
      {
        typeName: 'note',
        testCases: ['NOTE', 'nOtE'],
        renderedLabel: 'Note information',
      },
      {
        typeName: 'tip',
        testCases: ['TIP', 'tIp'],
        renderedLabel: 'Tip information',
      },
      {
        typeName: 'important',
        testCases: ['Important', 'imPORtant'],
        renderedLabel: 'Important information',
      },
      {
        typeName: 'warning',
        testCases: ['WaRnInG', 'wArNiNg'],
        renderedLabel: 'Warning information',
      },
      {
        typeName: 'caution',
        testCases: ['CaUtIoN', 'cAuTiOn'],
        renderedLabel: 'Caution icon',
      },
    ])('handles case insensitive input for $typeName', ({
      testCases,
      renderedLabel,
    }) => {
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label={renderedLabel} />)
        expect(
          screen.getByRole('img', {
            name: new RegExp(renderedLabel, 'i'),
          }),
        ).toBeInTheDocument()
        cleanup()
      })
    })

    it('returns note icon for invalid type', () => {
      const IconComponent = getAlertIcon('invalid')
      expect(IconComponent).toBeDefined()

      render(<IconComponent label="Note information" />)
      const icon = screen.getByRole('img', { name: /note information/i })
      expect(icon).toBeInTheDocument()
      // Verify it's actually the note icon by checking its data attribute
      expect(icon).toHaveAttribute('data-icon-type', 'note')
    })
  })
})
