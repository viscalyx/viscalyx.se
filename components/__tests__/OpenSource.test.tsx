import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import OpenSource from '../OpenSource'

// Mock translations
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))

// Mock next/navigation to provide router context
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('OpenSource component', () => {
  it('renders section and list of projects', () => {
    render(<OpenSource />)
    const section = document.querySelector('section#open-source')
    expect(section).toBeInTheDocument()

    // Should render heading
    expect(screen.getByText('title')).toBeInTheDocument()

    // Should render at least one project item
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })
})
