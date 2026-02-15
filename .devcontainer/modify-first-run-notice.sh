#!/bin/bash
# Append project-specific content to the first-run terminal notice.
#
# Both /etc/bash.bashrc and /etc/zsh/zshrc include a built-in hook that
# displays a "first-run notice" the first time a user opens an interactive
# terminal. The hook checks two paths in order:
#
#   1. /usr/local/etc/vscode-dev-containers/first-run-notice.txt
#   2. /workspaces/.codespaces/shared/first-run-notice.txt
#
# In GitHub Codespaces path #2 is populated automatically with a generic
# welcome message. This script appends project-specific tips and the
# GitHub CLI authentication status to that existing file.
#
# A "displayed" marker file is removed on each container start so the
# notice reappears after every restart.

CODESPACES_NOTICE="/workspaces/.codespaces/shared/first-run-notice.txt"
SYSTEM_NOTICE="/usr/local/etc/vscode-dev-containers/first-run-notice.txt"
MARKER="$HOME/.config/vscode-dev-containers/first-run-notice-already-displayed"

# Remove the marker so the notice shows in this session's first terminal
rm -f "${MARKER}"

# Determine which notice file to append to.
# Prefer the Codespaces shared path (writable without sudo); fall back to
# the system path for plain dev containers.
if [ -f "${CODESPACES_NOTICE}" ]; then
  NOTICE_FILE="${CODESPACES_NOTICE}"
elif [ -f "${SYSTEM_NOTICE}" ]; then
  NOTICE_FILE="${SYSTEM_NOTICE}"
else
  # No existing notice file — create one in the system location
  NOTICE_FILE="${SYSTEM_NOTICE}"
  sudo mkdir -p "$(dirname "${NOTICE_FILE}")"
  sudo touch "${NOTICE_FILE}"
  sudo chmod 644 "${NOTICE_FILE}"
fi

# Append project-specific content
{
  echo ""
  echo "📝 Run 'npm run dev' to start the development server"
  echo "✅ Run 'npm run check' to run all quality checks"
  echo ""

  # Append GitHub CLI auth status
  ./.devcontainer/check-gh-auth.sh
} >> "${NOTICE_FILE}"
