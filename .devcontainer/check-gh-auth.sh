#!/bin/bash
# Check GitHub CLI authentication status.
#
# Prints a short status line to stdout. When called standalone it gives
# quick feedback; when called from modify-first-run-notice.sh the output
# is appended to the first-run terminal notice.

if gh auth token &>/dev/null; then
  echo "✓ GitHub CLI: authenticated"
else
  echo "⚠ GitHub CLI is not authenticated."
  echo ""
  echo "  To authenticate, run one of the following:"
  echo ""
  echo "    # Browser-based OAuth (recommended):"
  echo "    gh auth login --web --clipboard --hostname github.com \\"
  echo "      --git-protocol ssh"
  echo ""
  echo "    # Or paste a Personal Access Token securely:"
  echo "    printf 'Paste your GitHub PAT and press Enter: '"
  echo "    read -rs GH_TOKEN && echo"
  echo "    printf '%s' \"\$GH_TOKEN\" | gh auth login --with-token \\"
  echo "      --hostname github.com --git-protocol ssh"
  echo "    unset GH_TOKEN"
  echo ""
  echo "  For full instructions see:"
  echo "    https://github.com/viscalyx/viscalyx.se/blob/main/CONTRIBUTING.md#github-cli-authentication"
fi
