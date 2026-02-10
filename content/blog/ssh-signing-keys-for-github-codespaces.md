---
title: 'SSH Signing Keys for GitHub Codespaces – Setup and Rotation Guide'
date: '2026-02-10'
author: 'Johan Ljunggren'
excerpt: 'Generate a passphrase-less SSH key for commit signing in GitHub Codespaces, configure dotfiles for automatic setup, and learn key rotation.'
image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop&crop=center'
imageAlt: 'Close-up of a laptop screen displaying lines of code in a dark theme editor.'
tags:
  - 'Git'
  - 'SSH'
  - 'GitHub'
  - 'Codespaces'
  - 'Security'
  - 'DevOps'
category: 'DevOps'
readTime: '8 min read'
---

> **Audience:** developers using GitHub Codespaces who want verified commit
> signatures without GPG complexity.

## Why SSH signing in Codespaces?

Git 2.34 introduced **SSH-based commit signing** as an alternative to GPG.
For Codespaces users this is a game-changer:

- **No GPG keyring** to manage — a single SSH key pair handles both
  authentication and signing
- **Automatic setup** via dotfiles — every new Codespace gets signing
  configured without manual steps
- **Verified badges** on GitHub — your commits show as "Verified" just like
  with GPG

> [!NOTE]
> Codespaces already inject a `GITHUB_TOKEN` for HTTPS Git operations. SSH keys
> are needed for **commit signing** and for using **SSH remotes** instead of
> HTTPS, but not for push/pull over HTTPS.

## Prerequisites

