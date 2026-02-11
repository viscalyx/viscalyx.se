# DevContainer Configuration

This directory contains the development container setup for the Viscalyx.se
project. For contributor setup instructions, platform-specific prerequisites,
and troubleshooting, see
[CONTRIBUTING.md](../CONTRIBUTING.md#dev-container-setup--requirements).

## Architecture & Performance

### Docker Build

The Dockerfile uses the `mcr.microsoft.com/devcontainers/base:ubuntu` image which:

- **Supports multi-architecture** - Works on both AMD64 and ARM64 natively
- **Includes common tools** - git, curl, wget, sudo, and the vscode user
- **Devcontainer features** - Node.js, Git, GitHub CLI, and Zsh are installed via devcontainer features

### Volume Strategy

- **Source code** - Bind mount with `:cached` flag for performance
- **npm cache** - The `npm-cache` named volume is commented out in docker-compose.yml (not needed for infrequent rebuilds) and therefore not used
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

VS Code settings can be customized in the `customizations.vscode.settings`
section of `devcontainer.json`.

### Platform-Specific Customizations

The configuration automatically adapts to different platforms, but you can
add platform-specific customizations using VS Code's conditional settings.

## Security Considerations

- **Non-root user**: Container runs as 'vscode' user via `remoteUser` setting
- **Devcontainer base image**: Uses Microsoft's official devcontainer image
- **No secrets in image**: All sensitive data handled via environment variables or SSH agent forwarding
- **Safe directory**: Only `/workspace` is added as a git safe directory
- **GitHub CLI authentication**: See [CONTRIBUTING.md](../CONTRIBUTING.md#github-cli-authentication) for secure PAT setup instructions

## Performance Optimization

- **Build cache**: Docker layer caching speeds up subsequent builds
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
