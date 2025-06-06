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

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Content**: Markdown files
- **TypeScript**: Full type safety

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Content Usage

- **Blog posts and articles**: Free to use, share, and adapt under MIT License
- **Source code**: Open source under MIT License
- **Personal/team information**: Please respect privacy when reusing content

The MIT License allows you to freely use the blog content and website source code while ensuring proper attribution to Viscalyx.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

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

Typically your login shell exports `SSH_AUTH_SOCK` automatically. If not:

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

2. Add the named pipe to your user environment so VS Code picks it up:

   ```powershell
   [Environment]::SetEnvironmentVariable(
     "SSH_AUTH_SOCK",
     "//./pipe/openssh-ssh-agent",
     "User"
   )
   ```

3. Logout and back in and the make sure it is available with:

   ```powershell
   ls env:ssh*
   ```

After this, `${localEnv:SSH_AUTH_SOCK}` will resolve correctly on all platforms.
