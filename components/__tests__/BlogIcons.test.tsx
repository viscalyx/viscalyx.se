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
      // Check for unique path data that identifies the note icon (circle with 'i')
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      )
    })

    it('renders tip icon correctly', () => {
      render(<AlertIcon label="Tip information" type="tip" />)
      const icon = screen.getByRole('img', { name: /tip information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      // Check for unique path data that identifies the tip icon (lightbulb)
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      )
    })

    it('renders important icon correctly', () => {
      render(<AlertIcon label="Important information" type="important" />)
      const icon = screen.getByRole('img', { name: /important information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      // Check for unique path data that identifies the important icon (speech bubble)
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      )
    })

    it('renders warning icon correctly', () => {
      render(<AlertIcon label="Warning information" type="warning" />)
      const icon = screen.getByRole('img', { name: /warning information/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      // Check for unique path data that identifies the warning icon (triangle with exclamation)
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z',
      )
    })

    it('renders caution icon correctly', () => {
      render(<AlertIcon label="Caution icon" type="caution" />)
      const icon = screen.getByRole('img', { name: /caution icon/i })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('w-5 h-5')
      // Check for unique path data that identifies the caution icon (octagon)
      const paths = icon.querySelectorAll('path')
      expect(paths[0]).toHaveAttribute(
        'd',
        'M8.111 2.889A3 3 0 0110.5 2h3a3 3 0 012.389.889L20.111 7.11A3 3 0 0121 9.5v5a3 3 0 01-.889 2.389L15.889 21.11A3 3 0 0113.5 22h-3a3 3 0 01-2.389-.889L3.889 16.89A3 3 0 013 14.5v-5a3 3 0 01.889-2.389L8.111 2.889z',
      )
      expect(paths[1]).toHaveAttribute('d', 'M12 9v2m0 4h.01')
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
      // Verify it's actually the note icon by checking its unique path
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      )
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

    it('handles case insensitive input for note', () => {
      const testCases = ['NOTE', 'nOtE']
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label="Note information" />)
        expect(
          screen.getByRole('img', { name: /note information/i }),
        ).toBeInTheDocument()
        cleanup()
      })
    })

    it('handles case insensitive input for tip', () => {
      const testCases = ['TIP', 'tIp']
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label="Tip information" />)
        expect(
          screen.getByRole('img', { name: /tip information/i }),
        ).toBeInTheDocument()
        cleanup()
      })
    })

    it('handles case insensitive input for important', () => {
      const testCases = ['Important', 'imPORtant']
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label="Important information" />)
        expect(
          screen.getByRole('img', { name: /important information/i }),
        ).toBeInTheDocument()
        cleanup()
      })
    })

    it('handles case insensitive input for warning', () => {
      const testCases = ['WaRnInG', 'wArNiNg']
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label="Warning information" />)
        expect(
          screen.getByRole('img', { name: /warning information/i }),
        ).toBeInTheDocument()
        cleanup()
      })
    })

    it('handles case insensitive input for caution', () => {
      const testCases = ['CaUtIoN', 'cAuTiOn']
      testCases.forEach(input => {
        const IconComponent = getAlertIcon(input)
        expect(IconComponent).toBeDefined()
        render(<IconComponent label="Caution icon" />)
        expect(
          screen.getByRole('img', { name: /caution icon/i }),
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
      // Verify it's actually the note icon by checking its unique path
      expect(icon.querySelector('path')).toHaveAttribute(
        'd',
        'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      )
    })
  })
})
