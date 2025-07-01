# Viscalyx Website

![Work in Progress](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow?style=for-the-badge)

The official website for Viscalyx, built with Next.js and featuring blog content, team information, and case studies.

## Features

- 🌐 Multi-language support (English/Swedish)
- 📱 Responsive design with Tailwind CSS
- 📝 Blog with Markdown content
- 👥 Team member profiles
- 💼 Case studies showcase
- 🌙 Dark/light theme toggle
- 📊 Bundle analysis with Codecov
- 🧪 Comprehensive testing with Vitest

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Content**: Markdown files
- **TypeScript**: Full type safety
- **Testing**: Vitest with coverage reporting
- **Bundle Analysis**: Codecov bundle analysis
- **Deployment**: Cloudflare

## Development

### Bundle Analysis

This project uses Codecov for bundle analysis to monitor bundle size changes:

- Bundle analysis runs automatically on every build in CI
- Results are posted as PR comments when bundle size changes
- View detailed bundle analysis on [Codecov](https://app.codecov.io/gh/viscalyx/viscalyx.se)
- Run local bundle analysis: `npm run analyze:bundle`

The bundle analysis helps identify:

- Bundle size increases/decreases
- Module dependencies that affect bundle size
- Performance impact of code changes

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
