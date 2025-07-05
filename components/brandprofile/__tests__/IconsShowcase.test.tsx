import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import IconsShowcase from '../IconsShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'icons.title': 'Icon Library',
      'icons.description':
        'Comprehensive collection of custom and third-party icons used throughout the Viscalyx brand and applications, designed for consistency and optimal performance.',
    }
    return translations[key] || key
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode
      [key: string]: any
    }) => <div {...props}>{children}</div>,
  },
}))

// Mock custom icon components
vi.mock('../../SocialIcons', () => ({
  GitHubIcon: ({ className }: { className?: string }) => (
    <div data-testid="github-icon" className={className} />
  ),
  LinkedInIcon: ({ className }: { className?: string }) => (
    <div data-testid="linkedin-icon" className={className} />
  ),
  XIcon: ({ className }: { className?: string }) => (
    <div data-testid="x-icon" className={className} />
  ),
  BlueskyIcon: ({ className }: { className?: string }) => (
    <div data-testid="bluesky-icon" className={className} />
  ),
  MastodonIcon: ({ className }: { className?: string }) => (
    <div data-testid="mastodon-icon" className={className} />
  ),
  StackOverflowIcon: ({ className }: { className?: string }) => (
    <div data-testid="stackoverflow-icon" className={className} />
  ),
  YouTubeIcon: ({ className }: { className?: string }) => (
    <div data-testid="youtube-icon" className={className} />
  ),
  DiscordIcon: ({ className }: { className?: string }) => (
    <div data-testid="discord-icon" className={className} />
  ),
  InstagramIcon: ({ className }: { className?: string }) => (
    <div data-testid="instagram-icon" className={className} />
  ),
  SlackIcon: ({ className }: { className?: string }) => (
    <div data-testid="slack-icon" className={className} />
  ),
}))

vi.mock('../../BlogIcons', () => ({
  CopyIcon: ({ className }: { className?: string }) => (
    <div data-testid="copy-icon" className={className} />
  ),
  CheckmarkIcon: ({ className }: { className?: string }) => (
    <div data-testid="checkmark-icon" className={className} />
  ),
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-up-icon" className={className} />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  NoteIcon: ({ className }: { className?: string }) => (
    <div data-testid="note-icon" className={className} />
  ),
  TipIcon: ({ className }: { className?: string }) => (
    <div data-testid="tip-icon" className={className} />
  ),
  ImportantIcon: ({ className }: { className?: string }) => (
    <div data-testid="important-icon" className={className} />
  ),
  WarningIcon: ({ className }: { className?: string }) => (
    <div data-testid="warning-icon" className={className} />
  ),
  CautionIcon: ({ className }: { className?: string }) => (
    <div data-testid="caution-icon" className={className} />
  ),
  AlertIcon: ({ type, className }: { type: string; className?: string }) => (
    <div data-testid={`alert-icon-${type}`} className={className} />
  ),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const createMockIcon =
    (name: string) =>
    ({ className }: { className?: string }) => (
      <div data-testid={`lucide-${name.toLowerCase()}`} className={className} />
    )

  return {
    Copy: createMockIcon('copy'),
    Check: createMockIcon('check'),
    ChevronUp: createMockIcon('chevron-up'),
    ChevronDown: createMockIcon('chevron-down'),
    Info: createMockIcon('info'),
    Lightbulb: createMockIcon('lightbulb'),
    MessageSquare: createMockIcon('message-square'),
    AlertTriangle: createMockIcon('alert-triangle'),
    OctagonAlert: createMockIcon('octagon-alert'),
    Target: createMockIcon('target'),
    Users: createMockIcon('users'),
    Award: createMockIcon('award'),
    Globe: createMockIcon('globe'),
    Code: createMockIcon('code'),
    Database: createMockIcon('database'),
    Smartphone: createMockIcon('smartphone'),
    Palette: createMockIcon('palette'),
    Search: createMockIcon('search'),
    BarChart: createMockIcon('bar-chart'),
    Shield: createMockIcon('shield'),
    Zap: createMockIcon('zap'),
    Layers: createMockIcon('layers'),
    GitBranch: createMockIcon('git-branch'),
    Settings: createMockIcon('settings'),
    Cloud: createMockIcon('cloud'),
    Monitor: createMockIcon('monitor'),
    Menu: createMockIcon('menu'),
    X: createMockIcon('x'),
    Sun: createMockIcon('sun'),
    Moon: createMockIcon('moon'),
    Loader2: createMockIcon('loader2'),
    ExternalLink: createMockIcon('external-link'),
    Star: createMockIcon('star'),
    ArrowLeft: createMockIcon('arrow-left'),
    ArrowRight: createMockIcon('arrow-right'),
    Quote: createMockIcon('quote'),
    Mail: createMockIcon('mail'),
    Heart: createMockIcon('heart'),
    TrendingUp: createMockIcon('trending-up'),
    Clock: createMockIcon('clock'),
    CheckCircle: createMockIcon('check-circle'),
    Send: createMockIcon('send'),
    MapPin: createMockIcon('map-pin'),
    Phone: createMockIcon('phone'),
    ArrowUp: createMockIcon('arrow-up'),
    Sparkles: createMockIcon('sparkles'),
    Camera: createMockIcon('camera'),
    AlertCircle: createMockIcon('alert-circle'),
    Download: createMockIcon('download'),
    Eye: createMockIcon('eye'),
    MousePointer: createMockIcon('mouse-pointer'),
    Square: createMockIcon('square'),
    Type: createMockIcon('type'),
    Circle: createMockIcon('circle'),
  }
})

