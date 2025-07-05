# Contributing to Viscalyx.se

First off, thank you for considering contributing to Viscalyx.se! We welcome contributions of all kinds, from bug fixes and documentation improvements to new features. This document provides guidelines to help you get started.

If you haven't already, please read the main [README.md](README.md) for an overview of the project.

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
- [SSH Agent Setup](#ssh-agent-setup)
  - [macOS / Linux](#macos--linux)
  - [Windows (PowerShell)](#windows-powershell)
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
  - [Benefits](#benefits-1)
- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Asking for Help](#asking-for-help)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended, check `.nvmrc` if available or `package.json` engines field)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Getting Started

1. **Fork the repository**: Click the "Fork" button on the GitHub repository page.
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/viscalyx.se.git
   cd viscalyx.se
   ```

### Open in Dev Container

To ensure a consistent development environment, this project supports VS Code Dev Containers.

1. **Install the Remote - Containers extension**: If you haven't already, install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension from the VS Code Marketplace.
2. **Reopen in Container**:
   - Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
   - Type `Remote-Containers: Reopen in Container` and select it.
   - VS Code will build the development container. This may take a few minutes the first time.
   - Once built, your workspace files will be automatically synced into the container, and it will have all the necessary tools and dependencies pre-installed.

3. **Install dependencies**:

   ```bash
   npm install
   ```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Development Workflow

### Branching Strategy

We use a simple branching strategy:

1. Create a new branch for each feature or bug fix from the `main` branch.
1. Name your branches descriptively, e.g., `feature/add-contact-form` or `fix/header-layout-issue`.

   ```bash
   git checkout -b feature/your-feature-name
   ```

### Running the App Locally

To start the development server:

```bash
npm run dev
```

This command will also run `build:blog` and `build:page-dates` scripts. The application will be available at `http://localhost:3000`.

### Building the App

To create a production build:

```bash
npm run build
```

This command ensures all necessary build steps, including blog data and page dates generation, are executed.

### Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting.

- **Check for linting and formatting errors**:

  ```bash
  npm run lint
  npm run format:check
  ```

- **Fix linting errors automatically**:

  ```bash
  npm run lint:fix
  ```

- **Format code automatically**:

  ```bash
  npm run format
  ```

We recommend installing the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VS Code extensions for a better development experience.

### Type Checking

This project uses TypeScript. To check for type errors:

```bash
npm run type-check
```

## GitHub Copilot Support

This project includes a customized development environment for GitHub Copilot's coding agent:

- **Pre-configured Setup**: Automatic dependency installation and project configuration
- **Quality Assurance**: Built-in linting, formatting, and testing
- **Development Tools**: All necessary tools pre-installed and ready to use
- **Project-Specific**: Optimized for Next.js, TypeScript, and Tailwind CSS workflows

The Copilot environment is configured via `.github/workflows/copilot-setup-steps.yml` and includes:

- Node.js 22 with npm caching
- TypeScript strict mode checking
- ESLint and Prettier formatting
- Vitest testing environment
- Blog data generation and i18n support
- Cloudflare deployment tools

## Making Changes

### Code Structure Overview

A brief overview of the main directories:

- `app/`: Contains the core application logic, pages, layouts, and API routes using Next.js App Router.
  - `app/[locale]/`: Locale-specific pages.
  - `app/api/`: API route handlers.
- `components/`: Reusable React components.
- `content/`: Markdown files for blog posts and potentially other content.
- `lib/`: Utility functions, data handling (like `blog.ts`, `file-dates.ts`), and context providers.
- `messages/`: JSON files for internationalization (i18n).
- `public/`: Static assets like images and fonts.
- `scripts/`: Build scripts, e.g., for generating blog data or page dates.

### Adding New Content

#### Blog Posts

1. Create a new Markdown file (e.g., `my-new-post.md`) in the `content/blog/` directory.
1. Follow the frontmatter structure of existing blog posts (see `content/blog/template.md` if available). Essential fields usually include `title`, `date`, `author`, `excerpt`, and `tags`.
1. Write your content in Markdown.
1. After adding or modifying a blog post, regenerate the blog data:

   ```bash
   npm run build:blog
   ```

   This script updates `lib/blog-data.json`, which is used to list and display blog posts. `npm run dev` also runs this script.

#### Static Pages

This project manages "last modified" dates for static pages using Git commit history. To add a new static page and track its last modified date:

1. Create your new page component within the `app/[locale]/` directory structure (e.g., `app/[locale]/new-page/page.tsx`).
1. Update the `scripts/build-page-dates.js` file:
   - Add your new page to the `pagePaths` object, mapping a key (e.g., `newPage`) to its file path.
1. Update the `lib/file-dates.ts` file:
   - Add a corresponding property for your new page to the `PageDates` interface and the return object of the `getStaticPageDates()` function.
1. Update the TypeScript declaration file `lib/page-dates.json.d.ts` to include the new page key.
1. Run the script to update the dates (or rely on `npm run dev`/`build`):

   ```bash
   npm run build:page-dates
   ```

#### Internationalization (i18n)

The website supports English (`en`) and Swedish (`sv`). Text strings are managed in JSON files:

- `messages/en.json` for English
- `messages/sv.json` for Swedish

When adding new user-facing text:

1. Add a unique key and its translation to both `en.json` and `sv.json`.
1. Use the `useTranslations` hook from `next-intl` in your components to display translated strings. Refer to existing components for usage examples.

### Component Development

- Create new components in the `components/` directory.
- Ensure components are well-structured, reusable, and follow React best practices.
- Use TypeScript for type safety.

### Styling

- Styling is primarily done using [Tailwind CSS](https://tailwindcss.com/).
- Global styles are defined in `app/globals.css`.
- Component-specific styles can be achieved using Tailwind utility classes directly in the JSX.

#### Blog Content Styling

The blog content uses a simplified CSS architecture designed to make customization easy for contributors.

**Quick Start**:

1. **Base Blog Content**: All blog posts use the `.blog-content` class, which provides consistent styling for all content elements.
2. **Simple Customization**: Apply modifier classes to change blog appearance:

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

3. **Available Modifier Classes**:
   - `.blog-content-accent-headings` - Primary color headings
   - `.blog-content-large-text` - Larger H2 headings
   - `.blog-content-spaced` - More paragraph spacing
   - `.blog-content-colorful` - Gradient blockquotes

4. **Creating Custom Modifiers**: Add new modifier classes in `app/globals.css`:

   ```css
   .blog-content-custom {
     /* Your custom styles here */
   }

   .blog-content-custom h1 {
     /* Custom H1 styling */
   }
   ```

**Key Benefits:**

- **Simple**: Easy to understand and modify
- **Maintainable**: Clean separation of concerns
- **Flexible**: Mix and match modifiers as needed
- **Consistent**: All elements styled uniformly

**Common Tasks:**

- **Change heading colors**: Use `.blog-content-accent-headings` or create a custom modifier
- **Adjust spacing**: Use `.blog-content-spaced` or modify paragraph margins in a custom class
- **Style code blocks**: Modify `.blog-content pre` and `.blog-content code` rules
- **Customize blockquotes**: Use `.blog-content-colorful` or create custom blockquote styles

The architecture is meant to be a clean and easily customizable approach.

#### Easy Customization Examples

To make all H2 headings larger:

```css
.blog-content-large-text h2 {
  @apply text-4xl;
}
```

```tsx
<div className="blog-content blog-content-large-text prose prose-lg max-w-none">
```

To make headings use the primary color:

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

To add more space between paragraphs:

```css
.blog-content-spaced p {
  @apply mb-8;
}
```

```tsx
<div className="blog-content blog-content-spaced prose prose-lg max-w-none">
```

To make blockquotes more visually appealing:

```css
.blog-content-colorful blockquote {
  @apply bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-l-8 border-primary-500;
}
```

```tsx
<div className="blog-content blog-content-colorful prose prose-lg max-w-none">
```

#### Changing Heading Colors

1. Open `app/globals.css`
2. Find the `.blog-content h1, .blog-content h2, ...` section
3. Modify the `@apply` directive:

```css
.blog-content h1,
.blog-content h2,
.blog-content h3 {
  @apply text-red-600 dark:text-red-400 font-bold scroll-mt-24; /* Changed to red */
}
```

#### Changing Code Block Styling

To change code block background:

```css
.blog-content pre {
  @apply bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-6; /* Terminal style */
}
```

#### Changing Link Colors

To change link styling:

```css
.blog-content a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 no-underline hover:underline; /* Blue links with hover underline */
}
```

#### Adding Custom Typography

To add different font weights or sizes:

```css
.blog-content h1 {
  @apply text-5xl font-black mb-8 mt-10; /* Larger, bolder H1 */
}

.blog-content p {
  @apply mb-6 text-lg; /* Larger paragraph text */
}
```

#### Creating Blog Variations

You can now easily create different blog post styles by combining modifiers:

##### Modern Tech Blog Style

```tsx
<div className="blog-content blog-content-accent-headings blog-content-large-text prose prose-lg max-w-none">
```

##### Spacious Reading Style

```tsx
<div className="blog-content blog-content-spaced prose prose-lg max-w-none">
```

##### Colorful Feature Style

```tsx
<div className="blog-content blog-content-colorful blog-content-accent-headings prose prose-lg max-w-none">
```

#### Syntax Highlighting

The blog system includes automatic syntax highlighting for code blocks using Prism.js. This feature works with 200+ programming languages and automatically adapts to the current theme.

**Using Syntax Highlighting:**

1. **Standard Code Blocks**: Simply use triple backticks with a language identifier:

   ````markdown
   ```javascript
   const greeting = 'Hello, World!'
   console.log(greeting)
   ```
   ````

   ```powershell
   Get-Process | Where-Object { $_.CPU -gt 100 }
   ```

2. **Supported Languages**: The system supports all major programming languages, including:
   - **PowerShell** (`powershell`, `ps1`)
   - **JavaScript/TypeScript** (`javascript`, `typescript`, `js`, `ts`)
   - **Python** (`python`, `py`)
   - **Bash/Shell** (`bash`, `shell`, `sh`)
   - **HTML/CSS** (`html`, `css`)
   - **JSON/YAML** (`json`, `yaml`)
   - And many more...

3. **Theme Integration**: Syntax highlighting automatically adapts to light/dark themes using the same color palette as the rest of the site.

4. **Language Labels**: Code blocks automatically display language labels in the top-right corner for better readability.

**Customizing Syntax Highlighting:**

The syntax highlighting styles are defined in `app/prism-theme.css`. The implementation:

- Uses the Tailwind CSS color palette for consistency
- Preserves existing blog content backgrounds
- Supports both light and dark themes
- Includes PowerShell-specific token styling

To modify syntax highlighting colors:

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

**Technical Implementation:**

- **Server-side processing**: Syntax highlighting is applied during the build process using `rehype-prism-plus`
- **Build script**: Code highlighting is handled in `scripts/build-blog-data.js`
- **HTML sanitization**: Updated to allow syntax highlighting classes and spans
- **Performance**: No client-side JavaScript required for syntax highlighting
- **Copy functionality**: Each code block includes a copy-to-clipboard button for easy code sharing

**Copy-to-Clipboard Feature:**

All code blocks automatically include a copy button in the top-right corner that allows readers to quickly copy code snippets. The feature:

- Uses the modern `navigator.clipboard.writeText()` API with fallback support
- Provides visual feedback when content is copied
- Includes hover tooltips for better accessibility
- Automatically positions alongside language labels
- Works with all supported programming languages

The implementation ensures fast loading times and consistent rendering across all devices.

#### GitHub-Style Alerts

The blog system supports GitHub-style alerts for special content callouts. These provide visual emphasis with distinct colors and icons:

**Using GitHub Alerts:**

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

**Alert Types:**

- **NOTE** (Blue with info icon): General information and explanations
- **TIP** (Green with lightbulb icon): Helpful suggestions and best practices
- **IMPORTANT** (Purple with speech bubble icon): Critical information for success
- **WARNING** (Orange with triangle icon): Potential risks and cautions
- **CAUTION** (Red with octagon icon): Dangerous operations or breaking changes

**When to Use:**

- Use GitHub alerts for content that needs special attention
- Use regular blockquotes for quotes, citations, and general emphasis
- Choose the alert type based on the urgency and type of information

The alerts are processed during the build phase and include proper semantic HTML for accessibility.

## Brand Guidelines & Visual Style Guide

When contributing to Viscalyx.se, it's important to follow our brand guidelines and visual style guide to maintain consistency across the website. Our brand assets and style guidelines are documented in the `/docs` directory and should be referenced when making design-related changes.

### Brand Assets

For information about available brand assets, including logos, icons, and other visual elements, see:

📄 **[Brand Assets README](docs/brand-assets-readme.md)** - Overview of all available brand assets, file formats, and usage guidelines.

### Style Guide

Our comprehensive visual style guide covers colors, typography, spacing, and design principles:

📄 **[Brand Style Guide](docs/brand-style-guide.md)** - Detailed documentation of our visual identity, including color palettes, typography, spacing systems, and design principles.

### Brand Usage Examples

For practical examples of how to implement our brand guidelines in code and design:

📄 **[Brand Usage Examples](docs/brand-usage-examples.md)** - Code examples and implementation patterns for maintaining brand consistency.

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
- If your changes address a specific issue, reference it in the commit message (e.g., `fix: resolve issue #123`).
- Consider following the [Conventional Commits](https://www.conventionalcommits.org/) specification for more structured commit messages, though it's not strictly enforced.

Example:

```text
feat: add user profile page
```

```text
fix: correct typo in contact form validation
```

```text
docs: update contributing guidelines for blog posts
```

### Pull Request (PR) Process

1. Ensure your local branch is up-to-date with the `main` branch of the
   upstream repository.
1. Push your changes to your forked repository.

   ```bash
   git push origin feature/your-feature-name
   ```

1. Go to the original `viscalyx.se` repository on GitHub and create a
   new Pull Request from your forked branch.
1. Provide a clear title and description for your PR:
   - Summarize the changes made.
   - Explain the "why" behind your changes.
   - Link to any relevant issues (e.g., "Closes #123").
1. Ensure all automated checks (GitHub Actions for linting, spell check,
   build, etc.) pass. If they fail, please address the issues in your branch.

### Code Review

- Once a PR is submitted, project maintainers will review your changes.
- Be prepared to discuss your changes and make adjustments based on feedback.
- After approval and all checks pass, your PR will be merged.

## SSH Agent Setup

This project supports forwarding your SSH agent into the dev container cross-platform. The default `devcontainer.json` uses:

```jsonc
"mounts": [
  "source=${localEnv:SSH_AUTH_SOCK},target=/ssh-agent.sock,type=bind,consistency=cached"
],
"containerEnv": {
  "SSH_AUTH_SOCK": "/ssh-agent.sock"
}
```

### macOS / Linux

Typically, your login shell exports `SSH_AUTH_SOCK` automatically. If not:

1. Start the agent and add your key:

   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```

2. Verify `echo $SSH_AUTH_SOCK` is set.

### Windows (PowerShell)

1. Ensure the **OpenSSH Authentication Agent** service is running:

   ```powershell
   Start-Service ssh-agent
   ```

2. Add the named pipe to your user environment, so VS Code picks it up:

   ```powershell
   [Environment]::SetEnvironmentVariable(
     "SSH_AUTH_SOCK",
     "//./pipe/openssh-ssh-agent",
     "User"
   )
   ```

3. Log out, then log back in, and verify it’s available by running:

   ```powershell
   ls env:ssh*
   ```

After this, `${localEnv:SSH_AUTH_SOCK}` will resolve correctly on all platforms.

## Spell Checking Setup

This project uses [Code Spell Checker (cspell)](https://cspell.org/) for automated spell checking across all code files, markdown content, and documentation.

### Configuration

#### VS Code Integration

- **Extension**: Code Spell Checker is configured in `.vscode/settings.json`
- **Real-time checking**: Spelling errors are highlighted as you type
- **Custom dictionary**: Technical terms are pre-configured in `.cspell.json`

#### Files Checked

- TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`, `.jsx`)
- Markdown files (`.md`)
- JSON configuration files
- YAML files

#### Custom Dictionary

The `.cspell.json` file includes:

- Company names (Viscalyx, etc.)
- Technical terms (DevOps, Kubernetes, PowerShell DSC, etc.)
- Framework names (Next.js, React, Azure, AWS, etc.)
- Common abbreviations and acronyms

### Usage

#### NPM Scripts

```bash
# Check all files for spelling errors
npm run spell:check

# Interactive spell checking with suggestions
npm run spell:fix

# Check specific files
npx cspell "app/**/*.tsx"
```

#### VS Code Commands

- `Ctrl/Cmd + Shift + P` → "Spell: Add Words to Dictionary"
- Right-click on misspelled word → "Add to Dictionary"
- `F1` → "Spell: Check Current Document"

#### Adding New Words

1. **VS Code**: Right-click on the word → "Add to User Dictionary" or "Add to Workspace Dictionary"
2. **Manual**: Add words to the `words` array in `.cspell.json`
3. **Project-specific**: Words added via VS Code are automatically saved to `.cspell.json`

### Automation

#### GitHub Actions

- Spell checking runs automatically on all pull requests
- Builds fail if spelling errors are found
- Comments are added to PRs with spelling issues

#### Pre-commit Integration (Optional)

To add spell checking to pre-commit hooks, add this to your pre-commit script:

```bash
#!/bin/sh
npm run spell:check
if [ $? -ne 0 ]; then
  echo "❌ Spell check failed. Please fix spelling errors before committing."
  exit 1
fi
```

### Ignoring False Positives

#### Temporary Ignore

Add `// cspell:disable-next-line` above the line with the "misspelled" word:

```typescript
// cspell:disable-next-line
const specialTechnicalTerm = \'someUniqueApiName\'
```

#### Ignore Entire File

Add to the top of the file:

```text
// cspell:disable
```

#### Ignore Specific Words in File

```typescript
// cspell:ignore specialword anothertechterm
```

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

1. **False Positives**: Add legitimate technical terms to `.cspell.json`
2. **Performance**: Adjust `checkLimit` in `.cspell.json` for large files
3. **Languages**: Add language-specific dictionaries if needed

#### Debugging

```bash
# Verbose output to see what\'s being checked
npx cspell "**/*.md" --verbose

# Check a specific file with full details
npx cspell app/page.tsx --show-context --show-suggestions
```

### Language Extensions

This project supports multi-language spell checking:

#### Swedish Support

Swedish spell checking is enabled for:

- Files in the Swedish dictionary (`lib/dictionaries/sv.ts`)
- Files with `sv` in the filename
- Files with `swedish` in the filename

The configuration includes:

```bash
npm install --save-dev @cspell/dict-sv
```

Configuration in `.cspell.json`:

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

#### Additional Language Support

For other languages, install additional dictionaries:

```bash
npm install --save-dev @cspell/dict-spanish @cspell/dict-french
```

Then add to `.cspell.json`:

```json
{
  "dictionaries": ["spanish", "french"]
}
```

### Best Practices

1. **Review before adding**: Don\'t blindly add misspelled words to the dictionary
2. **Keep dictionary clean**: Periodically review custom words
3. **Use consistent naming**: Follow project conventions for technical terms
4. **Document decisions**: Add comments in `.cspell.json` for unusual words
5. **Team alignment**: Ensure all team members use the same VS Code settings

## Cloudflare Scripts Documentation

This document describes the Cloudflare-specific scripts in `package.json` that enable deployment to Cloudflare Workers using the OpenNext adapter.

### Scripts Overview

#### `preview`

```bash
npm run preview
```

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare preview`

**Purpose**: Tests and previews your Next.js application using the Cloudflare adapter in a local environment that simulates the Cloudflare Workers runtime.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers using the OpenNext adapter
2. **Preview**: Starts a local server that mimics the Cloudflare Workers environment

**When to use**:

- Before deploying to production to ensure your app works correctly in the Cloudflare Workers environment
- For integration testing with Cloudflare-specific features
- To verify that your application behaves correctly with the OpenNext adapter

**Difference from `dev`**:

- `npm run dev` uses the Next.js development server for fast development
- `npm run preview` uses the Cloudflare adapter to simulate the production environment

#### `deploy`

```bash
npm run deploy
```

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`

**Purpose**: Builds and deploys your Next.js application to Cloudflare Workers.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers
2. **Deploy**: Uploads and deploys the application to your Cloudflare Workers environment

**Deployment targets**:

- `*.workers.dev` subdomain (default)
- Custom domain (if configured)

**Requirements**:

- Wrangler CLI must be authenticated with Cloudflare
- Proper `wrangler.jsonc` configuration file

#### `cf-typegen`

```bash
npm run cf-typegen
```

**Command**: `wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts`

**Purpose**: Generates TypeScript type definitions for Cloudflare environment variables and bindings.

**What it does**:

- Creates a `cloudflare-env.d.ts` file with TypeScript interfaces
- Provides type safety for Cloudflare-specific environment variables
- Includes types for bindings like R2, KV, D1, etc.

**When to use**:

- After adding new environment variables in `wrangler.jsonc`
- When setting up new Cloudflare bindings
- To maintain type safety in TypeScript projects

### Testing Workflow

Use the standard Next.js development server for the best developer experience with hot reloading.

#### Testing with Cloudflare Environment

```bash
npm run preview
```

Test your application in an environment that simulates Cloudflare Workers before deploying.

#### Production Deployment

```bash
npm run deploy
```

Deploy your application to Cloudflare Workers.

#### Type Generation

```bash
npm run cf-typegen
```

Generate TypeScript types for Cloudflare bindings and environment variables.

### Configuration Files

These scripts work in conjunction with:

- **`wrangler.jsonc`**: Cloudflare Workers configuration
- **`open-next.config.ts`**: OpenNext adapter configuration
- **`cloudflare-env.d.ts`**: Generated TypeScript types (created by `cf-typegen`)

### Required Dependencies

The following packages enable these scripts:

```json
{
  "dependencies": {
    "@opennextjs/cloudflare": "^1.1.0"
  },
  "devDependencies": {
    "wrangler": "^4.18.0"
  }
}
```

### Additional Resources

- [Cloudflare Next.js Guide](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)
- [OpenNext Documentation](https://opennext.js.org/cloudflare)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## Security Testing

This section explains the security testing approach for the blog data generation process, which handles regular security audits of the build-time sanitization process.

### Security Overview

The blog data build process (`scripts/build-blog-data.js`) uses the `sanitize-html` library to prevent XSS attacks by sanitizing HTML content generated from Markdown. To ensure this sanitization continues to work effectively, we have implemented comprehensive security testing.

### Security Test Components

#### 1. Sanitization Security Tests (`scripts/__tests__/build-blog-data-sanitization.test.js`)

These tests verify that the sanitization configuration properly prevents XSS attacks while preserving legitimate content:

##### XSS Prevention Tests

- **Script Tag Removal**: Ensures `<script>` tags and their content are completely removed
- **Event Handler Removal**: Removes dangerous event handlers like `onclick`, `onload`, etc.
- **JavaScript URL Prevention**: Blocks `javascript:` URLs in links and other attributes
- **Style Tag Removal**: Removes `<style>` tags and inline styles that could contain malicious code
- **Iframe/Embed Blocking**: Prevents potentially dangerous embedded content
- **Data Attribute Handling**: Verifies data attributes are handled safely

##### Content Preservation Tests

- **Basic HTML Formatting**: Ensures standard HTML tags like `<h1>`, `<p>`, `<strong>`, `<em>` are preserved
- **Syntax Highlighting**: Verifies that code syntax highlighting classes and attributes are maintained
- **Table of Contents**: Ensures heading IDs for navigation are preserved
- **Safe Links**: Confirms that legitimate URLs (https, mailto, relative paths) work correctly
- **Image Handling**: Documents the current restrictive image policy

##### Edge Case Testing

- **Empty Content**: Handles null, undefined, and empty strings safely
- **Malformed HTML**: Gracefully processes badly formed HTML
- **Large Content**: Handles very long content without performance issues

#### 2. Integration Security Tests (`scripts/__tests__/build-blog-data-integration.test.js`)

These tests run the actual build script with malicious content to verify end-to-end security:

##### Full Build Process Testing

- **Malicious Content Removal**: Creates actual blog posts with XSS attempts and verifies they're sanitized
- **Syntax Highlighting Preservation**: Ensures code blocks maintain their highlighting after processing
- **Multiple Post Handling**: Tests that sanitization works consistently across multiple posts
- **Reading Time Calculation**: Verifies that malicious content doesn't affect reading time calculations

#### 3. Security Audit Script (`scripts/security-audit.js`)

A convenient script that runs all security tests and provides a comprehensive report:

```bash
npm run test:security
```

This script:

- Runs all sanitization tests
- Runs all integration tests
- Provides a detailed security audit summary
- Fails the build if any security tests fail

### Running Security Tests

#### Individual Test Suites

```bash
# Run sanitization tests only
npx jest scripts/__tests__/build-blog-data-sanitization.test.js

# Run integration tests only
npx jest scripts/__tests__/build-blog-data-integration.test.js
```

#### Full Security Audit

```bash
npm run test:security
```

#### As Part of CI/CD

The security tests are included in the main `check` script:

```bash
npm run check  # Includes type-check, formatting, linting, tests, and security audit
```

### Security Configuration

#### Current Sanitization Rules

The build script uses these sanitization options:

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

#### Notable Security Decisions

1. **No Image Tags**: The current configuration does NOT allow `<img>` tags, as images are likely handled through other mechanisms
2. **Data Attributes Allowed**: While `data-*` attributes are allowed, they cannot execute JavaScript directly
3. **Restricted Tag Set**: Only a curated set of HTML tags are allowed, blocking dangerous ones like `<script>`, `<iframe>`, `<object>`, etc.

### Security Recommendations

#### Regular Maintenance

1. **Update Dependencies**: Keep `sanitize-html` updated to latest version
2. **Review New Attack Vectors**: Periodically review OWASP XSS prevention guidelines
3. **Monitor Test Results**: Any test failures should be investigated immediately
4. **Audit Configuration**: Review the sanitization configuration when adding new features

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

1. **Check Recent Changes**: Review recent modifications to the build script or sanitization config
2. **Verify Dependencies**: Ensure `sanitize-html` and related packages are up-to-date
3. **Review Error Messages**: Test failures indicate specific security vulnerabilities
4. **Test Manually**: Create test blog posts with suspicious content to verify behavior

#### Performance Issues

If tests are slow:

1. **Check Content Size**: Exceptionally large test content can slow down processing
2. **Review Complexity**: Deeply nested HTML can cause performance issues
3. **Monitor Resources**: Integration tests create temporary files and directories

#### False Positives

If legitimate content is being over-sanitized:

1. **Review Sanitization Config**: May need to allow additional tags or attributes
2. **Update Test Expectations**: Ensure tests match the actual desired behavior
3. **Consider Alternatives**: Some content might need different handling mechanisms

## Page Dates Management

This document explains how page last modified dates are managed in the sitemap and individual pages.

### Overview

The application uses actual Git commit dates for static pages instead of always using the current date (`new Date()`). This improves SEO accuracy by providing real last modified timestamps.

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

```typescript
const staticPageDates = getStaticPageDates()
// Use staticPageDates.privacy, staticPageDates.terms, etc.
```

**In Pages (`app/[locale]/privacy/page.tsx`, etc.):**

```typescript
const staticPageDates = getStaticPageDates()
// Use format.dateTime(staticPageDates.privacy, {...})
```

### Build Process Integration

The page dates are built automatically as part of:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run deploy`

### Manual Update

To manually update page dates:

```bash
npm run build:page-dates
```

### Tracked Pages

- **home**: `app/[locale]/page.tsx`
- **blog**: `app/[locale]/blog/page.tsx`
- **caseStudies**: `app/[locale]/case-studies/page.tsx`
- **privacy**: `app/[locale]/privacy/page.tsx`
- **terms**: `app/[locale]/terms/page.tsx`

### Benefits

1. **SEO Accuracy**: Real last modified dates instead of current date
2. **Environment Compatibility**: Works in Cloudflare Workers and other serverless environments
3. **Automatic Updates**: Dates update when files are actually modified
4. **Build-time Generation**: No runtime Git commands or file system access needed

### Adding New Pages

To track a new static page:

1. Add it to the `pageDates` object in `scripts/build-page-dates.js`
2. Add the corresponding property to the return object in `lib/file-dates.ts`
3. Update the TypeScript declaration in `lib/page-dates.json.d.ts`

## Slug Utilities Documentation

This module provides reusable functions for creating URL-friendly slugs and managing table of contents functionality in blog articles.

### Features

- **URL-friendly slug generation** from any text content
- **Table of contents extraction** from HTML content
- **Heading ID generation** with automatic fallbacks
- **Anchor link functionality** for headings
- **Both server-side and client-side** implementations

### Usage Examples

#### Basic Slug Generation

```typescript
import { createSlug } from '@/lib/slug-utils'

// Basic usage
const slug = createSlug('Getting Started with React')
// Returns: 'getting-started-with-react'

// With custom options
const slug = createSlug('Custom Slug!', { strict: true })
// Returns: 'custom-slug'
```

#### Section ID Generation

```typescript
import { createSlugId } from '@/lib/slug-utils'

// Generate ID for a heading with fallback
const id = createSlugId('Introduction to TypeScript', 2)
// Returns: 'introduction-to-typescript'

// If text is empty, generates fallback
const id = createSlugId('', 2)
// Returns: 'heading-2-abc123def' (random suffix)
```

#### Table of Contents Extraction

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

#### Adding Heading IDs and Anchor Links

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

#### `extractTableOfContents(htmlContent: string, options?: SlugOptions): TocItem[]`

Extracts table of contents from HTML content. Works both server-side and client-side.

**Parameters:**

- `htmlContent`: HTML content to extract headings from
- `options`: Optional slug configuration

**Returns:** Array of `TocItem` objects with `id`, `text`, and `level` properties.

#### `addHeadingIds(htmlContent: string, options?: SlugOptions): string`

Adds IDs and anchor links to headings in HTML content.

**Parameters:**

- `htmlContent`: HTML content to process
- `options`: Optional slug configuration

**Returns:** Processed HTML with IDs and anchor links added.

### Integration Examples

#### Using with React Components

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

#### Custom Section Anchoring

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

### TypeScript Types

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

### Benefits

1. **Consistency**: All slug generation uses the same configuration and rules
2. **Reusability**: Functions can be used throughout the application
3. **Maintainability**: Single source of truth for slug logic
4. **Testing**: Centralized functions are easier to test
5. **Performance**: Optimized implementations for both server and client
6. **Accessibility**: Includes proper ARIA labels and semantic markup

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior as outlined in the Code of Conduct.

## Reporting Bugs

If you find a bug, please report it by creating an issue on the GitHub repository. Provide as much detail as possible:

- Steps to reproduce the bug.
- Expected behavior.
- Actual behavior.
- Screenshots or error messages, if applicable.
- Your environment (browser, OS, Node.js version).

## Asking for Help

If you have questions or need help with your contribution, feel free to:

- Create an issue on GitHub, labeling it as a "question".
- Clearly describe the problem you're facing or the information you need.

Thank you for contributing to Viscalyx.se!
