#!/bin/bash

# Prebuild script for Next.js with OpenNext Cloudflare deployment
# This script handles cleaning and preparation before building the Next.js app
#
# Problem this solves:
# - OpenNext uses esbuild to compile config files during the build process
# - esbuild has a bug that creates files with write-only permissions (--w-------)
# - The bundler later tries to READ these configs and fails with permission errors
# - We need to preserve and fix permissions on these configs between builds
#
# Solution:
# 1. Clean Next.js build artifacts (.next, out)
# 2. If .open-next exists, fix permissions on config files
# 3. Preserve .open-next/.build (contains the configs) but clean everything else
# 4. Rebuild site data (blog posts, page dates)

# cSpell:ignore prebuild esbuild copyfile sitedata

set -e  # Exit on error

# Step 1: Clean Next.js build directories
echo "🧹 Cleaning Next.js build artifacts..."
rm -rf .next out

# Step 2 & 3: Handle OpenNext directory (if it exists)
if [ -d ".open-next" ]; then
    echo "🔧 Fixing permissions on OpenNext config files..."
    # Fix permissions on config files (esbuild creates them with --w-------)
    # This needs to happen BEFORE the bundler tries to read them during the next build
    # Without this fix, you'll see errors like:
    #   ✘ [Error: ENOENT: no such file or directory,
    #     copyfile '/workspace/.open-next/.build/open-next.config.edge.mjs'
    #     -> '/workspace/.open-next/middleware/open-next.config.mjs'
    find .open-next/.build -type f -name 'open-next.config*.mjs' -exec chmod 644 {} + 2>/dev/null || true

    echo "🗑️  Cleaning OpenNext artifacts (preserving .build)..."
    # Clean everything in .open-next EXCEPT the .build directory
    # The .build directory contains compiled configs that we want to reuse
    find .open-next -mindepth 1 -maxdepth 1 -not -name '.build' -exec rm -rf {} +
fi

# Step 4: Rebuild site data
echo "📊 Building site data..."
npm run build:sitedata

echo "✅ Prebuild complete!"