describe('IconsShowcase', () => {
  it('renders the main heading', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Icon Library')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<IconsShowcase />)
    expect(
      screen.getByText(
        /Comprehensive collection of custom and third-party icons/
      )
    ).toBeInTheDocument()
  })

  it('renders custom social icons section', () => {
    render(<IconsShowcase />)
    const socialIconsHeadings = screen.getAllByText('Custom Social Icons')
    expect(socialIconsHeadings.length).toBeGreaterThan(0)
    expect(screen.getByTestId('github-icon')).toBeInTheDocument()
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  it('renders custom blog icons section', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Custom Blog Icons')).toBeInTheDocument()
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
    expect(screen.getByTestId('checkmark-icon')).toBeInTheDocument()
    expect(screen.getByTestId('note-icon')).toBeInTheDocument()
  })

  it('renders Lucide React icons sections', () => {
    render(<IconsShowcase />)
    expect(
      screen.getByText('Lucide Icons - Navigation & UI')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Lucide Icons - Theme & Display')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Lucide Icons - Status & Feedback')
    ).toBeInTheDocument()
    expect(screen.getByTestId('lucide-menu')).toBeInTheDocument()
    expect(screen.getByTestId('lucide-sun')).toBeInTheDocument()
    expect(screen.getByTestId('lucide-check-circle')).toBeInTheDocument()
  })

  it('renders dynamic alert icons', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Dynamic Alert Icons')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon-note')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon-tip')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon-warning')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon-caution')).toBeInTheDocument()
    expect(screen.getByTestId('alert-icon-important')).toBeInTheDocument()
  })

  it('renders usage guidelines', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Icon Usage Guidelines')).toBeInTheDocument()
    expect(screen.getByText('Custom Icons')).toBeInTheDocument()
    const lucideHeadings = screen.getAllByText('Lucide React Icons')
    expect(lucideHeadings.length).toBeGreaterThan(0)
    const currentColorTexts = screen.getAllByText(
      /currentColor for theme consistency/
    )
    expect(currentColorTexts.length).toBeGreaterThan(0)
    const treeShakeableTexts = screen.getAllByText(/Tree-shakeable imports/)
    expect(treeShakeableTexts.length).toBeGreaterThan(0)
  })

  it('renders implementation examples', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Implementation Examples')).toBeInTheDocument()
    const socialIconsHeadings = screen.getAllByText('Custom Social Icons')
    expect(socialIconsHeadings.length).toBeGreaterThan(0)
    expect(screen.getByText('Blog Alert Icons')).toBeInTheDocument()
    const lucideHeadings = screen.getAllByText('Lucide React Icons')
    expect(lucideHeadings.length).toBeGreaterThan(0)
  })

  it('shows icon usage information', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('Footer, Open Source section')).toBeInTheDocument()
    expect(screen.getByText('Code blocks, Copy buttons')).toBeInTheDocument()
    expect(screen.getByText('Header navigation toggle')).toBeInTheDocument()
  })

  it('displays icon names correctly', () => {
    render(<IconsShowcase />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })
})
