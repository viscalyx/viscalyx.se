---
applyTo: 'package.json'
---

# Package Management Rules

## Version Specifiers

- Pinned versions (no `^` or `~`) are intentional — do not add range prefixes without confirming
- The `overrides` section may pin transitive dependencies — check for needed updates when direct dependencies change

## Compatibility

- Next.js and React share tight peer dependency requirements — always verify compatibility before updating either
- `eslint-config-next` should match the installed Next.js version
- `@types/react` and `@types/react-dom` should match the installed React major version

## After Any Dependency Change

Run `npm run check` to verify type-checking, formatting, linting, tests, and security audit all pass.

## Full Update Workflow

For a comprehensive package update check, use the `update-packages` prompt.
