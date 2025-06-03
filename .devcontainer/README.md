# DevContainer Configuration

This directory contains the complete development container setup for the Viscalyx.se project. The devcontainer provides a consistent development environment that works across different platforms and ensures all contributors have the same tooling and dependencies.

## What's Included

### Development Environment

- **Node.js 20 LTS** - Latest stable version for optimal performance
- **TypeScript** - Full TypeScript support with proper tooling
- **Zsh with Oh My Zsh** - Enhanced shell experience with useful plugins
- **Git** - Version control with proper configuration
- **GitHub CLI** - For seamless GitHub integration

### VS Code Extensions

- **Language Support**: TypeScript, React, Next.js
- **Code Quality**: ESLint, Prettier, Error Lens
- **Productivity**: Auto-rename tag, Path IntelliSense, TODO Tree
- **Styling**: Tailwind CSS IntelliSense, Material Theme
- **Documentation**: Markdown support, Spell checker (English + Swedish)
- **Git Integration**: GitLens, Git Graph, GitHub PR/Issues

### Pre-configured Settings

- Automatic formatting on save
- ESLint auto-fix on save
- Optimized TypeScript settings
- Tailwind CSS IntelliSense configuration
- Spell checking for multiple languages
- Git auto-fetch and smart commit

## Quick Start

1. **Prerequisites**

   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Install [VS Code](https://code.visualstudio.com/)
   - Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in DevContainer**

   - Clone the repository
   - Open the project in VS Code
   - When prompted, click "Reopen in Container" or use the Command Palette (`Cmd+Shift+P`) and select "Dev Containers: Reopen in Container"

3. **Wait for Setup**
   - The container will build automatically (first time may take 5-10 minutes)
   - Dependencies will be installed automatically
   - The project will be ready for development

## Files Structure

```
.devcontainer/
├── devcontainer.json      # Main configuration file
├── docker-compose.yml     # Docker Compose setup
├── Dockerfile            # Container image definition
├── scripts/              # Setup scripts
│   ├── setup-git.sh     # Git configuration
│   ├── setup-zsh.sh     # Shell configuration
│   └── README.md        # Scripts documentation
└── README.md            # This file
```

## Available Ports

- **3000** - Next.js development server
- **3001** - Next.js preview/production server

## Development Workflow

The devcontainer includes helpful aliases for common tasks:

```bash
# Development
dev          # Start development server (npm run dev)
build        # Build the project (npm run build)
start        # Start production server (npm run start)

# Code Quality
lint         # Run ESLint (npm run lint)
format       # Format code with Prettier (npm run format)
typecheck    # Run TypeScript checks (npm run type-check)
check        # Run all checks (npm run check)

# Git shortcuts
gs           # git status
ga           # git add
gc           # git commit
gp           # git push
gl           # git pull
```

## Customization

### Adding Extensions

Edit the `extensions` array in `devcontainer.json` to add more VS Code extensions.

### Modifying Settings

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
