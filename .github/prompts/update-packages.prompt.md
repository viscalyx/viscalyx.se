```prompt
# Update Packages

Check all dependencies and devDependencies in `package.json` for available updates.

## Steps

1. Run `npm outdated --json` to gather version data. For packages needing more detail, use `npm view <package> versions --json`.

2. Present a table for **Dependencies** and **Dev Dependencies** (sorted alphabetically):

| Package | Current | Latest (Same Major) | Latest | Recommendation |
| ------- | ------- | ------------------- | ------ | -------------- |

Where **Recommendation** is one of:
- **Patch/Minor** — safe update, no breaking changes
- **Major available** — new major version, review changelog
- **Up to date** — already latest

Bold the **Latest** column when a major bump is available. Flag deprecated or vulnerable packages.

3. Provide update commands:
   - **Safe updates** — single `npm install` for all patch/minor updates
   - **Major updates** — separate `npm install` per package with breaking change summary and compatibility notes for the stack (Next.js, React, TypeScript, Tailwind, etc.)

4. Call out pinned versions (no `^`/`~`) and packages in the `overrides` section.

5. Suggest update order: patch/minor first (batch), then major one at a time.

6. After applying updates, run `npm run purge:install` to clean `node_modules` and `package-lock.json`, then do a fresh install.

7. Run `npm run check` to verify nothing is broken.
```
