# Viscalyx Website

The official website for Viscalyx, built with Next.js and featuring blog content, team information, and case studies.

## Features

- 🌐 Multi-language support (English/Swedish)
- 📱 Responsive design with Tailwind CSS
- 📝 Blog with Markdown content
- 👥 Team member profiles
- 💼 Case studies showcase
- 🌙 Dark/light theme toggle
- 🍪 GDPR-compliant cookie consent
- 🔒📊 Privacy-first analytics with Cloudflare
- 🧪 Comprehensive testing with Vitest

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
  - **No client-side tracking cookies** - all processing happens server-side
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

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Content**: Markdown files
- **TypeScript**: Full type safety
- **Testing**: Vitest with coverage reporting
- **Deployment**: Cloudflare

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup instructions, development
workflow, and environment configuration.

Quick start:

```bash
npm install
npm run dev
```

## License

This project's source code is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
