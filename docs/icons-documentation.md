# Icon Library Documentation

This document provides a comprehensive overview of all icons used in the Viscalyx.se project, including custom icons and third-party icons from Lucide React.

## Icon Categories

### Custom Social Icons (`/components/SocialIcons.tsx`)

Custom SVG icons optimized for social media platforms, using `currentColor` for theme consistency.

| Icon           | Component           | Usage                       | Description                         |
| -------------- | ------------------- | --------------------------- | ----------------------------------- |
| GitHub         | `GitHubIcon`        | Footer, Open Source section | GitHub profile and repository links |
| LinkedIn       | `LinkedInIcon`      | Footer, Team profiles       | Professional networking             |
| X (Twitter)    | `XIcon`             | Footer, Social sharing      | Social media sharing                |
| Bluesky        | `BlueskyIcon`       | Footer, Social links        | Decentralized social network        |
| Mastodon       | `MastodonIcon`      | Footer, Social links        | Federated social network            |
| Stack Overflow | `StackOverflowIcon` | Footer, Professional links  | Developer Q&A platform              |
| YouTube        | `YouTubeIcon`       | Footer, Content sharing     | Video content platform              |
| Discord        | `DiscordIcon`       | Footer, Community           | Community chat platform             |
| Instagram      | `InstagramIcon`     | Footer, Visual content      | Visual social media                 |
| Slack          | `SlackIcon`         | Footer, Team communication  | Team collaboration                  |

### Custom Blog Icons (`/components/BlogIcons.tsx`)

Specialized icons for blog functionality and content alerts.

| Icon         | Component         | Usage                             | Description                      |
| ------------ | ----------------- | --------------------------------- | -------------------------------- |
| Copy         | `CopyIcon`        | Code blocks, Copy buttons         | Copy to clipboard functionality  |
| Checkmark    | `CheckmarkIcon`   | Success states, Confirmations     | Success feedback                 |
| Chevron Up   | `ChevronUpIcon`   | Table of contents, Navigation     | Scroll up indicators             |
| Chevron Down | `ChevronDownIcon` | Table of contents, Navigation     | Scroll down indicators           |
| Note         | `NoteIcon`        | Blog alerts, Information blocks   | Informational content            |
| Tip          | `TipIcon`         | Blog alerts, Helpful suggestions  | Helpful tips and suggestions     |
| Important    | `ImportantIcon`   | Blog alerts, Critical information | Important notices                |
| Warning      | `WarningIcon`     | Blog alerts, Warning messages     | Warning notifications            |
| Caution      | `CautionIcon`     | Blog alerts, Caution messages     | Caution notices                  |
| Alert        | `AlertIcon`       | Dynamic blog alerts               | Dynamic alert icon based on type |

### Lucide React Icons

Third-party icons from the Lucide React library, organized by category.

#### Navigation & UI

| Icon       | Component    | Usage                         | Description                     |
| ---------- | ------------ | ----------------------------- | ------------------------------- |
| Menu       | `Menu`       | Header navigation toggle      | Mobile menu toggle              |
| X          | `X`          | Close buttons, Notifications  | Close dialogs and notifications |
| Settings   | `Settings`   | Header settings menu          | Settings access                 |
| Globe      | `Globe`      | Language switcher             | Language selection              |
| ArrowUp    | `ArrowUp`    | Scroll to top button          | Page navigation                 |
| ArrowLeft  | `ArrowLeft`  | Testimonials navigation       | Previous navigation             |
| ArrowRight | `ArrowRight` | Testimonials, Team, Hero CTAs | Next navigation and CTAs        |

#### Theme & Display

| Icon    | Component | Usage                      | Description            |
| ------- | --------- | -------------------------- | ---------------------- |
| Sun     | `Sun`     | Theme toggle (light mode)  | Light theme indicator  |
| Moon    | `Moon`    | Theme toggle (dark mode)   | Dark theme indicator   |
| Monitor | `Monitor` | Theme toggle (system mode) | System theme indicator |
| Eye     | `Eye`     | Brand showcase visibility  | Visual demonstration   |
| Palette | `Palette` | Brand showcase colors      | Color palette display  |

#### Status & Feedback

| Icon          | Component       | Usage                             | Description           |
| ------------- | --------------- | --------------------------------- | --------------------- |
| Loader2       | `Loader2`       | Loading spinner                   | Loading states        |
| CheckCircle   | `CheckCircle`   | Success states, Contact form      | Success confirmations |
| AlertCircle   | `AlertCircle`   | Notifications, Component showcase | Alert notifications   |
| AlertTriangle | `AlertTriangle` | Warning notifications             | Warning alerts        |
| Info          | `Info`          | Information notifications         | Information displays  |
| Check         | `Check`         | Component showcase confirmations  | Simple checkmarks     |

#### Business & Features

| Icon       | Component    | Usage                             | Description                 |
| ---------- | ------------ | --------------------------------- | --------------------------- |
| Target     | `Target`     | About section - mission           | Mission and goals           |
| Users      | `Users`      | About section - team, Open source | Team and community          |
| Lightbulb  | `Lightbulb`  | About section - innovation        | Innovation and ideas        |
| Award      | `Award`      | About section - excellence        | Excellence and achievements |
| TrendingUp | `TrendingUp` | Case studies - growth metrics     | Growth and improvement      |
| Star       | `Star`       | Testimonials, Open source ratings | Ratings and favorites       |

