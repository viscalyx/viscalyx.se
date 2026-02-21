---
agent: Plan
description: 'Analyze package.json, recommend safe updates following the project LTS policy, and provide update commands'
---

# Update Packages

Check all dependencies and devDependencies in `package.json` for available updates.

## LTS Policy

Only recommend **LTS (Long-Term Support)** versions for packages that follow an LTS release cycle. Do **not** recommend upgrading to non-LTS releases.

### Packages with LTS release cycles in this project

| Package | LTS Rule | How to identify LTS |
| --- | --- | --- |
| **Node.js** / `@types/node` | Even-numbered majors only (20, 22, 24, 26…) | Odd-numbered majors (21, 23, 25…) are short-lived "Current" releases — skip them |

When a non-LTS version is the latest available, the table should show it but the **Recommendation** column must say **Skip (non-LTS)** and the safe/major update commands must exclude it.

If you discover additional packages with LTS release cycles during analysis, apply the same policy and note them.

## Steps

1. Run `npm outdated --json` to gather version data. For packages needing more detail, use `npm view <package> versions --json`.

2. Present a table for **Dependencies** and **Dev Dependencies** (sorted alphabetically):

| Package | Current | Latest (Same Major) | Latest | Recommendation |
| --- | --- | --- | --- | --- |

Where **Recommendation** is one of:
- **Patch/Minor** — safe update, no breaking changes
- **Major available** — new major version, review changelog
- **Skip (non-LTS)** — latest major is a non-LTS release, do not update
- **Up to date** — already latest

Bold the **Latest** column when a major bump is available. Flag deprecated or vulnerable packages.

3. Provide update commands:
   - **Safe updates** — single `npm install` for all patch/minor updates
   - **Major updates** — separate `npm install` per package with breaking change summary and compatibility notes for the stack (Next.js, React, TypeScript, Tailwind, etc.)
   - **Excluded** — list any packages skipped due to non-LTS policy with a brief explanation

4. Call out pinned versions (no `^`/`~`) and packages in the `overrides` section.

5. Suggest update order: patch/minor first (batch), then major one at a time.

6. After applying updates, run `npm run purge:install` to clean `node_modules`, `package-lock.json` and do a fresh install.

7. Run `npm run check` to verify nothing is broken.
