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
- **Optimized builds** - Multi-stage Docker builds for smaller images
- **Volume optimization** - Named volumes for better performance on all platforms
- **SSH agent forwarding** - Automatic on Linux/macOS, gracefully handled on Windows
- **Shell compatibility** - Bash and Zsh support with intelligent defaults

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
- SSH agent forwarding requires additional setup (optional)

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

### Multi-Stage Docker Build

The Dockerfile uses multi-stage builds for:

- **Smaller final images** - Only runtime dependencies included
- **Better caching** - Separate layers for different concerns
- **Cross-platform compatibility** - Automatic platform detection
- **Security** - Minimal attack surface in final image

### Volume Strategy

- **Source code** - Bind mount with optimized caching
- **node_modules** - Named volume for cross-platform performance
- **npm cache** - Persistent cache to speed up subsequent builds

### Platform Detection

The setup automatically detects and optimizes for:

- **AMD64** (Intel/AMD processors)
- **ARM64** (Apple Silicon, ARM servers)
- **Different host OS** (Linux, macOS, Windows)

## Files Structure

```
.devcontainer/
├── devcontainer.json      # Main configuration file with cross-platform settings
├── docker-compose.yml     # Multi-platform Docker Compose setup
├── Dockerfile            # Multi-stage container image definition
├── .dockerignore         # Optimized build context exclusions
└── README.md            # This file (comprehensive documentation)
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

- This can happen if the postCreateCommand runs before devcontainer features are fully initialized
- The configuration uses `bash -l` to ensure proper shell initialization
- If you still encounter this issue, try rebuilding the container: "Dev Containers: Rebuild Container"
- As a workaround, you can manually run `npm install` after the container starts

**npm permission errors (EACCES):**

- This was resolved by removing the node_modules named volume that could cause permission conflicts
- node_modules are now stored directly in the workspace with proper vscode user ownership
- If you encounter permission errors, try rebuilding the container: "Dev Containers: Rebuild Container"

**SSH agent not working:**

- Linux/macOS: Ensure SSH_AUTH_SOCK environment variable is set
- Windows: SSH agent forwarding requires additional setup or use Git credentials

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

- **Non-root user**: Container runs as 'vscode' user for security
- **Minimal base image**: Uses slim Debian image to reduce attack surface
- **No secrets in image**: All sensitive data handled via environment variables
- **Read-only configurations**: System configurations are immutable
- **SSH agent isolation**: SSH agent socket is properly isolated and secured

## Performance Optimization

- **Multi-stage builds**: Optimized image layers for faster builds and smaller size
- **Build cache**: Docker layer caching speeds up subsequent builds
- **Named volumes**: node_modules and npm cache persist across container restarts
- **Platform detection**: Automatic optimization for ARM64 and AMD64 architectures

## Contributing

When modifying the devcontainer configuration:

1. Test on multiple platforms if possible (Linux, macOS, Windows)
2. Ensure the build works for both AMD64 and ARM64
3. Update this README with any new features or requirements
4. Consider the impact on build time and image size
5. Follow the project's containerization best practices

For more details about the project setup, see the main [README.md](../README.md) in the project root.

Update the `settings` object in `devcontainer.json` to customize VS Code behavior.

### Adding System Dependencies

Add packages to the `RUN apt-get install` command in the `Dockerfile`.

### Environment Variables

Add environment variables to the `containerEnv` object in `devcontainer.json`.

## Troubleshooting

### Container Won't Start

1. Ensure Docker Desktop is running
2. Try rebuilding the container: Command Palette → "Dev Containers: Rebuild Container"
3. Check Docker logs for specific error messages

### Port Conflicts

If ports 3000 or 3001 are already in use:

1. Stop other services using these ports
2. Or modify the `forwardPorts` in `devcontainer.json`

### Performance Issues

- Ensure Docker Desktop has sufficient resources allocated (CPU/Memory)
- The first build will be slower due to downloading base images and dependencies
- Subsequent starts should be much faster

### Permission Issues

The container runs as the `vscode` user with UID 1000. If you encounter permission issues:

1. Check that your host user has appropriate permissions
2. Rebuild the container if needed

### SSH Agent and SSH Keys

#### On the Host

```bash
# Check if ssh-agent is running and list loaded SSH keys
ssh-add -l
```

- If you see an error about connecting to the agent, start it and add your key:

```bash
# Start ssh-agent
eval "$(ssh-agent -s)"
# Add your SSH private key (adjust path as needed)
ssh-add ~/.ssh/id_rsa
```

- Confirm keys are loaded:

```bash
ssh-add -l
```

#### Verifying Services on Windows Host

Open PowerShell as Administrator and run:

```powershell
# Check SSH Agent service status
Get-Service -Name ssh-agent
```

- If the ssh-agent service is not running, start it:

```powershell
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent
```

#### In the DevContainer

```bash
# Inside the container, list forwarded SSH keys
ssh-add -l
```

### GPG Keys

#### On the Host

```bash
# List secret GPG keys available
gpg --list-secret-keys
```

#### Using Kleopatra (Windows Host)

1. Open the Kleopatra application.
2. In the top menu, select **View → Secret Keys** (or enable the "Secret Keys" filter).
3. Confirm your GPG key appears and is valid (check expiration date and usage flags).

#### GPG Agent (Gpg4win)

Gpg4win does not install a Windows service for `gpg-agent`. To ensure the agent is running, either launch Kleopatra:

- **From Start Menu**: search for **Kleopatra** and open it.
- **Or in PowerShell**:

  ```powershell
  Start-Process "C:\Program Files (x86)\Gpg4win\bin\kleopatra.exe"
  ```

or can be launched manually:

```powershell
# Launch GPG agent
gpgconf --launch gpg-agent
```

Once Kleopatra is running, the GPG agent starts automatically. You can verify it by looking for `gpg-agent.exe` in Task Manager.

#### In the DevContainer

```bash
# Inside the container, list secret GPG keys
gpg --list-secret-keys
```

## Benefits

- **Consistency**: Every contributor gets the exact same environment
- **Zero Setup**: New contributors can start coding immediately
- **Isolation**: Project dependencies don't conflict with host system
- **Portability**: Works on Windows, macOS, and Linux
- **Reproducibility**: Environment is version-controlled and reproducible
- **Productivity**: Pre-configured with all necessary tools and extensions

## Contributing

When adding new tools or changing the configuration:

1. Test the changes locally
2. Update this README if needed
3. Ensure the container builds and runs correctly on both Windows, Linux and macOS
4. Document any new features or requirements
