import { render } from '@testing-library/react'
import {
  BlueskyIcon,
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  SlackIcon,
  StackOverflowIcon,
  XIcon,
  YouTubeIcon,
} from '../SocialIcons'

describe('SocialIcons', () => {
  const icons = [
    { name: 'GitHubIcon', Icon: GitHubIcon, viewBox: '0 0 98 96' },
    { name: 'LinkedInIcon', Icon: LinkedInIcon, viewBox: '0 0 24 24' },
    { name: 'XIcon', Icon: XIcon, viewBox: '0 0 24 24' },
    { name: 'BlueskyIcon', Icon: BlueskyIcon, viewBox: '0 0 360 320' },
    { name: 'MastodonIcon', Icon: MastodonIcon, viewBox: '0 0 24 24' },
    {
      name: 'StackOverflowIcon',
      Icon: StackOverflowIcon,
      viewBox: '0 0 24 24',
    },
    { name: 'YouTubeIcon', Icon: YouTubeIcon, viewBox: '0 0 24 24' },
    { name: 'DiscordIcon', Icon: DiscordIcon, viewBox: '0 0 24 24' },
    { name: 'InstagramIcon', Icon: InstagramIcon, viewBox: '0 0 24 24' },
    { name: 'SlackIcon', Icon: SlackIcon, viewBox: '0 0 24 24' },
  ]

  icons.forEach(({ name, Icon, viewBox }) => {
    describe(name, () => {
      it('renders with default className and attributes', () => {
        const { container } = render(<Icon />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        // default size classes
        expect(svg).toHaveClass('w-5', 'h-5')
        expect(svg).toHaveAttribute('viewBox', viewBox)
        expect(svg).toHaveAttribute('fill', 'currentColor')
      })

      it('accepts a custom className', () => {
        const { container } = render(<Icon className="custom-class" />)
        const svg = container.querySelector('svg')
        expect(svg).toHaveClass('custom-class')
      })
    })
  })
})
