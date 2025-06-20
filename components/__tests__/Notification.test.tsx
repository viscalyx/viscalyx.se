import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import Notification from '../Notification'
type NotificationType = 'success' | 'error' | 'warning' | 'info'

jest.mock('lucide-react', () => {
  const React = require('react')
  return {
    Info: (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement('svg', { 'data-testid': 'Info', ...props }),
    X: (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement('svg', { 'data-testid': 'X', ...props }),
    CheckCircle: (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement('svg', { 'data-testid': 'CheckCircle', ...props }),
    AlertCircle: (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement('svg', { 'data-testid': 'AlertCircle', ...props }),
    AlertTriangle: (props: React.SVGProps<SVGSVGElement>) =>
      React.createElement('svg', { 'data-testid': 'AlertTriangle', ...props }),
  }
})

describe('Notification component', () => {
  it('renders with correct message and close button', () => {
    render(
      <Notification
        type="info"
        title="Test Title"
        message="Test Message"
        onClose={() => {}}
      />
    )
    expect(screen.getByText('Test Message')).toBeInTheDocument()
    expect(screen.getByTestId('X')).toBeInTheDocument()
  })
})

describe('auto-dismissal behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('calls onClose after specified duration plus animation delay', () => {
    const onClose = jest.fn()
    const { container } = render(
      <Notification
        type="info"
        title="Auto Dismiss"
        message="Auto Message"
        duration={100}
        onClose={onClose}
      />
    )
    // initially visible
    expect(container.firstChild).toBeInTheDocument()

    // advance to duration
    act(() => {
      jest.advanceTimersByTime(100)
    })
    // should be hidden
    expect(container.firstChild).toBeNull()

    // advance past animation delay
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it.each([0, -100])('does not auto-dismiss when duration=%d', duration => {
    const onClose = jest.fn()
    const { container } = render(
      <Notification
        type="info"
        title="Persistent"
        message="Persistent Message"
        duration={duration}
        onClose={onClose}
      />
    )
    act(() => {
      jest.advanceTimersByTime(10000)
    })
    expect(container.firstChild).not.toBeNull()
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('manual close behavior', () => {
  it('calls onClose when close button is clicked', () => {
    jest.useFakeTimers()
    const onClose = jest.fn()
    render(
      <Notification
        type="info"
        title="Click Close"
        message="Click Message"
        duration={0}
        onClose={onClose}
      />
    )
    fireEvent.click(screen.getByTestId('X'))
    // advance past animation delay for manual close
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(onClose).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})

it.each<[NotificationType, string, string, string]>([
  ['success', 'bg-green-50', 'border-green-200', 'CheckCircle'],
  ['error', 'bg-red-50', 'border-red-200', 'AlertCircle'],
  ['warning', 'bg-yellow-50', 'border-yellow-200', 'AlertTriangle'],
  ['info', 'bg-blue-50', 'border-blue-200', 'Info'],
])(
  'applies correct styling and icon for %s notifications',
  (type, bg, border, iconTestId) => {
    const { container } = render(
      <Notification
        type={type}
        title="Styled"
        message="Styled Message"
        duration={0}
        onClose={() => {}}
      />
    )
    const firstChild = container.firstChild
    expect(firstChild).not.toBeNull()
    const wrapper = firstChild as HTMLElement
    expect(wrapper).toHaveClass(bg)
    expect(wrapper).toHaveClass(border)
    expect(screen.getByTestId(iconTestId)).toBeInTheDocument()
  }
)
