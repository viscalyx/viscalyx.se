import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AnimationsShowcase from '../brandprofile/AnimationsShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'fadeIn.title': 'Fade In Animation',
      'fadeIn.description': 'Smooth opacity transition for content reveals',
      'fadeIn.content': 'This element fades in smoothly',
      'slideUp.title': 'Slide Up Animation',
      'slideUp.description': 'Content slides up with fade in effect',
      'slideUp.content': 'This element slides up from below',
      'hoverInteractions.title': 'Hover Interactions',
      'hoverInteractions.description': 'Interactive elements with hover states',
      'hoverInteractions.scaleHover': 'Hover to scale',
      'hoverInteractions.rotateHover': 'Hover to rotate',
      'hoverInteractions.liftHover': 'Hover to lift',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
const mockMotionDiv = vi.fn()
const mockMotionButton = vi.fn()
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => {
      mockMotionDiv(props)
      const {
        children,
        whileHover,
        initial,
        animate,
        transition,
        ...restProps
      } = props
      return <div {...restProps}>{children}</div>
    },
    button: (props: any) => {
      mockMotionButton(props)
      const {
        children,
        whileHover,
        whileFocus,
        initial,
        animate,
        transition,
        ...restProps
      } = props
      return <button {...restProps}>{children}</button>
    },
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Circle: ({ className }: any) => (
    <span className={className} data-testid="circle" />
  ),
  Sparkles: ({ className }: any) => (
    <span className={className} data-testid="sparkles" />
  ),
  Square: ({ className }: any) => (
    <span className={className} data-testid="square" />
  ),
}))

