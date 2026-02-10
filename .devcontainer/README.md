# DevContainer Configuration

This directory contains the complete development container setup for the Viscalyx.se project. The devcontainer provides a consistent, **cross-platform** development environment that works seamlessly across Linux, macOS, and Windows, ensuring all contributors have the same tooling and dependencies.

## What's Included

### Development Environment

- **Node.js 24 LTS** - Latest stable version for optimal performance
- **TypeScript** - Full TypeScript support with proper tooling
- **Zsh with Oh My Zsh** - Enhanced shell experience (with bash fallback)
- **Git** - Version control with proper configuration
- **GitHub CLI** - For seamless GitHub integration
- **Cross-platform support** - Works on Linux, macOS, and Windows

### Cross-Platform Features

- **Multi-architecture support** - Supports both AMD64 and ARM64 (Apple Silicon)
- **Volume optimization** - Named volumes for npm cache performance
- **SSH agent forwarding** - Handled automatically by VS Code Dev Containers extension on all platforms
- **Shell compatibility** - Zsh (default) and Bash available

### VS Code Extensions

- **Language Support**: TypeScript, React, Next.js
- **Code Quality**: ESLint, Prettier, Error Lens
- **Productivity**: Auto-rename tag, Path IntelliSense, TODO Tree
- **Styling**: Tailwind CSS IntelliSense
- **Documentation**: Markdown support, Spell checker (English + Swedish)
- **Git Integration**: Built-in Git support
- **AI Assistance**: GitHub Copilot integration

### Pre-configured Settings

- Automatic formatting on save
- ESLint auto-fix on save
- Optimized TypeScript settings
- Tailwind CSS IntelliSense configuration
- Spell checking for multiple languages
- Git auto-fetch and smart commit
- Cross-platform terminal configuration

## Quick Start

### Prerequisites