- A GitHub account with [Codespaces](https://github.com/features/codespaces)
  enabled
- A [dotfiles repository](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles)
  linked in your Codespaces settings
- Git 2.34 or later (Codespaces ships 2.34+ by default)

## Step 1 – Generate a dedicated passphrase-less SSH key

On your **local machine** (not inside a Codespace), generate a key pair used
exclusively for Codespaces signing:

<!-- markdownlint-disable MD013 -->

```bash
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_codespaces -N ""
```

<!-- markdownlint-enable MD013 -->

Breaking down the flags:

<!-- markdownlint-disable MD013 -->

| Flag                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `-t ed25519`                      | Use the Ed25519 algorithm (fast, secure, short keys)             |
| `-C "your-email@example.com"`     | Comment matching your Git email                                  |
| `-f ~/.ssh/id_ed25519_codespaces` | Dedicated filename to avoid conflicts                            |
| `-N ""`                           | Empty passphrase (the key is stored encrypted in GitHub Secrets) |

<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD028 -->

> [!IMPORTANT]
> The `_codespaces` suffix is a temporary label used only during key generation.
> After generating the key pair, store both the private and public key in a
> **secure password vault** (e.g., 1Password, Bitwarden, KeePass). You will
> retrieve the keys from the vault in the following steps to add them to GitHub
> and the Codespaces secret. Once stored securely, you can remove the local
> copies from `~/.ssh/`.

> [!TIP]
> A passphrase-less key is safe here because GitHub encrypts the Codespaces
> secret at rest and injects it only into your ephemeral Codespace environments.
> The key never touches disk unencrypted outside the Codespace.

<!-- markdownlint-enable MD028 -->

## Step 2 – Add the public key to GitHub

Add the public key **twice** on [github.com/settings/keys](https://github.com/settings/keys):

### Authentication key

1. Click **New SSH key**
2. **Title:** `Codespaces (authentication)`
3. **Key type:** Authentication Key
4. Paste the output of:

```bash
cat ~/.ssh/id_ed25519_codespaces.pub
```

### Signing key

1. Click **New SSH key** again
2. **Title:** `Codespaces (signing)`
3. **Key type:** Signing Key
4. Paste the same public key content

> [!NOTE]
> GitHub requires the signing key to be added separately from the
> authentication key. You can use the same key pair for both.

## Step 3 – Store the private key as a Codespaces secret

1. Go to [github.com/settings/codespaces](https://github.com/settings/codespaces)
2. Under **Secrets**, click **New secret**
3. **Name:** `SSH_PRIVATE_KEY`
4. **Value:** paste the entire private key content:

```bash
cat ~/.ssh/id_ed25519_codespaces
```

The output looks like:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
REDACTED_PRIVATE_KEY_CONTENT
(several lines of base64-encoded data)
-----END OPENSSH PRIVATE KEY-----
```

5. Select which repositories can access this secret (or choose **All
   repositories**)
6. Click **Add secret**

## Step 4 – Configure your dotfiles

### The `.gitconfig` file

Create or update `.gitconfig` in your dotfiles repository:

```ini
[core]
    autocrlf = input
    editor = code --wait

[user]
    name = Your Name
    email = your-email@example.com
    username = YourGitHubUsername
    signingkey = ~/.ssh/id_ed25519.pub

[gpg]
    format = ssh

[gpg "ssh"]
    allowedSignersFile = ~/.ssh/allowed_signers

[commit]
    gpgsign = true

[tag]
    gpgsign = true

[push]
    autosetupremote = true

[init]
    defaultbranch = main

[pull]
    rebase = true
```

Key settings explained:

<!-- markdownlint-disable MD013 -->

| Setting                      | Value                    | Purpose                                           |
| ---------------------------- | ------------------------ | ------------------------------------------------- |
| `gpg.format`                 | `ssh`                    | Tell Git to use SSH instead of GPG                |
| `user.signingkey`            | `~/.ssh/id_ed25519.pub`  | Path to the public key for signing                |
| `gpg.ssh.allowedSignersFile` | `~/.ssh/allowed_signers` | Enables local verification                        |
| `core.autocrlf`              | `input`                  | Convert CRLF to LF on commit, keep LF on checkout |

<!-- markdownlint-enable MD013 -->

> [!WARNING]
> Use `autocrlf = input` instead of `autocrlf = true` for Codespaces. The
> `true` setting converts line endings to CRLF on checkout, which breaks shell
> scripts on Linux.

### The `install.sh` script

Create `install.sh` in your dotfiles repository:

> [!IMPORTANT]
> When a dotfiles repository contains an `install.sh` script, GitHub Codespaces
> **disables automatic symlinking** of dotfiles (including `.gitconfig`). The
> script must explicitly deploy any dotfiles it needs. Without the deployment
> lines below, `git config --global user.email` returns empty and the
> `allowed_signers` file gets a malformed entry.
> See [Personalizing Codespaces — Dotfiles](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles)
> for details.

```bash
#!/bin/bash

# Deploy .gitconfig from dotfiles repo (Codespaces won't auto-symlink when install.sh exists)
DOTFILES_DIR="$(cd "$(dirname "$0")" && pwd)"
[ -f "$DOTFILES_DIR/.gitconfig" ] && ln -sf "$DOTFILES_DIR/.gitconfig" ~/.gitconfig

if [ -n "$SSH_PRIVATE_KEY" ]; then
  mkdir -p ~/.ssh
  chmod 700 ~/.ssh

  # Write the private key
  echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
  chmod 600 ~/.ssh/id_ed25519

  # Derive the public key from the private key
  ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub
  chmod 644 ~/.ssh/id_ed25519.pub

  # Add GitHub to known hosts
  ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null

  # Create the allowed signers file for local verification
  EMAIL=$(git config --global user.email)
  echo "$EMAIL $(cat ~/.ssh/id_ed25519.pub)" > ~/.ssh/allowed_signers

  echo "SSH signing key configured for $EMAIL"
else
  echo "SSH_PRIVATE_KEY secret not found — skipping SSH key setup"
fi
```

> [!CAUTION]
> Make sure `install.sh` uses **LF line endings** (Unix-style). Add a
> `.gitattributes` file to your dotfiles repo to enforce this.

### The `.gitattributes` file

Create `.gitattributes` in your dotfiles repository root:

```text
*.sh text eol=lf
```

This prevents Windows line ending conversion from breaking the shell script.

## Step 5 – Enable dotfiles in Codespaces settings

1. Go to [github.com/settings/codespaces](https://github.com/settings/codespaces)
2. Under **Dotfiles**, check **Automatically install dotfiles**
3. Select your dotfiles repository (for example `your-username/dotfiles`)

When a new Codespace starts, GitHub clones your dotfiles repo and runs
`install.sh` automatically.

## Step 6 – Verify the setup

Create a new Codespace (or rebuild the current one) and run:

```bash
# Check the signing configuration
git config --global gpg.format
# Expected output: ssh

# Check the signing key
git config --global user.signingkey
# Expected output: ~/.ssh/id_ed25519.pub

# Make a test commit
echo "test" > /tmp/test-file
cd /tmp && git init test-repo && cd test-repo
git add -A && git commit --allow-empty -m "test: verify SSH signing"

# Verify the signature
git log --show-signature -1
```

You should see output containing `Good "git" signature` with your email.

## Rotating the SSH key

Rotate your key periodically or if you suspect it may be compromised. The
process involves generating a new key pair, updating GitHub, and updating the
Codespaces secret.

### Step 1 – Generate a new key pair

<!-- markdownlint-disable MD013 -->

```bash
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_codespaces_new -N ""
```

<!-- markdownlint-enable MD013 -->

### Step 2 – Add the new public key to GitHub

Go to [github.com/settings/keys](https://github.com/settings/keys) and add
the new public key as both **Authentication** and **Signing** key (same process
as in Step 2 above):

```bash
cat ~/.ssh/id_ed25519_codespaces_new.pub
```

> [!TIP]
> Add the new key **before** removing the old one. This ensures there is no
> window where neither key is valid.

### Step 3 – Update the Codespaces secret

1. Go to [github.com/settings/codespaces](https://github.com/settings/codespaces)
2. Click the **SSH_PRIVATE_KEY** secret
3. Click **Update** and paste the new private key:

```bash
cat ~/.ssh/id_ed25519_codespaces_new
```

### Step 4 – Remove the old key from GitHub

Go back to [github.com/settings/keys](https://github.com/settings/keys) and
delete the old public key entries (both authentication and signing).

### Step 5 – Rebuild existing Codespaces

Any **running** Codespace still has the old key. Either:

- **Rebuild** the Codespace container (Command Palette → `Codespaces: Rebuild
Container`)
- **Delete and recreate** the Codespace

New Codespaces created after updating the secret will automatically use the
new key.

### Step 6 – Clean up locally

```bash
# Remove the old key pair
rm ~/.ssh/id_ed25519_codespaces ~/.ssh/id_ed25519_codespaces.pub

# Rename the new key pair (optional)
mv ~/.ssh/id_ed25519_codespaces_new ~/.ssh/id_ed25519_codespaces
mv ~/.ssh/id_ed25519_codespaces_new.pub ~/.ssh/id_ed25519_codespaces.pub
```

## Troubleshooting

### Commits are not showing as "Verified"

- Confirm the **signing key** is added at
  [github.com/settings/keys](https://github.com/settings/keys) with key type
  set to **Signing Key**
- Verify the email in your `.gitconfig` matches the email on your GitHub
  account
- Check that `gpg.format` is set to `ssh`:

```bash
git config --global gpg.format
```

### "Permission denied" when signing

- Check that the private key exists and has correct permissions:

```bash
ls -la ~/.ssh/id_ed25519
# Should show: -rw------- (600)
```

- Verify the `SSH_PRIVATE_KEY` secret is set and accessible to the repository

### `install.sh` fails with `$'\r': command not found`

The script has Windows line endings. Ensure `.gitattributes` in your dotfiles
repo contains:

```text
*.sh text eol=lf
```

Then re-commit the file:

```bash
git add --renormalize install.sh
git commit -m "fix: normalize line endings for install.sh"
```

## Summary

<!-- markdownlint-disable MD013 -->

| Component        | Location                            | Purpose                                                   |
| ---------------- | ----------------------------------- | --------------------------------------------------------- |
| Private key      | Codespaces secret `SSH_PRIVATE_KEY` | Injected into each Codespace as an environment variable   |
| Public key       | github.com/settings/keys            | Registered as both authentication and signing key         |
| `.gitconfig`     | Dotfiles repo                       | Configures Git to use SSH signing                         |
| `install.sh`     | Dotfiles repo                       | Deploys `.gitconfig`, writes key, sets up allowed signers |
| `.gitattributes` | Dotfiles repo                       | Ensures shell scripts keep LF line endings                |

<!-- markdownlint-enable MD013 -->
