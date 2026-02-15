#!/bin/bash
# Fix Codespaces overriding GIT_COMMITTER_NAME/EMAIL with "GitHub <noreply@github.com>"
#
# Codespaces injects GIT_COMMITTER_NAME=GitHub and GIT_COMMITTER_EMAIL=noreply@github.com
# via /workspaces/.codespaces/shared/.env. These environment variables take precedence over
# git config, causing the committer identity to not match the user's GitHub verified email.
# This makes SSH-signed commits appear as "Unverified" on GitHub even though the signature
# itself is valid.
#
# This script reads the user's identity from git config and exports the correct values in
# shell profiles so every new terminal session uses the right committer identity.

set -e

if [ "$CODESPACES" != "true" ]; then
  echo "Not running in Codespaces — skipping GIT_COMMITTER fix"
  exit 0
fi

GIT_NAME=$(git config --global user.name 2>/dev/null || true)
GIT_EMAIL=$(git config --global user.email 2>/dev/null || true)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
  echo "Warning: git user.name or user.email not configured — skipping GIT_COMMITTER fix"
  exit 0
fi

MARKER="# Fix Codespaces GIT_COMMITTER override for verified signed commits"

for rcfile in "$HOME/.bashrc" "$HOME/.zshrc"; do
  if [ -f "$rcfile" ]; then
    # Skip if already patched
    if grep -q "GIT_COMMITTER_NAME" "$rcfile" 2>/dev/null; then
      echo "Already patched: $rcfile"
      continue
    fi

    cat >> "$rcfile" << EOF

$MARKER
export GIT_COMMITTER_NAME="$GIT_NAME"
export GIT_COMMITTER_EMAIL="$GIT_EMAIL"
EOF
    echo "Patched $rcfile with GIT_COMMITTER identity"
  fi
done

echo "GIT_COMMITTER fix applied: $GIT_NAME <$GIT_EMAIL>"