#### Technical & Services

| Icon       | Component    | Usage                          | Description              |
| ---------- | ------------ | ------------------------------ | ------------------------ |
| Code       | `Code`       | Hero section, Services         | Development services     |
| Database   | `Database`   | Services - backend development | Data management          |
| Smartphone | `Smartphone` | Services - mobile development  | Mobile applications      |
| Search     | `Search`     | Services - SEO optimization    | Search optimization      |
| BarChart   | `BarChart`   | Services - analytics           | Analytics and metrics    |
| Shield     | `Shield`     | Services - security            | Security services        |
| Zap        | `Zap`        | Services - performance         | Performance optimization |
| Layers     | `Layers`     | Services - architecture        | System architecture      |
| GitBranch  | `GitBranch`  | Services - version control     | Version control          |
| Cloud      | `Cloud`      | Services - cloud solutions     | Cloud services           |

#### Communication & Contact

| Icon          | Component       | Usage                               | Description         |
| ------------- | --------------- | ----------------------------------- | ------------------- |
| Mail          | `Mail`          | Contact form, Footer, Team profiles | Email communication |
| Phone         | `Phone`         | Contact information                 | Phone contact       |
| MapPin        | `MapPin`        | Contact location, Team locations    | Location markers    |
| Send          | `Send`          | Contact form submission             | Send messages       |
| MessageSquare | `MessageSquare` | Contact communication               | Chat and messaging  |

#### Content & Media

| Icon         | Component      | Usage                     | Description        |
| ------------ | -------------- | ------------------------- | ------------------ |
| Quote        | `Quote`        | Testimonials section      | Quotation marks    |
| Camera       | `Camera`       | Team member photos        | Photography        |
| ExternalLink | `ExternalLink` | Footer, Open source links | External links     |
| Download     | `Download`     | Accessibility showcase    | Download actions   |
| Clock        | `Clock`        | Case studies - timeline   | Time and schedules |

#### Design & Layout

| Icon         | Component      | Usage                             | Description          |
| ------------ | -------------- | --------------------------------- | -------------------- |
| Sparkles     | `Sparkles`     | Hero section, Animations showcase | Special effects      |
| Square       | `Square`       | Brand showcase, Animations        | Geometric shapes     |
| Circle       | `Circle`       | Animations showcase               | Circular elements    |
| Type         | `Type`         | Brand showcase typography         | Typography           |
| MousePointer | `MousePointer` | Brand showcase interactions       | Interactive elements |

#### Special & Decorative

| Icon  | Component | Usage                   | Description        |
| ----- | --------- | ----------------------- | ------------------ |
| Heart | `Heart`   | Footer - made with love | Affection and care |

## Usage Guidelines

### Custom Icons

- **Theme Consistency**: Use `currentColor` for automatic theme adaptation
- **Performance**: Optimized SVG paths for minimal bundle size
- **Accessibility**: Include proper `role` and `aria-label` attributes
- **Sizing**: Use consistent className props for sizing (e.g., `w-5 h-5`)
- **Memoization**: Components are memoized for React performance

### Lucide React Icons

- **Tree-shakeable**: Import only the icons you need
- **Consistency**: Use standard stroke-width of 2
- **Sizing**: Standard sizes are `w-4 h-4` and `w-5 h-5`
- **Accessibility**: Icons are accessible by default
- **Semantic**: Use semantic naming conventions

## Implementation Examples

### Custom Social Icons

```tsx
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

<GitHubIcon className="w-5 h-5 text-gray-600 hover:text-gray-900" />
<LinkedInIcon className="w-5 h-5 text-blue-600 hover:text-blue-700" />
```

### Blog Alert Icons

```tsx
import { AlertIcon } from '@/components/BlogIcons'

<AlertIcon type="warning" className="w-5 h-5 text-orange-500" />
<AlertIcon type="tip" className="w-5 h-5 text-blue-500" />
```

### Lucide React Icons

```tsx
import { Mail, Phone, MapPin } from 'lucide-react'

<Mail className="w-5 h-5 text-primary-600" />
<Phone className="w-5 h-5 text-secondary-600" />
<MapPin className="w-5 h-5 text-accent-600" />
```

## Icon Standards

### Sizing

- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)

### Colors

- Primary: `text-primary-600` (light) / `text-primary-400` (dark)
- Secondary: `text-secondary-600` (light) / `text-secondary-400` (dark)
- Accent: `text-accent-600` (light) / `text-accent-400` (dark)
- Neutral: `text-gray-600` (light) / `text-gray-300` (dark)

### States

- Default: Base color
- Hover: Darker shade (`hover:text-primary-700`)
- Active: Darkest shade (`active:text-primary-800`)
- Disabled: Light gray (`text-gray-400`)

## File Organization

- **Custom Icons**: `/components/SocialIcons.tsx`, `/components/BlogIcons.tsx`
- **Icon Tests**: `/components/__tests__/SocialIcons.test.tsx`, `/components/__tests__/BlogIcons.test.tsx`
- **Usage Documentation**: This file and `/components/brandprofile/IconsShowcase.tsx`

## Performance Considerations

- Custom icons use optimized SVG paths
- Lucide React icons are tree-shakeable
- Icons are memoized where appropriate
- Consistent use of `currentColor` for theme changes
- Minimal bundle impact through selective imports

This documentation ensures consistent icon usage across the Viscalyx.se project while maintaining performance and accessibility standards.
