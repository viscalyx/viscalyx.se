# Contributing to Viscalyx.se

First off, thank you for considering contributing to Viscalyx.se! We welcome
contributions of all kinds, from bug fixes and documentation improvements to new
features. This document provides guidelines to help you get started.

If you haven't already, please read the main [README.md](README.md) for an
overview of the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Open in Dev Container](#open-in-dev-container)
- [Development](#development)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Running the App Locally](#running-the-app-locally)
  - [Building the App](#building-the-app)
  - [Linting and Formatting](#linting-and-formatting)
  - [Type Checking](#type-checking)
- [Making Changes](#making-changes)
  - [Code Structure Overview](#code-structure-overview)
  - [Adding New Content](#adding-new-content)
    - [Blog Posts](#blog-posts)
    - [Static Pages](#static-pages)
    - [Internationalization (i18n)](#internationalization-i18n)
  - [Component Development](#component-development)
  - [Styling](#styling)
- [Brand Guidelines & Visual Style Guide](#brand-guidelines--visual-style-guide)
  - [Brand Assets](#brand-assets)
  - [Style Guide](#style-guide)
  - [Usage Examples](#brand-usage-examples)
- [Submitting Contributions](#submitting-contributions)
  - [Commit Messages](#commit-messages)
  - [Pull Request (PR) Process](#pull-request-pr-process)
  - [Code Review](#code-review)
- [Dev Container Setup & Requirements](#dev-container-setup--requirements)
  - [Cross-Platform Compatibility](#cross-platform-compatibility)
  - [Prerequisites by Platform](#prerequisites-by-platform)
  - [Verifying Your Setup](#verifying-your-setup)
  - [Troubleshooting](#troubleshooting)
  - [What's Included in the Dev Container](#whats-included-in-the-dev-container)
  - [GitHub CLI Authentication](#github-cli-authentication)
- [Spell Checking Setup](#spell-checking-setup)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Automation](#automation)
  - [Ignoring False Positives](#ignoring-false-positives)
  - [Configuration Details](#configuration-details)
  - [Troubleshooting](#troubleshooting)
  - [Language Extensions](#language-extensions)
  - [Best Practices](#best-practices)
- [Cloudflare Scripts Documentation](#cloudflare-scripts-documentation)
  - [Scripts Overview](#scripts-overview)
  - [Testing Workflow](#testing-workflow)
  - [Configuration Files](#configuration-files)
  - [Required Dependencies](#required-dependencies)
  - [Additional Resources](#additional-resources)
- [Security Testing](#security-testing)
  - [Overview](#security-overview)
  - [Security Test Components](#security-test-components)
  - [Running Security Tests](#running-security-tests)
  - [Security Configuration](#security-configuration)
  - [Security Recommendations](#security-recommendations)
  - [Troubleshooting Security Tests](#troubleshooting-security-tests)
- [Page Dates Management](#page-dates-management)
  - [Overview](#overview)
  - [How It Works](#how-it-works)
  - [Build Process Integration](#build-process-integration)
  - [Manual Update](#manual-update)
  - [Tracked Pages](#tracked-pages)
  - [Benefits](#benefits)
  - [Adding New Pages](#adding-new-pages)
- [Slug Utilities Documentation](#slug-utilities-documentation)
  - [Features](#features)
  - [Usage Examples](#usage-examples)
  - [API Reference](#api-reference)
  - [Integration Examples](#integration-examples)
  - [TypeScript Types](#typescript-types)
  - [Benefits](#benefits-slug-utilities)
- [GDPR Cookie Consent Implementation](#gdpr-cookie-consent-implementation)
  - [Features](#features-consent)
  - [Cookie Categories](#cookie-categories)
  - [Files Added/Modified](#files-addedmodified)
  - [Usage](#usage-consent)
  - [Legal Compliance](#legal-compliance)
  - [Customization](#customization)
  - [Testing](#testing-consent)
  - [Browser Support](#browser-support)
  - [Performance](#performance-consent)
  - [Monitoring](#monitoring)
  - [Security](#security-consent)
  - [Maintenance](#maintenance)
  - [Support](#support)
  - [License](#license)
- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Asking for Help](#asking-for-help)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended, check `.nvmrc` if
  available or `package.json` engines field)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Getting Started

1. **Fork the repository**: Click the "Fork" button on the GitHub repository
   page.
2. **Clone your fork**:

   <!-- markdownlint-disable MD013 -->

   ```bash
   git clone https://github.com/YOUR_USERNAME/viscalyx.se.git
   cd viscalyx.se
   ```

   <!-- markdownlint-enable MD013 -->

### Open in Dev Container

To ensure a consistent development environment, this project supports VS Code
Dev Containers.

1. **Install the Remote - Containers extension**: If you haven't already,
   install the

   <!-- markdownlint-disable MD013 -->

   [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

   <!-- markdownlint-enable MD013 -->

   extension from the VS Code Marketplace.

2. **Reopen in Container**:
   - Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
   - Type `Remote-Containers: Reopen in Container` and select it.
   - VS Code will build the development container. This may take a few minutes
     the first time.
   - Once built, your workspace files will be automatically synced into the
     container, and it will have all the necessary tools and dependencies
     pre-installed.

3. **Install dependencies**:

   <!-- markdownlint-disable MD013 -->

   ```bash
   npm install
   ```

   <!-- markdownlint-enable MD013 -->

4. **Set up environment variables** (if needed):

   This project uses `.env` files for both `npm run dev` (Next.js) and
   `npm run preview` (Wrangler).

   **Files committed to repository:**
   - `.env.development` - Shared development defaults
   - `.env.production` - Shared production defaults (if needed)
   - `.env.example` - Template showing all possible variables

   **Files for local secrets (gitignored):**
   - `.env.development.local` - Your local development secrets/overrides
   - `.env.local` - Your local overrides for all environments

   If you need to add local secrets or override defaults:

   <!-- markdownlint-disable MD013 -->

   ```bash
   cp .env.example .env.development.local
   ```

   <!-- markdownlint-enable MD013 -->

   Edit `.env.development.local` and add your secret values.

   > **Note**: All matching .env files are loaded and values are merged. For
   > each variable, the value from the most specific file is used, with this
   > precedence:
   >
   > 1. `.env.development.local` (most specific - your local secrets)
   > 2. `.env.local`
   > 3. `.env.development` (shared defaults)
   > 4. `.env` (least specific - global defaults)
   >
   > This works for both Next.js and Wrangler. See

   <!-- markdownlint-disable MD013 -->

   > [Cloudflare's documentation](https://developers.cloudflare.com/workers/configuration/environment-variables/#local-development-with-secrets)

   <!-- markdownlint-enable MD013 -->

   > for details.

## Development

<!-- markdownlint-disable MD013 -->

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

<!-- markdownlint-enable MD013 -->

## Development Workflow

### Branching Strategy

We use a simple branching strategy:

1. Create a new branch for each feature or bug fix from the `main` branch.
1. Name your branches descriptively, e.g., `feature/add-contact-form` or
   `fix/header-layout-issue`.

   <!-- markdownlint-disable MD013 -->

   ```bash
   git checkout -b feature/your-feature-name
   ```

   <!-- markdownlint-enable MD013 -->

### Running the App Locally

To start the development server:

<!-- markdownlint-disable MD013 -->

```bash
npm run dev
```

<!-- markdownlint-enable MD013 -->

This command will also run `build:blog` and `build:page-dates` scripts. The
application will be available at `http://localhost:3000`.

### Building the App

To create a production build:

<!-- markdownlint-disable MD013 -->

```bash
npm run build
```

<!-- markdownlint-enable MD013 -->

This command ensures all necessary build steps, including blog data and page
dates generation, are executed.

### Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting.

- **Check for linting and formatting errors**:

  <!-- markdownlint-disable MD013 -->

  ```bash
  npm run lint
  npm run format:check
  ```

  <!-- markdownlint-enable MD013 -->

- **Fix linting errors automatically**:

  <!-- markdownlint-disable MD013 -->

  ```bash
  npm run lint:fix
  ```

  <!-- markdownlint-enable MD013 -->

- **Format code automatically**:

  <!-- markdownlint-disable MD013 -->

  ```bash
  npm run format
  ```

  <!-- markdownlint-enable MD013 -->

We recommend installing the

<!-- markdownlint-disable MD013 -->

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

<!-- markdownlint-enable MD013 -->

and

<!-- markdownlint-disable MD013 -->

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

<!-- markdownlint-enable MD013 -->

VS Code extensions for a better development experience.

### Type Checking

This project uses TypeScript. To check for type errors:

<!-- markdownlint-disable MD013 -->

```bash
npm run type-check
```

<!-- markdownlint-enable MD013 -->

## GitHub Copilot Support

This project includes a customized development environment for GitHub Copilot's
coding agent:

- **Pre-configured Setup**: Automatic dependency installation and project
  configuration
- **Quality Assurance**: Built-in linting, formatting, and testing
- **Development Tools**: All necessary tools pre-installed and ready to use
- **Project-Specific**: Optimized for Next.js, TypeScript, and Tailwind CSS
  workflows

The Copilot environment is configured via
`.github/workflows/copilot-setup-steps.yml` and includes:

- Node.js 22 with npm caching
- TypeScript strict mode checking
- ESLint and Prettier formatting
- Vitest testing environment
- Blog data generation and i18n support
- Cloudflare deployment tools

## Making Changes

### Code Structure Overview

A brief overview of the main directories:

- `app/`: Contains the core application logic, pages, layouts, and API routes
  using Next.js App Router.
  - `app/[locale]/`: Locale-specific pages.
  - `app/api/`: API route handlers.
- `components/`: Reusable React components.
- `content/`: Markdown files for blog posts and potentially other content.
- `lib/`: Utility functions, data handling (like `blog.ts`, `file-dates.ts`),
  and context providers.
- `messages/`: JSON files for internationalization (i18n).
- `public/`: Static assets like images and fonts.
- `scripts/`: Build scripts, e.g., for generating blog data or page dates.

### Adding New Content

#### Blog Posts

1. Create a new Markdown file (e.g., `my-new-post.md`) in the `content/blog/`
   directory.
1. Follow the frontmatter structure of existing blog posts (see
   `content/blog/template.md` if available). Essential fields usually include
   `title`, `date`, `author`, `excerpt`, and `tags`.
1. Write your content in Markdown.
1. After adding or modifying a blog post, regenerate the blog data:

   <!-- markdownlint-disable MD013 -->

   ```bash
   npm run build:blog
   ```

   <!-- markdownlint-enable MD013 -->

   This script updates `lib/blog-data.json`, which is used to list and display
   blog posts. `npm run dev` also runs this script.

#### Static Pages

This project manages "last modified" dates for static pages using Git commit
history. To add a new static page and track its last modified date:

1. Create your new page component within the `app/[locale]/` directory structure
   (e.g., `app/[locale]/new-page/page.tsx`).
1. Update the `scripts/build-page-dates.js` file:
   - Add your new page to the `pagePaths` object, mapping a key (e.g.,
     `newPage`) to its file path.
1. Update the `lib/file-dates.ts` file:
   - Add a corresponding property for your new page to the `PageDates` interface
     and the return object of the `getStaticPageDates()` function.
1. Update the TypeScript declaration file `lib/page-dates.json.d.ts` to include
   the new page key.
1. Run the script to update the dates (or rely on `npm run dev`/`build`):

   <!-- markdownlint-disable MD013 -->

   ```bash
   npm run build:page-dates
   ```

   <!-- markdownlint-enable MD013 -->

#### Internationalization (i18n)

The website supports English (`en`) and Swedish (`sv`). Text strings are managed
in JSON files:

- `messages/en.json` for English
- `messages/sv.json` for Swedish

When adding new user-facing text:

1. Add a unique key and its translation to both `en.json` and `sv.json`.
1. Use the `useTranslations` hook from `next-intl` in your components to display
   translated strings. Refer to existing components for usage examples.

### Component Development

- Create new components in the `components/` directory.
- Ensure components are well-structured, reusable, and follow React best
  practices.
- Use TypeScript for type safety.

### Styling

- Styling is primarily done using [Tailwind CSS](https://tailwindcss.com/).
- Global styles are defined in `app/globals.css`.
- Component-specific styles can be achieved using Tailwind utility classes
  directly in the JSX.

#### Blog Content Styling

The blog content uses a simplified CSS architecture designed to make
customization easy for contributors.

**Quick Start**:

1. **Base Blog Content**: All blog posts use the `.blog-content` class, which
   provides consistent styling for all content elements.
2. **Simple Customization**: Apply modifier classes to change blog appearance:

   <!-- markdownlint-disable MD013 -->

   ```tsx
   // Default styling
   <div className="blog-content prose prose-lg max-w-none">
     {content}
   </div>

   // With accent-colored headings
   <div className="blog-content blog-content-accent-headings prose prose-lg max-w-none">
     {content}
   </div>
   ```

   <!-- markdownlint-enable MD013 -->

3. **Available Modifier Classes**:
   - `.blog-content-accent-headings` - Primary color headings
   - `.blog-content-large-text` - Larger H2 headings
   - `.blog-content-spaced` - More paragraph spacing
   - `.blog-content-colorful` - Gradient blockquotes

4. **Creating Custom Modifiers**: Add new modifier classes in `app/globals.css`:

   <!-- markdownlint-disable MD013 -->

   ```css
   .blog-content-custom {
     /* Your custom styles here */
   }

   .blog-content-custom h1 {
     /* Custom H1 styling */
   }
   ```

   <!-- markdownlint-enable MD013 -->

**Key Benefits:**

- **Simple**: Easy to understand and modify
- **Maintainable**: Clean separation of concerns
- **Flexible**: Mix and match modifiers as needed
- **Consistent**: All elements styled uniformly

**Common Tasks:**

- **Change heading colors**: Use `.blog-content-accent-headings` or create a
  custom modifier
- **Adjust spacing**: Use `.blog-content-spaced` or modify paragraph margins in
  a custom class
- **Style code blocks**: Modify `.blog-content pre` and `.blog-content code`
  rules
- **Customize blockquotes**: Use `.blog-content-colorful` or create custom
  blockquote styles

The architecture is meant to be a clean and easily customizable approach.

#### Easy Customization Examples

To make all H2 headings larger:

<!-- markdownlint-disable MD013 -->

```css
.blog-content-large-text h2 {
  @apply text-4xl;
}
```

```tsx
<div className="blog-content blog-content-large-text prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

To make headings use the primary color:

<!-- markdownlint-disable MD013 -->

```css
.blog-content-accent-headings h1,
.blog-content-accent-headings h2,
.blog-content-accent-headings h3 {
  @apply text-primary-600 dark:text-primary-400;
}
```

```tsx
<div className="blog-content blog-content-accent-headings prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

To add more space between paragraphs:

<!-- markdownlint-disable MD013 -->

```css
.blog-content-spaced p {
  @apply mb-8;
}
```

```tsx
<div className="blog-content blog-content-spaced prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

To make blockquotes more visually appealing:

<!-- markdownlint-disable MD013 -->

```css
.blog-content-colorful blockquote {
  @apply bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-l-8 border-primary-500;
}
```

```tsx
<div className="blog-content blog-content-colorful prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

#### Changing Heading Colors

1. Open `app/globals.css`
2. Find the `.blog-content h1, .blog-content h2, ...` section
3. Modify the `@apply` directive:

<!-- markdownlint-disable MD013 -->

```css
.blog-content h1,
.blog-content h2,
.blog-content h3 {
  @apply text-red-600 dark:text-red-400 font-bold scroll-mt-24; /* Changed to red */
}
```

<!-- markdownlint-enable MD013 -->

#### Changing Code Block Styling

To change code block background:

<!-- markdownlint-disable MD013 -->

```css
.blog-content pre {
  @apply bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-6; /* Terminal style */
}
```

<!-- markdownlint-enable MD013 -->

#### Changing Link Colors

To change link styling:

<!-- markdownlint-disable MD013 -->

```css
.blog-content a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 no-underline hover:underline; /* Blue links with hover underline */
}
```

<!-- markdownlint-enable MD013 -->

#### Adding Custom Typography

To add different font weights or sizes:

<!-- markdownlint-disable MD013 -->

```css
.blog-content h1 {
  @apply text-5xl font-black mb-8 mt-10; /* Larger, bolder H1 */
}

.blog-content p {
  @apply mb-6 text-lg; /* Larger paragraph text */
}
```

<!-- markdownlint-enable MD013 -->

#### Creating Blog Variations

You can now easily create different blog post styles by combining modifiers:

##### Modern Tech Blog Style

<!-- markdownlint-disable MD013 -->

```tsx
<div className="blog-content blog-content-accent-headings blog-content-large-text prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

##### Spacious Reading Style

<!-- markdownlint-disable MD013 -->

```tsx
<div className="blog-content blog-content-spaced prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

##### Colorful Feature Style

<!-- markdownlint-disable MD013 -->

```tsx
<div className="blog-content blog-content-colorful blog-content-accent-headings prose prose-lg max-w-none">
```

<!-- markdownlint-enable MD013 -->

#### Syntax Highlighting

The blog system includes automatic syntax highlighting for code blocks using
Prism.js. This feature works with 200+ programming languages and automatically
adapts to the current theme.

**Using Syntax Highlighting:**

1. **Standard Code Blocks**: Simply use triple backticks with a language
   identifier:

   <!-- markdownlint-disable MD013 -->

   ````markdown
   ```javascript
   const greeting = 'Hello, World!'
   console.log(greeting)
   ```
   ````

   ```powershell
   Get-Process | Where-Object { $_.CPU -gt 100 }
   ```

   <!-- markdownlint-enable MD013 -->

2. **Supported Languages**: The system supports all major programming languages,
   including:
   - **PowerShell** (`powershell`, `ps1`)
   - **JavaScript/TypeScript** (`javascript`, `typescript`, `js`, `ts`)
   - **Python** (`python`, `py`)
   - **Bash/Shell** (`bash`, `shell`, `sh`)
   - **HTML/CSS** (`html`, `css`)
   - **JSON/YAML** (`json`, `yaml`)
   - And many more...

3. **Theme Integration**: Syntax highlighting automatically adapts to light/dark
   themes using the same color palette as the rest of the site.

4. **Language Labels**: Code blocks automatically display language labels in the
   top-right corner for better readability.

**Customizing Syntax Highlighting:**

The syntax highlighting styles are defined in `app/prism-theme.css`. The
implementation:

- Uses the Tailwind CSS color palette for consistency
- Preserves existing blog content backgrounds
- Supports both light and dark themes
- Includes PowerShell-specific token styling

To modify syntax highlighting colors:

<!-- markdownlint-disable MD013 -->

```css
/* Light theme colors */
.token.keyword {
  color: #2563eb; /* blue-600 */
}

/* Dark theme colors */
.dark .token.keyword {
  color: #60a5fa; /* blue-400 */
}
```

<!-- markdownlint-enable MD013 -->

**Technical Implementation:**

- **Server-side processing**: Syntax highlighting is applied during the build
  process using `rehype-prism-plus`
- **Build script**: Code highlighting is handled in `scripts/build-blog-data.js`
- **HTML sanitization**: Updated to allow syntax highlighting classes and spans
- **Performance**: No client-side JavaScript required for syntax highlighting
- **Copy functionality**: Each code block includes a copy-to-clipboard button
  for easy code sharing

**Copy-to-Clipboard Feature:**

All code blocks automatically include a copy button in the top-right corner that
allows readers to quickly copy code snippets. The feature:

- Uses the modern `navigator.clipboard.writeText()` API with fallback support
- Provides visual feedback when content is copied
- Includes hover tooltips for better accessibility
- Automatically positions alongside language labels
- Works with all supported programming languages

The implementation ensures fast loading times and consistent rendering across
all devices.

#### GitHub-Style Alerts

The blog system supports GitHub-style alerts for special content callouts. These
provide visual emphasis with distinct colors and icons:

**Using GitHub Alerts:**

<!-- markdownlint-disable MD013 -->

```markdown
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

<!-- markdownlint-enable MD013 -->

**Alert Types:**

- **NOTE** (Blue with info icon): General information and explanations
- **TIP** (Green with lightbulb icon): Helpful suggestions and best practices
- **IMPORTANT** (Purple with speech bubble icon): Critical information for
  success
- **WARNING** (Orange with triangle icon): Potential risks and cautions
- **CAUTION** (Red with octagon icon): Dangerous operations or breaking changes

**When to Use:**

- Use GitHub alerts for content that needs special attention
- Use regular blockquotes for quotes, citations, and general emphasis
- Choose the alert type based on the urgency and type of information

The alerts are processed during the build phase and include proper semantic HTML
for accessibility.

## Brand Guidelines & Visual Style Guide

When contributing to Viscalyx.se, it's important to follow our brand guidelines
and visual style guide to maintain consistency across the website. Our brand
assets and style guidelines will be documented in the `/docs` directory once
created. When making design-related changes, follow the guidelines below.

> **Note**: The `docs/` directory with brand asset files
> (`brand-assets-readme.md`, `brand-style-guide.md`, `brand-usage-examples.md`)
> is planned but does not exist yet.

**Key Points:**

- Always reference the brand guidelines when adding new visual elements
- Maintain consistency with existing color schemes and typography
- Follow the documented spacing and layout principles
- Ensure any new design elements align with our visual identity
- When in doubt, check the style guide or ask for guidance in your PR

## Submitting Contributions

### Commit Messages

Please follow these general guidelines for commit messages:

- Keep them concise and descriptive.
- Use the present tense (e.g., "Add feature" not "Added feature").
- If your changes address a specific issue, reference it in the commit message
  (e.g., `fix: resolve issue #123`).
- Consider following the
  [Conventional Commits](https://www.conventionalcommits.org/) specification for
  more structured commit messages, though it's not strictly enforced.

Example:

<!-- markdownlint-disable MD013 -->

```text
feat: add user profile page
```

```text
fix: correct typo in contact form validation
```

```text
docs: update contributing guidelines for blog posts
```

<!-- markdownlint-enable MD013 -->

### Pull Request (PR) Process

1. Ensure your local branch is up-to-date with the `main` branch of the upstream
   repository.
1. Push your changes to your forked repository.

   <!-- markdownlint-disable MD013 -->

   ```bash
   git push origin feature/your-feature-name
   ```

   <!-- markdownlint-enable MD013 -->

1. Go to the original `viscalyx.se` repository on GitHub and create a new Pull
   Request from your forked branch.
1. Provide a clear title and description for your PR:
   - Summarize the changes made.
   - Explain the "why" behind your changes.
   - Link to any relevant issues (e.g., "Closes #123").
1. Ensure all automated checks (GitHub Actions for linting, spell check, build,
   etc.) pass. If they fail, please address the issues in your branch.

### Code Review

- Once a PR is submitted, project maintainers will review your changes.
- Be prepared to discuss your changes and make adjustments based on feedback.
- After approval and all checks pass, your PR will be merged.

## Dev Container Setup & Requirements

This project uses VS Code Dev Containers to provide a consistent, cross-platform
development environment. The devcontainer automatically handles all
dependencies, tools, and configuration.

### Cross-Platform Compatibility

The devcontainer is designed to work seamlessly on Linux, macOS, and Windows.
The configuration includes a fallback mechanism for SSH agent forwarding:

<!-- markdownlint-disable MD013 -->

```jsonc
"mounts": [
  {
    "source": "${localEnv:SSH_AUTH_SOCK:${localEnv:HOME:${localEnv:USERPROFILE}}/.ssh-agent-fallback.sock}",
    "target": "/ssh-agent.sock",
    "type": "bind"
  }
]
```

<!-- markdownlint-enable MD013 -->

This uses `SSH_AUTH_SOCK` if available, or falls back to a platform-specific
path using `HOME` (Linux/macOS) or, if `HOME` is unset, `USERPROFILE` (Windows),
joined with `/.ssh-agent-fallback.sock`.

### Prerequisites by Platform

#### All Platforms (Common)

1. **Docker Desktop** (or Docker Engine + Docker Compose)
   - Minimum version: Docker 20.10+
   - Download:

     <!-- markdownlint-disable MD013 -->

     [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

     <!-- markdownlint-enable MD013 -->

2. **VS Code**
   - Extension: **Dev Containers** (`ms-vscode-remote.remote-containers`)

3. **Git**
   - Configured with username and email

#### Ubuntu-Specific Setup

**Docker Installation:**

<!-- markdownlint-disable MD013 -->

```bash
# 1. Set up Docker's apt repository
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "\${UBUNTU_CODENAME:-\$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# 2. Install Docker Engine
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Add your user to the docker group (avoid using sudo)
sudo usermod -aG docker $USER
newgrp docker  # or logout/login

# 4. Verify Docker works without sudo
docker run hello-world
```

<!-- markdownlint-enable MD013 -->

> **Note:** For other Linux distributions, operating systems or manual installation
> methods, see the [official Docker installation docs](https://docs.docker.com/engine/install/).

**SSH Agent Setup:**

<!-- markdownlint-disable MD013 -->

```bash
# 1. Start SSH agent automatically (add to ~/.bashrc or ~/.zshrc)
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)"
fi

# 2. Add your SSH key to the agent
ssh-add ~/.ssh/id_rsa  # or your specific key file
# Or for ed25519:
ssh-add ~/.ssh/id_ed25519

# 3. Verify SSH agent is running
echo $SSH_AUTH_SOCK
# Should output something like: /tmp/ssh-XXXXXXX/agent.XXXXX
```

<!-- markdownlint-enable MD013 -->

#### macOS-Specific Setup

**Docker Desktop Configuration:**

1. Install Docker Desktop for Mac
2. In Docker Desktop Preferences:
   - **Resources > File Sharing**: Ensure your project directory is shared
   - **Resources > Advanced**: Allocate at least 4GB RAM, 2 CPUs
   - **General**: Enable appropriate settings for your Mac architecture

**SSH Agent Setup:**

<!-- markdownlint-disable MD013 -->

```bash
# 1. macOS has SSH agent built-in, configure it for persistence
# Add to ~/.ssh/config:
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa  # or your key file

# 2. Add key to macOS Keychain (one-time)
ssh-add --apple-use-keychain ~/.ssh/id_rsa

# 3. Verify SSH agent
echo $SSH_AUTH_SOCK
# Should output: /private/tmp/com.apple.launchd.XXXXXXXXX/Listeners
```

<!-- markdownlint-enable MD013 -->

**Performance Note:** macOS uses a VM for Docker. The `:cached` mount option in
docker-compose.yml helps optimize file system performance.

#### Windows-Specific Setup

**Prerequisites:**

- Windows 10/11 (Pro, Enterprise, or Education for Hyper-V)
- WSL 2 (Windows Subsystem for Linux 2)

**WSL 2 Installation:**

<!-- markdownlint-disable MD013 -->

```powershell
# In PowerShell as Administrator:

# 1. Enable WSL 2
wsl --install

# 2. Set WSL 2 as default
wsl --set-default-version 2

# 3. Install a Linux distribution (e.g., Ubuntu)
wsl --install -d Ubuntu

# 4. Verify WSL 2
wsl --list --verbose
# Should show VERSION 2
```

<!-- markdownlint-enable MD013 -->

**Docker Desktop for Windows:**

1. Install Docker Desktop for Windows
2. During installation:
   - Enable "Use WSL 2 instead of Hyper-V"
   - Enable "Install required Windows components for WSL 2"
3. In Docker Desktop Settings:
   - **General**: "Use the WSL 2-based engine" (checked)
   - **Resources > WSL Integration**: Enable for your WSL distro

**SSH Agent Setup (Choose One Option):**

**Option A: Windows OpenSSH Agent** (Recommended)

<!-- markdownlint-disable MD013 -->

```powershell
# In PowerShell as Administrator:

# 1. Enable and start SSH agent service
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# 2. Add your SSH key
ssh-add $env:USERPROFILE\.ssh\id_rsa

# 3. Configure Git to use Windows SSH
git config --global core.sshCommand "C:/Windows/System32/OpenSSH/ssh.exe"
```

<!-- markdownlint-enable MD013 -->

**Option B: SSH Agent in WSL**

<!-- markdownlint-disable MD013 -->

```bash
# In WSL terminal:

# 1. Add to ~/.bashrc or ~/.zshrc
if [ -z "$SSH_AUTH_SOCK" ]; then
  export SSH_AUTH_SOCK="$HOME/.ssh/agent.sock"
  if [ ! -S "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -a $SSH_AUTH_SOCK)" > /dev/null
  fi
fi

# 2. Add SSH key
ssh-add ~/.ssh/id_rsa
```

<!-- markdownlint-enable MD013 -->

**Git Line Endings Configuration:**

<!-- markdownlint-disable MD013 -->

```bash
# In WSL, configure Git line endings
git config --global core.autocrlf input
git config --global core.eol lf
```

<!-- markdownlint-enable MD013 -->

### Verifying Your Setup

After completing the platform-specific setup, verify everything works:

<!-- markdownlint-disable MD013 -->

```bash
# 1. Test SSH agent
ssh-add -l
# Should list your SSH keys

# 2. Test Docker
docker run hello-world

# 3. Test Docker Compose
docker compose version

# 4. Open project in VS Code
code .

# 5. VS Code should prompt to "Reopen in Container"
#    Or use Command Palette: "Dev Containers: Reopen in Container"
```

<!-- markdownlint-enable MD013 -->

### Troubleshooting

**SSH Agent Not Working:**

If SSH agent forwarding doesn't work after setup:

1. **Verify environment variable:**

   <!-- markdownlint-disable MD013 -->

   ```bash
   echo $SSH_AUTH_SOCK
   ```

   <!-- markdownlint-enable MD013 -->

   Should show a valid path.

2. **Check SSH keys are added:**

   <!-- markdownlint-disable MD013 -->

   ```bash
   ssh-add -l
   ```

   <!-- markdownlint-enable MD013 -->

3. **Fallback option** (if still not working): Use HTTPS instead of SSH for Git
   operations, or configure personal access tokens.

**Container Build Fails:**

- Ensure Docker Desktop is running
- Check Docker has sufficient resources (CPU/RAM)
- Try rebuilding: Command Palette → "Dev Containers: Rebuild Container"

**Platform Architecture Issues:**

- The setup automatically detects ARM64 (Apple Silicon) vs AMD64
- If you encounter issues, try: `docker buildx create --use`

**Permission Issues:**

- The container uses a non-root user for security
- All file permissions are handled automatically
- On Windows, ensure Docker Desktop has proper file sharing permissions

**Performance Issues on macOS/Windows:**

- Increase Docker Desktop resource allocation
- On macOS, ensure VirtioFS is enabled for better performance
- On Windows, ensure WSL 2 integration is enabled

**Slow Builds on Windows:**

- Ensure WSL2 is enabled
- Consider using WSL2 backend for Docker Desktop
- Place project files in WSL2 filesystem for better performance

**npm Command Not Found:**

- The Node.js feature installs Node via nvm. If `postCreateCommand` fails, try
  rebuilding: "Dev Containers: Rebuild Container"
- As a workaround, you can manually run `npm install` after the container starts

**npm Permission Errors (EACCES):**

- `node_modules` are stored in the workspace bind mount with proper `vscode`
  user ownership
- If you encounter permission errors, try rebuilding the container:
  "Dev Containers: Rebuild Container"

**Port Conflicts:**

- Default ports (3000, 3001, 8787, 51204) can be changed in
  `docker-compose.yml`
- VS Code will automatically forward ports and notify you

**Extensions Not Loading:**

- Wait for the container to fully initialize
- Check the "Output" panel for extension installation logs
- Some extensions require a reload: "Developer: Reload Window"

**Git Configuration:**

- Git is pre-configured with safe defaults
- You may need to set your `user.name` and `user.email`:

  <!-- markdownlint-disable MD013 -->

  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

  <!-- markdownlint-enable MD013 -->

### What's Included in the Dev Container

The devcontainer automatically provides:

- **Node.js 24 LTS** (Ubuntu base)
- **Git** with safe directory configuration
- **GitHub CLI** (`gh`) pre-installed
- **Zsh** with Oh My Zsh configuration
- **All VS Code extensions** listed in `.devcontainer/devcontainer.json`
- **Configured settings** for formatting, linting, and spell checking
- **Port forwarding** for Next.js (3000, 3001), Wrangler (8787), and Vitest UI
  (51204)
- **Automatic npm install** on container creation

You don't need to manually install any of these tools!

### GitHub CLI Authentication

The GitHub CLI (`gh`) is pre-installed in the devcontainer but needs to be
authenticated after each container rebuild. The easiest and most secure method
is the browser-based OAuth flow with the `--clipboard` flag.

#### Authenticate via browser (recommended)

<!-- markdownlint-disable MD013 -->

```bash
gh auth login --web --clipboard --hostname github.com --git-protocol ssh
```

<!-- markdownlint-enable MD013 -->

This will:

1. Copy a one-time OAuth device code to your clipboard automatically.
2. Open a browser on your host (or print a URL to open manually).
3. Paste the code in the browser and authorize the GitHub CLI.

No token ever appears in your terminal, shell history, or environment variables.

#### Alternative: Paste a PAT manually

If you prefer to use a Personal Access Token (e.g., from a password vault),
use `read -rs` so the token never appears on screen or in shell history:

<!-- markdownlint-disable MD013 -->

```bash
printf 'Paste your GitHub PAT and press Enter: '
read -rs GH_TOKEN && echo
printf '%s' "$GH_TOKEN" | gh auth login --with-token --hostname github.com --git-protocol ssh
unset GH_TOKEN
```

<!-- markdownlint-enable MD013 -->

> **Why this is secure:**
>
> - `read -rs` disables terminal echo (`-s`) so the token is not visible on
>   screen, and reads raw input (`-r`) so backslashes are not interpreted.
> - The variable assignment via `read` is a shell built-in — it is **not**
>   recorded in shell history (unlike `export VAR=value` on the command line).
> - `printf` pipes the value via stdin; the token never appears as a command-line
>   argument (which would be visible in `ps` output and history).
> - `unset` removes the variable from the shell session immediately after use.

#### Verify authentication

```bash
gh auth status
```

#### Re-authentication

You only need to re-authenticate after a **container rebuild**. Normal
container stops and starts preserve the `gh` auth state.

## Spell Checking Setup

This project uses [Code Spell Checker (cspell)](https://cspell.org/) for
automated spell checking across all code files, markdown content, and
documentation.

### Configuration

#### VS Code Integration

- **Extension**: Code Spell Checker is configured in `.vscode/settings.json`
- **Real-time checking**: Spelling errors are highlighted as you type
- **Custom dictionary**: Technical terms are pre-configured in `.cspell.jsonc`

#### Files Checked

- TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`, `.jsx`)
- Markdown files (`.md`)
- JSON configuration files
- YAML files

#### Custom Dictionary

The `.cspell.jsonc` file includes:

- Company names (Viscalyx, etc.)
- Technical terms (DevOps, Kubernetes, PowerShell DSC, etc.)
- Framework names (Next.js, React, Azure, AWS, etc.)
- Common abbreviations and acronyms

### Usage

#### NPM Scripts

<!-- markdownlint-disable MD013 -->

```bash
# Check all files for spelling errors
npm run spell:check

# Interactive spell checking with suggestions
npm run spell:fix

# Check specific files
npx cspell "app/**/*.tsx"
```

<!-- markdownlint-enable MD013 -->

#### VS Code Commands

- `Ctrl/Cmd + Shift + P` → "Spell: Add Words to Dictionary"
- Right-click on misspelled word → "Add to Dictionary"
- `F1` → "Spell: Check Current Document"

#### Adding New Words

1. **VS Code**: Right-click on the word → "Add to User Dictionary" or "Add to
   Workspace Dictionary"
2. **Manual**: Add words to the `words` array in `.cspell.jsonc`
3. **Project-specific**: Words added via VS Code are automatically saved to
   `.cspell.jsonc`

### Automation

#### GitHub Actions

- Spell checking runs automatically on all pull requests
- Builds fail if spelling errors are found
- Comments are added to PRs with spelling issues

#### Pre-commit Integration (Optional)

To add spell checking to pre-commit hooks, add this to your pre-commit script:

<!-- markdownlint-disable MD013 -->

```bash
#!/bin/sh
npm run spell:check
if [ $? -ne 0 ]; then
  echo "❌ Spell check failed. Please fix spelling errors before committing."
  exit 1
fi
```

<!-- markdownlint-enable MD013 -->

### Ignoring False Positives

#### Temporary Ignore

Add `// cspell:disable-next-line` above the line with the "misspelled" word:

<!-- markdownlint-disable MD013 -->

```typescript
// cspell:disable-next-line
const specialTechnicalTerm = \'someUniqueApiName\'
```

<!-- markdownlint-enable MD013 -->

#### Ignore Entire File

Add to the top of the file:

<!-- markdownlint-disable MD013 -->

```text
// cspell:disable
```

<!-- markdownlint-enable MD013 -->

#### Ignore Specific Words in File

<!-- markdownlint-disable MD013 -->

```typescript
// cspell:ignore specialword anothertechterm
```

<!-- markdownlint-enable MD013 -->

### Configuration Details

#### Ignored Patterns

The spell checker automatically ignores:

- URLs and email addresses
- Hexadecimal color codes
- UUIDs
- CSS measurements (px, rem, em, %)
- Import/require statements
- Code blocks in markdown
- File paths and technical identifiers

#### File Exclusions

- `node_modules/`
- `.next/` and build directories
- Lock files (`package-lock.json`, `yarn.lock`)
- Binary and generated files

### Troubleshooting

#### Common Issues

1. **False Positives**: Add legitimate technical terms to `.cspell.jsonc`
2. **Performance**: Adjust `checkLimit` in `.cspell.jsonc` for large files
3. **Languages**: Add language-specific dictionaries if needed

#### Debugging

<!-- markdownlint-disable MD013 -->

```bash
# Verbose output to see what\'s being checked
npx cspell "**/*.md" --verbose

# Check a specific file with full details
npx cspell app/page.tsx --show-context --show-suggestions
```

<!-- markdownlint-enable MD013 -->

### Language Extensions

This project supports multi-language spell checking:

#### Swedish Support

Swedish spell checking is enabled for:

- Files matching the `**/dictionaries/sv.ts` pattern (if the file is created in
  the future)
- Files with `sv` in the filename (e.g., `messages/sv.json`)
- Files with `swedish` in the filename

The configuration includes:

<!-- markdownlint-disable MD013 -->

```bash
npm install --save-dev @cspell/dict-sv
```

<!-- markdownlint-enable MD013 -->

Configuration in `.cspell.jsonc`:

<!-- markdownlint-disable MD013 -->

```json
{
  "dictionaries": ["sv"],
  "overrides": [
    {
      "filename": "**/dictionaries/sv.ts",
      "language": "sv",
      "dictionaries": ["sv", "en"]
    }
  ]
}
```

<!-- markdownlint-enable MD013 -->

#### Additional Language Support

For other languages, install additional dictionaries:

<!-- markdownlint-disable MD013 -->

```bash
npm install --save-dev @cspell/dict-spanish @cspell/dict-french
```

<!-- markdownlint-enable MD013 -->

Then add to `.cspell.jsonc`:

<!-- markdownlint-disable MD013 -->

```json
{
  "dictionaries": ["spanish", "french"]
}
```

<!-- markdownlint-enable MD013 -->

### Best Practices

1. **Review before adding**: Don\'t blindly add misspelled words to the
   dictionary
2. **Keep dictionary clean**: Periodically review custom words
3. **Use consistent naming**: Follow project conventions for technical terms
4. **Document decisions**: Add comments in `.cspell.jsonc` for unusual words
5. **Team alignment**: Ensure all team members use the same VS Code settings

## Cloudflare Scripts Documentation

This document describes the Cloudflare-specific scripts in `package.json` that
enable deployment to Cloudflare Workers using the OpenNext adapter.

### Scripts Overview

#### `preview`

<!-- markdownlint-disable MD013 -->

```bash
npm run preview
```

<!-- markdownlint-enable MD013 -->

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare preview`

**Purpose**: Tests and previews your Next.js application using the Cloudflare
adapter in a local environment that simulates the Cloudflare Workers runtime.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers using the
   OpenNext adapter
2. **Preview**: Starts a local server that mimics the Cloudflare Workers
   environment

**When to use**:

- Before deploying to production to ensure your app works correctly in the
  Cloudflare Workers environment
- For integration testing with Cloudflare-specific features
- To verify that your application behaves correctly with the OpenNext adapter

**Difference from `dev`**:

- `npm run dev` uses the Next.js development server for fast development
- `npm run preview` uses the Cloudflare adapter to simulate the production
  environment

#### `deploy`

<!-- markdownlint-disable MD013 -->

```bash
npm run deploy
```

<!-- markdownlint-enable MD013 -->

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`

**Purpose**: Builds and deploys your Next.js application to Cloudflare Workers.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers
2. **Deploy**: Uploads and deploys the application to your Cloudflare Workers
   environment

**Deployment targets**:

- `*.workers.dev` subdomain (default)
- Custom domain (if configured)

**Requirements**:

- Wrangler CLI must be authenticated with Cloudflare
- Proper `wrangler.jsonc` configuration file

#### `cf-typegen`

<!-- markdownlint-disable MD013 -->

```bash
npm run cf-typegen
```

<!-- markdownlint-enable MD013 -->

**Command**:
`wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts`

**Purpose**: Generates TypeScript type definitions for Cloudflare environment
variables and bindings.

**What it does**:

- Creates a `cloudflare-env.d.ts` file with TypeScript interfaces
- Provides type safety for Cloudflare-specific environment variables
- Includes types for bindings like R2, KV, D1, etc.

**When to use**:

- After adding new environment variables in `wrangler.jsonc`
- When setting up new Cloudflare bindings
- To maintain type safety in TypeScript projects

### Testing Workflow

Use the standard Next.js development server for the best developer experience
with hot reloading.

#### Testing with Cloudflare Environment

<!-- markdownlint-disable MD013 -->

```bash
npm run preview
```

<!-- markdownlint-enable MD013 -->

Test your application in an environment that simulates Cloudflare Workers before
deploying.

#### Production Deployment

<!-- markdownlint-disable MD013 -->

```bash
npm run deploy
```

<!-- markdownlint-enable MD013 -->

Deploy your application to Cloudflare Workers.

#### Type Generation

<!-- markdownlint-disable MD013 -->

```bash
npm run cf-typegen
```

<!-- markdownlint-enable MD013 -->

Generate TypeScript types for Cloudflare bindings and environment variables.

### Configuration Files

These scripts work in conjunction with:

- **`wrangler.jsonc`**: Cloudflare Workers configuration
- **`open-next.config.ts`**: OpenNext adapter configuration
- **`cloudflare-env.d.ts`**: Generated TypeScript types (created by
  `cf-typegen`)

### Required Dependencies

The following packages enable these scripts:

<!-- markdownlint-disable MD013 -->

```json
{
  "dependencies": {
    "@opennextjs/cloudflare": "^1.16.3"
  },
  "devDependencies": {
    "wrangler": "^4.63.0"
  }
}
```

<!-- markdownlint-enable MD013 -->

### Additional Resources

<!-- markdownlint-disable MD013 -->

- [Cloudflare Next.js Guide](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)

<!-- markdownlint-enable MD013 -->

- [OpenNext Documentation](https://opennext.js.org/cloudflare)

<!-- markdownlint-disable MD013 -->

- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

<!-- markdownlint-enable MD013 -->

## Security Testing

### Dependency Auditing

You can audit updated dependency versions before installing them by generating a
lockfile only and running both `npm audit` and Snyk:

1. Generate or update only the lockfile (without installing packages):

   <!-- markdownlint-disable MD013 -->

   ```bash
   npm install --package-lock-only
   ```

   <!-- markdownlint-enable MD013 -->

2. Run `npm audit` (omit dev dependencies if desired):

   <!-- markdownlint-disable MD013 -->

   ```bash
   npm audit
   ```

   <!-- markdownlint-enable MD013 -->

3. Run a Snyk security test against your `package.json`:

   <!-- markdownlint-disable MD013 -->

   ```bash
   npx snyk auth
   npx snyk test --file=package.json
   ```

   <!-- markdownlint-enable MD013 -->

4. Once finished, restore your original lockfile and install as usual:

   <!-- markdownlint-disable MD013 -->

   ```bash
   git restore package-lock.json
   npm install
   ```

   <!-- markdownlint-enable MD013 -->

This section explains the security testing approach for the blog data generation
process, which handles regular security audits of the build-time sanitization
process.

### Security Overview

The blog data build process (`scripts/build-blog-data.js`) uses the
`sanitize-html` library to prevent XSS attacks by sanitizing HTML content
generated from Markdown. To ensure this sanitization continues to work
effectively, we have implemented comprehensive security testing.

### Security Test Components

<!-- markdownlint-disable MD013 -->

#### 1. Sanitization Security Tests (`scripts/__tests__/build-blog-data-sanitization.test.js`)

<!-- markdownlint-enable MD013 -->

These tests verify that the sanitization configuration properly prevents XSS
attacks while preserving legitimate content:

##### XSS Prevention Tests

- **Script Tag Removal**: Ensures `<script>` tags and their content are
  completely removed
- **Event Handler Removal**: Removes dangerous event handlers like `onclick`,
  `onload`, etc.
- **JavaScript URL Prevention**: Blocks `javascript:` URLs in links and other
  attributes
- **Style Tag Removal**: Removes `<style>` tags and inline styles that could
  contain malicious code
- **Iframe/Embed Blocking**: Prevents potentially dangerous embedded content
- **Data Attribute Handling**: Verifies data attributes are handled safely

##### Content Preservation Tests

- **Basic HTML Formatting**: Ensures standard HTML tags like `<h1>`, `<p>`,
  `<strong>`, `<em>` are preserved
- **Syntax Highlighting**: Verifies that code syntax highlighting classes and
  attributes are maintained
- **Table of Contents**: Ensures heading IDs for navigation are preserved
- **Safe Links**: Confirms that legitimate URLs (https, mailto, relative paths)
  work correctly
- **Image Handling**: Documents the current restrictive image policy

##### Edge Case Testing

- **Empty Content**: Handles null, undefined, and empty strings safely
- **Malformed HTML**: Gracefully processes badly formed HTML
- **Large Content**: Handles very long content without performance issues

<!-- markdownlint-disable MD013 -->

#### 2. Integration Security Tests (`scripts/__tests__/build-blog-data-integration.test.js`)

<!-- markdownlint-enable MD013 -->

These tests run the actual build script with malicious content to verify
end-to-end security:

##### Full Build Process Testing

- **Malicious Content Removal**: Creates actual blog posts with XSS attempts and
  verifies they're sanitized
- **Syntax Highlighting Preservation**: Ensures code blocks maintain their
  highlighting after processing
- **Multiple Post Handling**: Tests that sanitization works consistently across
  multiple posts
- **Reading Time Calculation**: Verifies that malicious content doesn't affect
  reading time calculations

#### 3. Security Audit Script (`scripts/security-audit.js`)

A convenient script that runs all security tests and provides a comprehensive
report:

<!-- markdownlint-disable MD013 -->

```bash
npm run test:security
```

<!-- markdownlint-enable MD013 -->

This script:

- Runs all sanitization tests
- Runs all integration tests
- Provides a detailed security audit summary
- Fails the build if any security tests fail

### Running Security Tests

#### Individual Test Suites

<!-- markdownlint-disable MD013 -->

```bash
# Run sanitization tests only
npx jest scripts/__tests__/build-blog-data-sanitization.test.js

# Run integration tests only
npx jest scripts/__tests__/build-blog-data-integration.test.js
```

<!-- markdownlint-enable MD013 -->

#### Full Security Audit

<!-- markdownlint-disable MD013 -->

```bash
npm run test:security
```

<!-- markdownlint-enable MD013 -->

#### As Part of CI/CD

The security tests are included in the main `check` script:

<!-- markdownlint-disable MD013 -->

```bash
npm run check  # Includes type-check, formatting, linting, tests, and security audit
```

<!-- markdownlint-enable MD013 -->

### Security Configuration

#### Current Sanitization Rules

The build script uses these sanitization options:

<!-- markdownlint-disable MD013 -->

```javascript
const sanitizeOptions = {
  ...sanitizeHtml.defaults,
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    // Table of contents navigation
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    // Syntax highlighting
    code: ['class'],
    pre: ['class', 'data-language'],
    span: ['class'],
    div: ['class'],
    // Prism.js data attributes
    '*': ['data-*'],
  },
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'span', // Required for syntax highlighting
  ],
}
```

<!-- markdownlint-enable MD013 -->

#### Notable Security Decisions

1. **No Image Tags**: The current configuration does NOT allow `<img>` tags, as
   images are likely handled through other mechanisms
2. **Data Attributes Allowed**: While `data-*` attributes are allowed, they
   cannot execute JavaScript directly
3. **Restricted Tag Set**: Only a curated set of HTML tags are allowed, blocking
   dangerous ones like `<script>`, `<iframe>`, `<object>`, etc.

### Security Recommendations

#### Regular Maintenance

1. **Update Dependencies**: Keep `sanitize-html` updated to latest version
2. **Review New Attack Vectors**: Periodically review OWASP XSS prevention
   guidelines
3. **Monitor Test Results**: Any test failures should be investigated
   immediately
4. **Audit Configuration**: Review the sanitization configuration when adding
   new features

#### Adding New Content Types

When adding new content types or HTML features:

1. Add corresponding security tests first
2. Update the sanitization configuration carefully
3. Verify that legitimate content is preserved
4. Ensure malicious variants are properly blocked
5. Run the full security audit

#### CI/CD Integration

Ensure that:

- Security tests run on every commit
- Builds fail if security tests fail
- Security audit results are preserved for review
- Dependencies are scanned for vulnerabilities

### Troubleshooting Security Tests

#### Test Failures

If security tests fail:

1. **Check Recent Changes**: Review recent modifications to the build script or
   sanitization config
2. **Verify Dependencies**: Ensure `sanitize-html` and related packages are
   up-to-date
3. **Review Error Messages**: Test failures indicate specific security
   vulnerabilities
4. **Test Manually**: Create test blog posts with suspicious content to verify
   behavior

#### Performance Issues

If tests are slow:

1. **Check Content Size**: Exceptionally large test content can slow down
   processing
2. **Review Complexity**: Deeply nested HTML can cause performance issues
3. **Monitor Resources**: Integration tests create temporary files and
   directories

#### False Positives

If legitimate content is being over-sanitized:

1. **Review Sanitization Config**: May need to allow additional tags or
   attributes
2. **Update Test Expectations**: Ensure tests match the actual desired behavior
3. **Consider Alternatives**: Some content might need different handling
   mechanisms

## Page Dates Management

This document explains how page last modified dates are managed in the sitemap
and individual pages.

### Overview

The application uses actual Git commit dates for static pages instead of always
using the current date (`new Date()`). This improves SEO accuracy by providing
real last modified timestamps.

### How It Works

#### 1. Build Script (`scripts/build-page-dates.js`)

- Reads Git history to find the last commit date for each static page
- Generates `lib/page-dates.json` with ISO date strings
- Runs during the build process via `npm run build:page-dates`

#### 2. Data File (`lib/page-dates.json`)

- Contains last modified dates for all static pages
- Format: `{ "pageName": "2025-06-01T09:37:24.000Z" }`
- Generated automatically, not manually edited

#### 3. Utility Function (`lib/file-dates.ts`)

- Exports `getStaticPageDates()` function
- Reads from `page-dates.json` and converts to Date objects
- Works in all environments including Cloudflare Workers

#### 4. Usage

**In Sitemap (`app/sitemap.ts`):**

<!-- markdownlint-disable MD013 -->

```typescript
const staticPageDates = getStaticPageDates()
// Use staticPageDates.privacy, staticPageDates.terms, etc.
```

<!-- markdownlint-enable MD013 -->

**In Pages (`app/[locale]/privacy/page.tsx`, etc.):**

<!-- markdownlint-disable MD013 -->

```typescript
const staticPageDates = getStaticPageDates()
// Use format.dateTime(staticPageDates.privacy, {...})
```

<!-- markdownlint-enable MD013 -->

### Build Process Integration

The page dates are built automatically as part of:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run deploy`

### Manual Update

To manually update page dates:

<!-- markdownlint-disable MD013 -->

```bash
npm run build:page-dates
```

<!-- markdownlint-enable MD013 -->

### Tracked Pages

- **home**: `app/[locale]/page.tsx`
- **blog**: `app/[locale]/blog/page.tsx`
- **privacy**: `app/[locale]/privacy/page.tsx`
- **terms**: `app/[locale]/terms/page.tsx`

### Benefits

1. **SEO Accuracy**: Real last modified dates instead of current date
2. **Environment Compatibility**: Works in Cloudflare Workers and other
   serverless environments
3. **Automatic Updates**: Dates update when files are actually modified
4. **Build-time Generation**: No runtime Git commands or file system access
   needed

### Adding New Pages

To track a new static page:

1. Add it to the `pageDates` object in `scripts/build-page-dates.js`
2. Add the corresponding property to the return object in `lib/file-dates.ts`
3. Update the TypeScript declaration in `lib/page-dates.json.d.ts`

## Slug Utilities Documentation

This module provides reusable functions for creating URL-friendly slugs and
managing table of contents functionality in blog articles.

### Features

- **URL-friendly slug generation** from any text content
- **Table of contents extraction** from HTML content
- **Heading ID generation** with automatic fallbacks
- **Anchor link functionality** for headings
- **Both server-side and client-side** implementations

### Usage Examples

#### Basic Slug Generation

<!-- markdownlint-disable MD013 -->

```typescript
import { createSlug } from '@/lib/slug-utils'

// Basic usage
const slug = createSlug('Getting Started with React')
// Returns: 'getting-started-with-react'

// With custom options
const slug = createSlug('Custom Slug!', { strict: true })
// Returns: 'custom-slug'
```

<!-- markdownlint-enable MD013 -->

#### Section ID Generation

<!-- markdownlint-disable MD013 -->

```typescript
import { createSlugId } from '@/lib/slug-utils'

// Generate ID for a heading with fallback
const id = createSlugId('Introduction to TypeScript', 2)
// Returns: 'introduction-to-typescript'

// If text is empty, generates fallback
const id = createSlugId('', 2)
// Returns: 'heading-2-abc123def' (random suffix)
```

<!-- markdownlint-enable MD013 -->

#### Table of Contents Extraction

<!-- markdownlint-disable MD013 -->

```typescript
import { extractTableOfContents } from '@/lib/slug-utils'

const htmlContent = `
  <h1>Main Title</h1>
  <h2>Introduction</h2>
  <h3>Getting Started</h3>
  <h2>Advanced Topics</h2>
`

const toc = extractTableOfContents(htmlContent)
// Returns:
// [
//   { id: 'introduction', text: 'Introduction', level: 2 },
//   { id: 'getting-started', text: 'Getting Started', level: 3 },
//   { id: 'advanced-topics', text: 'Advanced Topics', level: 2 }
// ]
```

<!-- markdownlint-enable MD013 -->

#### Adding Heading IDs and Anchor Links

<!-- markdownlint-disable MD013 -->

```typescript
import { addHeadingIds } from '@/lib/slug-utils'

const htmlContent = `
  <h2>Getting Started</h2>
  <h3>Installation</h3>
`

const processedContent = addHeadingIds(htmlContent)
// Returns HTML with IDs and anchor links added:
// <h2 id="getting-started" class="heading-with-anchor">
//   Getting Started
//   <a href="#getting-started" class="heading-anchor">...</a>
// </h2>
```

<!-- markdownlint-enable MD013 -->

### API Reference

#### `createSlug(text: string, options?: SlugOptions): string`

Creates a URL-friendly slug from text.

**Parameters:**

- `text`: The text to convert to a slug
- `options`: Optional configuration object
  - `lower`: Convert to lowercase (default: true)
  - `strict`: Use strict mode (default: false)
  - `locale`: Locale for conversion (default: 'en')
  - `trim`: Trim whitespace (default: true)

#### `createSlugId(text: string, level: number, options?: SlugOptions): string`

Creates a slug ID with automatic fallback for empty content.

**Parameters:**

- `text`: The text content to create ID from
- `level`: The heading level (1-6) for fallback generation
- `options`: Optional slug configuration

<!-- markdownlint-disable MD013 -->

#### `extractTableOfContents(htmlContent: string, options?: SlugOptions): TocItem[]`

<!-- markdownlint-enable MD013 -->

Extracts table of contents from HTML content. Works both server-side and
client-side.

**Parameters:**

- `htmlContent`: HTML content to extract headings from
- `options`: Optional slug configuration

**Returns:** Array of `TocItem` objects with `id`, `text`, and `level`
properties.

#### `addHeadingIds(htmlContent: string, options?: SlugOptions): string`

Adds IDs and anchor links to headings in HTML content.

**Parameters:**

- `htmlContent`: HTML content to process
- `options`: Optional slug configuration

**Returns:** Processed HTML with IDs and anchor links added.

### Integration Examples

#### Using with React Components

<!-- markdownlint-disable MD013 -->

```typescript
// In a blog post component
import { addHeadingIds, extractTableOfContents } from '@/lib/slug-utils'

const BlogPost = ({ content }: { content: string }) => {
  const contentWithIds = addHeadingIds(content)
  const tableOfContents = extractTableOfContents(contentWithIds)

  return (
    <div>
      <TableOfContents items={tableOfContents} />
      <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
    </div>
  )
}
```

<!-- markdownlint-enable MD013 -->

#### Custom Section Anchoring

<!-- markdownlint-disable MD013 -->

```typescript
// For any section that needs anchor functionality
import { createSlugId } from '@/lib/slug-utils'

const sections = ['About Us', 'Our Services', 'Contact Information']

sections.forEach(sectionTitle => {
  const anchorId = createSlugId(sectionTitle, 2)
  // Use anchorId for navigation links
  console.log(`#${anchorId}`) // #about-us, #our-services, #contact-information
})
```

<!-- markdownlint-enable MD013 -->

### TypeScript Types

<!-- markdownlint-disable MD013 -->

```typescript
interface TocItem {
  id: string // The slug ID for the heading
  text: string // The clean text content
  level: number // The heading level (2-4)
}

interface SlugOptions {
  lower?: boolean // Convert to lowercase
  strict?: boolean // Use strict character filtering
  locale?: string // Locale for conversion
  trim?: boolean // Trim whitespace
}
```

<!-- markdownlint-enable MD013 -->

### Benefits Slug Utilities

1. **Consistency**: All slug generation uses the same configuration and rules
2. **Reusability**: Functions can be used throughout the application
3. **Maintainability**: Single source of truth for slug logic
4. **Testing**: Centralized functions are easier to test
5. **Performance**: Optimized implementations for both server and client
6. **Accessibility**: Includes proper ARIA labels and semantic markup

## Updating Packages

Keeping dependencies up to date is important for security and compatibility. To
update packages in this project:

### 1. Check for Outdated Packages

Use [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) to see
which dependencies have newer versions:

<!-- markdownlint-disable MD013 -->

```bash
npx npm-check-updates --jsonUpgraded
```

<!-- markdownlint-enable MD013 -->

Or use the built-in npm command:

<!-- markdownlint-disable MD013 -->

```bash
npm outdated --json
```

<!-- markdownlint-enable MD013 -->

### 2. Upgrade Dependencies

To upgrade all dependencies to their latest versions:

<!-- markdownlint-disable MD013 -->

```bash
npx npm-check-updates --upgrade
npm install
```

<!-- markdownlint-enable MD013 -->

Or update a specific package:

<!-- markdownlint-disable MD013 -->

```bash
npm install <package-name>@latest
```

<!-- markdownlint-enable MD013 -->

- **Commit the updated lock file** (`package-lock.json` or `pnpm-lock.yaml`)
  with your PR. This ensures reviewers and CI use the exact dependency versions
  you tested.
- **Run `npm ci` in a clean clone** of your branch to verify reproducible
  installs. This helps catch any accidental mismatches in dependency versions
  before review.

### 3. Verify and Test

After updating, always run the full project check to ensure everything works:

<!-- markdownlint-disable MD013 -->

```bash
npm run check
```

<!-- markdownlint-enable MD013 -->

This will run type checking, linting, formatting, spell checking, tests, and
security audits. Only submit a PR if all checks pass.

> **Tip:** Review the [Development Workflow](#development-workflow) section for
> more details on quality standards.

## Code of Conduct

This project and everyone participating in it is governed by our
[Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to
uphold this code. Please report unacceptable behavior as outlined in the Code of
Conduct.

## Reporting Bugs

If you find a bug, please report it by creating an issue on the GitHub
repository. Provide as much detail as possible:

- Steps to reproduce the bug.
- Expected behavior.
- Actual behavior.
- Screenshots or error messages, if applicable.
- Your environment (browser, OS, Node.js version).

## Asking for Help

If you have questions or need help with your contribution, feel free to:

- Create an issue on GitHub, labeling it as a "question".
- Clearly describe the problem you're facing or the information you need.

## GDPR Cookie Consent Implementation

This implementation provides a complete GDPR-compliant cookie consent solution
for the Next.js website.

### Features Consent

✅ **GDPR Compliant**: Meets all EU legal requirements for cookie consent
✅ **Granular Control**: Users can enable/disable different cookie categories
✅ **Multi-language**: Supports English and Swedish translations
✅ **Accessible**: Full keyboard navigation and screen reader support
✅ **Responsive**: Works on all device sizes
✅ **Privacy-First**: Only strictly necessary cookies by default
✅ **Theme Integration**: Respects cookie consent for theme preferences

### Cookie Categories

These are the different cookie categories the website currently uses.

#### 🛡️ Strictly Necessary

Strictly necessary cookies are essential for the site to function and **cannot
be disabled** (GDPR exemption).

- Authentication
- Security
- Load balancing

#### 🎨 Preferences

Preferences cookies store settings that tailor the site to an individual user.

- **Theme settings** (light/dark mode) – `theme` cookie
- **Language preferences** (en/sv) - `language` cookie
- User interface customizations

#### 📊 Analytics

Analytics cookies help us understand how visitors interact with the site so we
can improve performance and content.

- Website usage analytics
- Performance monitoring
- User behavior insights

> **Note**: Marketing cookies have been intentionally excluded as this website
> does not currently use any marketing or advertising cookies. This keeps the
> consent interface simple and honest about what data is actually collected.

### Files Added/Modified

#### New Files

- `lib/cookie-consent.ts` - Core cookie consent utilities
- `lib/language-preferences.ts` - Language preference management
- `components/CookieConsentBanner.tsx` - Banner component
- `components/CookieSettings.tsx` - Settings management page
- `app/[locale]/cookies/page.tsx` - Cookie policy page
- `lib/__tests__/cookie-consent.test.ts` - Unit tests
- `lib/__tests__/language-preferences.test.ts` - Language preference tests
- `components/__tests__/CookieConsentBanner.test.tsx` - Component tests

#### Modified Files

- `app/[locale]/layout.tsx` - Added banner integration
- `lib/theme-context.tsx` - Added consent checking for theme preferences
- `components/LanguageSwitcher.tsx` - Added language preference storage
- `components/Footer.tsx` - Added cookie policy link
- `messages/en.json` - Added English translations
- `messages/sv.json` - Added Swedish translations

### Usage Consent

#### Basic Integration

The cookie consent banner automatically appears for new users. It's integrated
into the main layout and will show until the user makes a choice.

#### Checking Consent in Your Code

<!-- markdownlint-disable MD013 -->

```typescript
import { hasConsent } from '@/lib/cookie-consent'
import { saveLanguagePreference } from '@/lib/language-preferences'

// Check for analytics consent
if (hasConsent('analytics')) {
  // Initialize Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID')
}

// Save language preference when user changes language
function handleLanguageChange(newLanguage: string) {
  // This will only save if user has consented to preferences cookies
  saveLanguagePreference(newLanguage)
}
```

<!-- markdownlint-enable MD013 -->

#### Managing Cookie Registry

Add your cookies to the `cookieRegistry` in `lib/cookie-consent.ts`:

<!-- markdownlint-disable MD013 -->

```typescript
export const cookieRegistry: CookieInfo[] = [
  // ... existing cookies
  {
    name: '_ga',
    category: 'analytics',
    purpose: 'Google Analytics - tracks user interactions',
    duration: '2 years',
    provider: 'Google',
  },
  {
    name: 'language',
    category: 'preferences',
    purpose: 'Stores user language preference (en/sv)',
    duration: '1 year',
  },
]
```

<!-- markdownlint-enable MD013 -->

### Legal Compliance

See [README.md – GDPR Requirements Met](README.md#gdpr-requirements-met)
for the full compliance checklist.

#### Data Stored

- **Consent Settings**: Stored in localStorage and cookie
- **Timestamp**: When consent was given
- **Version**: For future consent updates

#### Data Retention

- Consent data expires after 1 year
- Users can export their data
- Users can reset all consent at any time

### Customization

#### Styling

The components use Tailwind CSS classes and respect your design system:

- Primary color: `primary-600`
- Dark mode support built-in
- Responsive design included

#### Translations

Add new languages by:

1. Creating new message files (e.g., `messages/de.json`)
2. Adding the locale to your i18n configuration
3. Copying the `cookieConsent` and `cookiePolicy` sections

#### Cookie Categories

To add new categories:

1. Update the `CookieCategory` type
2. Add translations for the new category
3. Update the UI components to include the new category

### Testing Consent

Run tests with:

<!-- markdownlint-disable MD013 -->

```bash
npm test
```

<!-- markdownlint-enable MD013 -->

The implementation includes:

- Unit tests for core functionality
- Component tests for user interactions
- Type checking for TypeScript safety

### Browser Support

- **Modern browsers**: Full feature support
- **Legacy browsers**: Graceful degradation
- **No JavaScript**: Banner won't appear (acceptable for GDPR)

### Performance Consent

- **Lazy loaded**: Banner only loads when needed
- **Small bundle**: Minimal impact on page size
- **No external dependencies**: Except for animations

### Monitoring

Monitor cookie consent effectiveness:

<!-- markdownlint-disable MD013 -->

```typescript
import { getConsentSettings, getConsentTimestamp } from '@/lib/cookie-consent'

// Analytics on consent choices
const settings = getConsentSettings()
const timestamp = getConsentTimestamp()

// Track conversion rates, user preferences, etc.
```

<!-- markdownlint-enable MD013 -->

### Security Consent

- **XSS Protection**: All user data is sanitized
- **CSP Compatible**: No inline scripts required
- **HTTPS Only**: Secure cookie attributes set
- **SameSite**: Protection against CSRF attacks

### Maintenance

#### Regular Tasks

1. **Audit cookies**: Review `cookieRegistry` quarterly
2. **Update consent version**: When adding new cookie purposes
3. **Monitor compliance**: Ensure third-party scripts respect consent
4. **Review translations**: Keep legal language up to date

#### Future Enhancements

Consider adding:

- Integration with Consent Management Platforms (CMP)
- Server-side consent detection
- Advanced analytics on consent patterns
- Integration with marketing automation tools

### Support

For questions or issues:

1. Check the test files for usage examples
2. Review the cookie registry for cookie definitions
3. Test with browser developer tools to verify consent flow
4. Ensure third-party scripts respect consent decisions

### License

This implementation is part of the viscalyx.se project and follows the same MIT
license.

Thank you for contributing to Viscalyx.se!
