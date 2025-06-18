import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Notification from '../Notification'

jest.mock('lucide-react', () => {
  const React = require('react')
  return {
    Info: (props: any) => <svg {...props} data-testid="Info" />,
    X: (props: any) => <svg {...props} data-testid="X" />,
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
