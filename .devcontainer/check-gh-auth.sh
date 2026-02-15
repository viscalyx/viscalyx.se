#!/bin/bash
# Check GitHub CLI authentication status after container start.
#
# If `gh auth token` fails (no valid token), print a helpful message
# pointing the user to the CONTRIBUTING.md guide for setting up
# authentication. This runs as part of postStartCommand so it is
# non-blocking — it never stops the container from starting.

if gh auth token &>/dev/null; then
  echo "GitHub CLI: authenticated ✓"
else
  echo ""
  echo "══════════════════════════════════════════════════════════════"
  echo "  GitHub CLI is not authenticated."
  echo ""
  echo "  To authenticate, run one of the following:"
  echo ""
  echo "    # Browser-based OAuth (recommended):"
  echo "    gh auth login --web --clipboard --hostname github.com --git-protocol ssh"
  echo ""
  echo "    # Or paste a Personal Access Token securely:"
  echo "    printf 'Paste your GitHub PAT and press Enter: '"
  echo "    read -rs GH_TOKEN && echo"
  echo "    printf '%s' \"\$GH_TOKEN\" | gh auth login --with-token --hostname github.com --git-protocol ssh"
  echo "    unset GH_TOKEN"
  echo ""
  echo "  For full instructions see:"
  echo "    https://github.com/viscalyx/viscalyx.se/blob/main/CONTRIBUTING.md#github-cli-authentication"
  echo "══════════════════════════════════════════════════════════════"
  echo ""
fi
