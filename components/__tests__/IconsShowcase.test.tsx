import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import IconsShowcase from '../brandprofile/IconsShowcase'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'icons.title': 'Icon Library',
      'icons.description':
        'Comprehensive collection of custom and third-party icons used throughout the Viscalyx brand and applications, designed for consistency and optimal performance.',
      'icons.categories.customSocialIcons.title': 'Custom Social Icons',
      'icons.categories.customSocialIcons.description':
        'Custom social platform icons designed for the Viscalyx brand.',
      'icons.categories.customBlogIcons.title': 'Custom Blog Icons',
      'icons.categories.customBlogIcons.description':
        'Icons designed specifically for blog functionality.',
      'icons.categories.lucideIcons.title': 'Lucide Icons',
      'icons.categories.lucideIcons.description':
        'Third-party icons from Lucide React for {category}.',
      'icons.categories.dynamicAlertIcons.title': 'Dynamic Alert Icons',
      'icons.categories.dynamicAlertIcons.description':
        'Icons that change based on alert type.',
      'icons.usageGuidelines.title': 'Icon Usage Guidelines',
      'icons.usageGuidelines.customIcons.title': 'Custom Icons',
      'icons.usageGuidelines.lucideIcons.title': 'Lucide React Icons',
      'icons.implementationExamples.title': 'Implementation Examples',
      'icons.implementationExamples.customSocialIcons.title':
        'Custom Social Icons',
      'icons.implementationExamples.blogAlertIcons.title': 'Blog Alert Icons',
      'icons.implementationExamples.lucideReactIcons.title':
        'Lucide React Icons',
      'icons.socialIconsUsage.github': 'Footer, Open Source section',
      'icons.socialIconsUsage.linkedin': 'Footer, Team profiles',
      'icons.socialIconsUsage.twitter': 'Footer, Social sharing',
      'icons.socialIconsUsage.bluesky': 'Footer, Social sharing',
      'icons.socialIconsUsage.mastodon': 'Footer, Social sharing',
      'icons.socialIconsUsage.stackoverflow': 'Footer, Community links',
      'icons.socialIconsUsage.youtube': 'Footer, Video content',
      'icons.socialIconsUsage.discord': 'Footer, Community links',
      'icons.socialIconsUsage.instagram': 'Footer, Social sharing',
      'icons.socialIconsUsage.slack': 'Footer, Community links',
      'icons.blogIconsUsage.copy': 'Code blocks, Copy buttons',
      'icons.blogIconsUsage.checkmark': 'Success states, Confirmations',
      'icons.blogIconsUsage.chevronUp': 'Scroll to top, Expandable content',
      'icons.blogIconsUsage.chevronDown': 'Dropdown menus, Expandable content',
      'icons.blogIconsUsage.note': 'Alert callouts, Information blocks',
      'icons.blogIconsUsage.tip': 'Alert callouts, Tips',
      'icons.blogIconsUsage.important': 'Alert callouts, Important notes',
      'icons.blogIconsUsage.warning': 'Alert callouts, Warnings',
      'icons.blogIconsUsage.caution': 'Alert callouts, Cautions',
      'icons.lucideIconsUsage.menu': 'Header navigation toggle',
      'icons.lucideIconsUsage.search': 'Search functionality',
      'icons.lucideIconsUsage.externalLink': 'External links',
      'icons.lucideIconsUsage.arrowLeft': 'Back navigation',
      'icons.lucideIconsUsage.arrowRight': 'Forward navigation',
      'icons.lucideIconsUsage.arrowUp': 'Scroll to top',
      'icons.lucideIconsUsage.sun': 'Light theme toggle',
      'icons.lucideIconsUsage.moon': 'Dark theme toggle',
      'icons.lucideIconsUsage.monitor': 'System theme toggle',
      'icons.usageGuidelines.customIcons.items.0':
        'Use currentColor for theme consistency',
      'icons.usageGuidelines.customIcons.items.1':
        'Optimized SVG paths for performance',
      'icons.usageGuidelines.customIcons.items.2':
        'Consistent sizing with className props',
      'icons.usageGuidelines.customIcons.items.3':
        'Semantic roles and aria-labels',
      'icons.usageGuidelines.customIcons.items.4':
        'Memoized for React performance',
      'icons.usageGuidelines.lucideIcons.items.0': 'Tree-shakeable imports',
      'icons.usageGuidelines.lucideIcons.items.1':
        'Consistent stroke-width of 2',
      'icons.usageGuidelines.lucideIcons.items.2':
        'Standard sizing (w-4 h-4, w-5 h-5)',
      'icons.usageGuidelines.lucideIcons.items.3':
        'Semantic naming conventions',
      'icons.usageGuidelines.lucideIcons.items.4': 'Accessible by default',
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
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock custom icon components
vi.mock('../SocialIcons', () => ({
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

vi.mock('../BlogIcons', () => ({
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
  const createMockIcon = (name: string) => {
    const MockIcon = ({ className }: { className?: string }) => (
      <div data-testid={`lucide-${name.toLowerCase()}`} className={className} />
    )
    MockIcon.displayName = `MockIcon${name}`
    return MockIcon
  }

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