- **Docker Desktop** - [Download for your platform](https://www.docker.com/products/docker-desktop/)
  - Windows: Ensure WSL2 is enabled for best performance
  - macOS: Both Intel and Apple Silicon supported
  - Linux: Standard Docker Engine or Docker Desktop
- **VS Code** - [Download for your platform](https://code.visualstudio.com/)
- **Dev Containers extension** - [Install from marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Platform-Specific Setup

#### Windows

- Enable WSL2 for optimal performance
- Consider using Windows Terminal for better experience
- SSH agent forwarding is handled automatically by VS Code

#### macOS

- Both Intel and Apple Silicon Macs supported
- SSH agent forwarding works automatically
- Docker Desktop handles all platform detection

#### Linux

- Native Docker support provides best performance
- SSH agent forwarding works automatically
- All features fully supported

### Opening in DevContainer

1. **Clone the repository**

   ```bash
   git clone https://github.com/viscalyx/viscalyx.se.git
   cd viscalyx.se
   ```

2. **Open in VS Code**

   ```bash
   code .
   ```

3. **Start DevContainer**
   - When prompted, click "Reopen in Container"
   - Or use Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → "Dev Containers: Reopen in Container"

4. **Wait for Setup**
   - First build may take 5-15 minutes (depending on platform and internet speed)
   - Dependencies install automatically
   - All tools and extensions configure automatically

## Architecture & Performance

### Docker Build

The Dockerfile uses the `mcr.microsoft.com/devcontainers/base:ubuntu` image which:

- **Supports multi-architecture** - Works on both AMD64 and ARM64 natively
- **Includes common tools** - git, curl, wget, sudo, and the vscode user
- **Devcontainer features** - Node.js, Git, GitHub CLI, and Zsh are installed via devcontainer features

### Volume Strategy

- **Source code** - Bind mount with `:cached` flag for performance
- **npm cache** - Named volume to speed up `npm install` across rebuilds
- **node_modules** - Stored in the workspace (bind mount), not a separate volume

### Platform Handling

Docker Desktop automatically detects and handles:

- **AMD64** (Intel/AMD processors)
- **ARM64** (Apple Silicon, ARM servers)
- **Different host OS** (Linux, macOS, Windows)

## Files Structure

```text
.devcontainer/
├── devcontainer.json      # Main configuration file with cross-platform settings
├── docker-compose.yml     # Docker Compose setup with volume configuration
├── Dockerfile            # Container image definition
└── README.md            # This file
```

## Available Ports

- **3000** or **3001** - Next.js development server
- **8787** - Cloudflare Wrangler preview / production server
- **51204** - Vitest UI server

All ports are automatically forwarded and work across all platforms.

## Development Workflow

The devcontainer environment supports all standard npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build the project
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript checks
npm run check        # Run all checks (lint, test, type, format, spell)

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode testing
npm run test:coverage # Coverage report

# Deployment
npm run deploy       # Deploy to Cloudflare
```

## Customization

### Adding Extensions

Edit the `extensions` array in `devcontainer.json` to add more VS Code extensions:

```json
"extensions": [
  "existing.extensions",
  "new.extension.id"
]
```

### Modifying Settings

VS Code settings can be customized in the `customizations.vscode.settings` section of `devcontainer.json`.

### Platform-Specific Customizations

The configuration automatically adapts to different platforms, but you can add platform-specific customizations using VS Code's conditional settings.

## Troubleshooting

### Build Issues

**Slow builds on Windows:**

- Ensure WSL2 is enabled
- Consider using WSL2 backend for Docker Desktop
- Place project files in WSL2 filesystem for better performance

**Platform architecture issues:**

- The setup automatically detects ARM64 (Apple Silicon) vs AMD64
- If you encounter issues, try: `docker buildx create --use`

**Permission issues:**

- The container uses a non-root user for security
- All file permissions are handled automatically
- On Windows, ensure Docker Desktop has proper file sharing permissions

### Runtime Issues

**npm command not found:**

- The Node.js feature installs Node via nvm. If postCreateCommand fails, try rebuilding: "Dev Containers: Rebuild Container"
- As a workaround, you can manually run `npm install` after the container starts

**npm permission errors (EACCES):**

- node_modules are stored in the workspace bind mount with proper vscode user ownership
- If you encounter permission errors, try rebuilding the container: "Dev Containers: Rebuild Container"

**SSH agent not working:**

- VS Code Dev Containers extension handles SSH agent forwarding automatically on all platforms
- Linux/macOS: Ensure `ssh-agent` is running and keys are loaded (`ssh-add -l`)
- Windows: Ensure the OpenSSH Authentication Agent service is running (see SSH section below)
- If SSH still doesn't work, you can configure git to use HTTPS credentials instead

**Port conflicts:**

- Default ports (3000, 3001, 8787, 51204) can be changed in docker-compose.yml
- VS Code will automatically forward ports and notify you

**Performance issues:**

- node_modules are stored directly in the workspace with proper caching
- If you experience issues, try rebuilding: "Dev Containers: Rebuild Container"

### Development Environment

**Extensions not loading:**

- Wait for the container to fully initialize
- Check the "Output" panel for extension installation logs
- Some extensions require a reload: "Developer: Reload Window"

**Git configuration:**

- Git is pre-configured with safe defaults
- You may need to set your user.name and user.email:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

## Security Considerations

- **Non-root user**: Container runs as 'vscode' user via `remoteUser` setting
- **Devcontainer base image**: Uses Microsoft's official devcontainer image
- **No secrets in image**: All sensitive data handled via environment variables or SSH agent forwarding
- **Safe directory**: Only `/workspace` is added as a git safe directory

## Performance Optimization

- **Build cache**: Docker layer caching speeds up subsequent builds
- **Named volumes**: npm cache persists across container restarts
- **Cached bind mount**: Source code mount uses `:cached` flag for macOS/Windows performance
- **Devcontainer features**: Tools installed via features are cached in Docker layers

## Contributing

When modifying the devcontainer configuration:

1. Test on multiple platforms if possible (Linux, macOS, Windows)
2. Ensure the build works for both AMD64 and ARM64
3. Update this README with any new features or requirements
4. Consider the impact on build time and image size
5. Follow the project's containerization best practices

For more details about the project setup, see the main [README.md](../README.md) in the project root.
