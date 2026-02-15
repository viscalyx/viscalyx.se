# Viscalyx Website

The official website for Viscalyx, built with Next.js 16 and deployed to Cloudflare Workers via OpenNext.

## Features

- 🌐 Multi-language support (English/Swedish) via next-intl
- 📱 Responsive design with Tailwind CSS 4 (mobile-first, dark mode)
- 📝 Blog with Markdown content (remark/rehype pipeline with GFM support)
- 🎨 Code syntax highlighting via Prism.js with copy-to-clipboard
- 📊 Mermaid diagram rendering (lazy-loaded, DOMPurify-sanitized)
- 📖 Table of contents with active heading tracking
- 📈 Reading progress indicator for blog posts
- 👥 Team member profiles
- 💻 Open source contributions showcase
- 🌙 Dark/light/system theme toggle with Framer Motion animations
- 🖼️ Image lightbox with zoom
- 🍪 GDPR-compliant cookie consent with granular controls
- 🔒 Privacy-first analytics with Cloudflare Analytics Engine
- 🛡️ Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- 🧪 Comprehensive testing with Vitest and Playwright

### Privacy & Analytics

Our website respects user privacy and complies with GDPR cookie consent requirements:

- **Cookie Consent Banner**: Appears on first visit to allow users to choose their cookie preferences
- **Granular Control**: Users can accept/reject different categories of cookies:
  - **Strictly Necessary**: Required for website functionality (always enabled)
  - **Preferences**: Remember user settings like theme and language preferences
  - **Analytics**: Track website usage through Cloudflare Analytics Engine
- **Privacy-First Analytics**: We collect minimal data for website improvement:
  - Reading progress and time spent on blog posts
  - Geographic location (country-level) via Cloudflare
  - Referrer information and basic browser data
  - **No client-side tracking cookies** — all processing happens server-side
- **User Rights**: Users can change preferences, export data, or reset consent at any time

## Legal Compliance

### GDPR Requirements Met

1. ✅ **Explicit Consent**: Clear opt-in required for non-essential cookies
2. ✅ **Granular Choice**: Users can select specific cookie categories
3. ✅ **Easy Withdrawal**: Users can change preferences anytime
4. ✅ **Clear Information**: Detailed cookie descriptions provided
5. ✅ **Record Keeping**: Consent timestamp and settings stored
6. ✅ **No Pre-checked Boxes**: All non-essential cookies disabled by default

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 with App Router and React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 with `@tailwindcss/typography`
- **Animations**: [Framer Motion](https://motion.dev/)
- **Internationalization**: [next-intl](https://next-intl.dev/) (en/sv)
- **Content**: Markdown processed via remark + remark-gfm → rehype-prism-plus → rehype-stringify
- **Syntax Highlighting**: [Prism.js](https://prismjs.com/) (build-time via rehype-prism-plus)
- **Diagrams**: [Mermaid](https://mermaid.js.org/) (lazy-loaded at runtime)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Strict mode with typed routes
- **Unit Testing**: [Vitest](https://vitest.dev/) with Testing Library and coverage via V8
- **Integration Testing**: [Playwright](https://playwright.dev/)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/) via [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)

## Project Structure

```
app/[locale]/             → Pages (blog, team, cookies, privacy, terms)
app/api/analytics/        → Blog read tracking API endpoint
components/               → React components (client islands + shared UI)
content/blog/             → Blog posts in Markdown with frontmatter
lib/                      → Utilities (blog, analytics, cookies, dates, i18n)
messages/{en,sv}.json     → Translation files
public/                   → Static assets, blog images, generated content
scripts/                  → Build scripts (blog data, page dates, OG images, bundle analysis)
tests/integration/        → Playwright integration tests
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup instructions, development
workflow, and environment configuration.

Quick start:

```bash
npm install
npm run dev
```

### Scripts

```bash
# Development
npm run dev                          # Start development server
npm run build                        # Production build (runs prebuild automatically)
npm run preview                      # Build and preview via Cloudflare Workers locally

# Quality Assurance
npm run check                        # Run all checks (type-check, format, spell, lint, test, security)
npm run test                         # Run unit tests (Vitest)
npm run test:watch                   # Watch mode testing
npm run test:coverage                # Coverage report
npm run test:ui                      # Vitest UI
npm run test:security                # Security audit (sanitization tests)
npm run test:integration             # Playwright integration tests (dev server)
npm run test:integration:preview     # Playwright integration tests (preview server)
npm run lint                         # ESLint
npm run type-check                   # TypeScript checking
npm run format                       # Prettier formatting
npm run spell                        # Spell checking (cspell)

# Build & Analysis
npm run build:sitedata               # Rebuild blog data and page dates
npm run bundle:analyze               # Analyze Cloudflare Worker bundle size
npm run clean:all                    # Remove .next, out, .open-next, .wrangler

# Deployment
npm run deploy                       # Build and deploy to Cloudflare Workers
```

## License

This project's source code is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Specific assets such as logos and photographs of identifiable individuals are subject to different licensing terms. Please refer to the [LICENSE-ASSETS.md](LICENSE-ASSETS.md) file for details on the licensing of these assets.

### Content Usage

- **Blog posts and articles**: Free to use, share, and adapt under the MIT License (see [LICENSE](LICENSE)).
- **Source code**: Open source under the MIT License (see [LICENSE](LICENSE)).
- **Logos and Profile Photos**: All Rights Reserved. See [LICENSE-ASSETS.md](LICENSE-ASSETS.md) for details.
- **Other Assets in `public/` directory**: All Rights Reserved, unless otherwise specified. See [LICENSE-ASSETS.md](LICENSE-ASSETS.md).
- **Personal/team information**: Please respect privacy when reusing content.

The MIT License allows you to freely use the blog content and website source code while ensuring proper attribution to Viscalyx. Other assets are subject to the terms outlined in `LICENSE-ASSETS.md`.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to set up your environment and contribute to the project.