describe('AnimationsShowcase', () => {
  beforeEach(() => {
    mockMotionDiv.mockClear()
    mockMotionButton.mockClear()
  })

  it('renders fade in animation section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Fade In Animation')).toBeInTheDocument()
    expect(
      screen.getByText('This element fades in smoothly')
    ).toBeInTheDocument()
  })

  it('renders slide up animation section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Slide Up Animation')).toBeInTheDocument()
    expect(
      screen.getByText('This element slides up from below')
    ).toBeInTheDocument()
  })

  it('renders hover interactions section', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByText('Hover Interactions')).toBeInTheDocument()
    expect(screen.getByText('Hover to scale')).toBeInTheDocument()
    expect(screen.getByText('Hover to rotate')).toBeInTheDocument()
    expect(screen.getByText('Hover to lift')).toBeInTheDocument()
  })

  it('renders hover interaction icons', () => {
    render(<AnimationsShowcase />)
    expect(screen.getByTestId('sparkles')).toBeInTheDocument()
    expect(screen.getByTestId('circle')).toBeInTheDocument()
    expect(screen.getByTestId('square')).toBeInTheDocument()
  })

  it('applies correct motion props for fade in animation', () => {
    render(<AnimationsShowcase />)

    // Check that the fade in animation has correct props
    const fadeInCall = mockMotionDiv.mock.calls.find(
      call =>
        call[0].initial &&
        call[0].initial.opacity === 0 &&
        call[0].animate &&
        call[0].animate.opacity === 1
    )

    expect(fadeInCall).toBeTruthy()
    expect(fadeInCall?.[0]?.transition?.duration).toBe(0.5)
  })

  it('applies correct motion props for slide up animation', () => {
    render(<AnimationsShowcase />)

    // Check that the slide up animation has correct props
    const slideUpCall = mockMotionDiv.mock.calls.find(
      call =>
        call[0].initial &&
        call[0].initial.opacity === 0 &&
        call[0].initial.y === 20 &&
        call[0].animate &&
        call[0].animate.opacity === 1 &&
        call[0].animate.y === 0
    )

    expect(slideUpCall).toBeTruthy()
    expect(slideUpCall?.[0]?.transition?.duration).toBe(0.5)
    expect(slideUpCall?.[0]?.transition?.ease).toBe('easeOut')
  })

  it('applies correct motion props for hover interactions', () => {
    render(<AnimationsShowcase />)

    // Check scale hover animation
    const scaleHoverCall = mockMotionButton.mock.calls.find(
      call => call[0].whileHover && call[0].whileHover.scale === 1.05
    )
    expect(scaleHoverCall).toBeTruthy()

    // Check rotate hover animation
    const rotateHoverCall = mockMotionButton.mock.calls.find(
      call => call[0].whileHover && call[0].whileHover.rotate === 5
    )
    expect(rotateHoverCall).toBeTruthy()

    // Check lift hover animation
    const liftHoverCall = mockMotionButton.mock.calls.find(
      call => call[0].whileHover && call[0].whileHover.y === -5
    )
    expect(liftHoverCall).toBeTruthy()
  })

  describe('hover interactions', () => {
    it('handles hover events on scale interaction element', () => {
      render(<AnimationsShowcase />)

      // Find the scale hover element by its text content
      const scaleElement = screen.getByText('Hover to scale').closest('button')
      expect(scaleElement).toBeInTheDocument()

      // Test hover events with explicit null check
      if (scaleElement) {
        fireEvent.mouseEnter(scaleElement)
        fireEvent.mouseLeave(scaleElement)
      } else {
        throw new Error('Scale element not found')
      }

      // The element should remain accessible after hover events
      expect(scaleElement).toBeInTheDocument()
    })

    it('handles hover events on rotate interaction element', () => {
      render(<AnimationsShowcase />)

      // Find the rotate hover element by its text content
      const rotateElement = screen
        .getByText('Hover to rotate')
        .closest('button')
      expect(rotateElement).toBeInTheDocument()

      // Test hover events with explicit null check
      if (rotateElement) {
        fireEvent.mouseEnter(rotateElement)
        fireEvent.mouseLeave(rotateElement)
      } else {
        throw new Error('Rotate element not found')
      }

      // The element should remain accessible after hover events
      expect(rotateElement).toBeInTheDocument()
    })

    it('handles hover events on lift interaction element', () => {
      render(<AnimationsShowcase />)

      // Find the lift hover element by its text content
      const liftElement = screen.getByText('Hover to lift').closest('button')
      expect(liftElement).toBeInTheDocument()

      // Test hover events with explicit null check
      if (liftElement) {
        fireEvent.mouseEnter(liftElement)
        fireEvent.mouseLeave(liftElement)
      } else {
        throw new Error('Lift element not found')
      }

      // The element should remain accessible after hover events
      expect(liftElement).toBeInTheDocument()
    })

    it('ensures hover elements have proper cursor pointer styling', () => {
      render(<AnimationsShowcase />)

      const scaleElement = screen.getByText('Hover to scale').closest('button')
      const rotateElement = screen
        .getByText('Hover to rotate')
        .closest('button')
      const liftElement = screen.getByText('Hover to lift').closest('button')

      // Check that all interactive elements have cursor-pointer class
      expect(scaleElement).toHaveClass('cursor-pointer')
      expect(rotateElement).toHaveClass('cursor-pointer')
      expect(liftElement).toHaveClass('cursor-pointer')
    })

    it('verifies hover elements contain expected icons', () => {
      render(<AnimationsShowcase />)

      const scaleElement = screen.getByText('Hover to scale').closest('button')
      const rotateElement = screen
        .getByText('Hover to rotate')
        .closest('button')
      const liftElement = screen.getByText('Hover to lift').closest('button')

      // Check that each hover element contains its respective icon
      expect(scaleElement).toContainElement(screen.getByTestId('sparkles'))
      expect(rotateElement).toContainElement(screen.getByTestId('circle'))
      expect(liftElement).toContainElement(screen.getByTestId('square'))
    })

    it('tests accessibility of hover elements', () => {
      render(<AnimationsShowcase />)

      const scaleElement = screen.getByText('Hover to scale').closest('button')
      const rotateElement = screen
        .getByText('Hover to rotate')
        .closest('button')
      const liftElement = screen.getByText('Hover to lift').closest('button')

      // Test keyboard accessibility (elements should be focusable)
      if (scaleElement) {
        fireEvent.focus(scaleElement)
        fireEvent.blur(scaleElement)
      } else {
        throw new Error('Scale element not found')
      }

      if (rotateElement) {
        fireEvent.focus(rotateElement)
        fireEvent.blur(rotateElement)
      } else {
        throw new Error('Rotate element not found')
      }

      if (liftElement) {
        fireEvent.focus(liftElement)
        fireEvent.blur(liftElement)
      } else {
        throw new Error('Lift element not found')
      }

      // Elements should remain accessible after focus events
      expect(scaleElement).toBeInTheDocument()
      expect(rotateElement).toBeInTheDocument()
      expect(liftElement).toBeInTheDocument()
    })

    it('simulates complete hover interaction flow', () => {
      render(<AnimationsShowcase />)

      const scaleElement = screen.getByText('Hover to scale').closest('button')
      const rotateElement = screen
        .getByText('Hover to rotate')
        .closest('button')
      const liftElement = screen.getByText('Hover to lift').closest('button')

      // Verify all elements exist before testing
      expect(scaleElement).toBeInTheDocument()
      expect(rotateElement).toBeInTheDocument()
      expect(liftElement).toBeInTheDocument()

      // Test multiple hover events in sequence with explicit null checks
      if (scaleElement && rotateElement && liftElement) {
        fireEvent.mouseEnter(scaleElement)
        fireEvent.mouseLeave(scaleElement)
        fireEvent.mouseEnter(rotateElement)
        fireEvent.mouseLeave(rotateElement)
        fireEvent.mouseEnter(liftElement)
        fireEvent.mouseLeave(liftElement)

        // Test rapid hover events
        fireEvent.mouseEnter(scaleElement)
        fireEvent.mouseEnter(scaleElement) // Re-enter while already hovering
        fireEvent.mouseLeave(scaleElement)
      } else {
        throw new Error('One or more interactive elements not found')
      }

      // All elements should remain functional after extensive interaction
      expect(scaleElement).toBeInTheDocument()
      expect(rotateElement).toBeInTheDocument()
      expect(liftElement).toBeInTheDocument()

      // Verify that hover elements still contain their icons after interaction
      if (scaleElement && rotateElement && liftElement) {
        expect(scaleElement).toContainElement(screen.getByTestId('sparkles'))
        expect(rotateElement).toContainElement(screen.getByTestId('circle'))
        expect(liftElement).toContainElement(screen.getByTestId('square'))
      }
    })
  })
})
