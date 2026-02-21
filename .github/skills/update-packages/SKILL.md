---
name: update-packages
description: Analyze npm dependencies in package.json and recommend safe upgrades with an LTS policy. Use when asked to check outdated packages, propose update commands, separate patch/minor from major upgrades, or enforce Node.js/@types/node even-major LTS rules.
---

# Update Packages

Analyze `dependencies` and `devDependencies` in `package.json` and produce actionable, low-risk update guidance.

## Workflow

1. Run `npm outdated --json` to collect update data.
2. For packages that need more detail, run `npm view <package> versions --json`.
3. Build two alphabetical tables: **Dependencies** and **Dev Dependencies**.
4. Use this schema:

| Package | Current | Latest (Same Major) | Latest | Recommendation |
| --- | --- | --- | --- | --- |

5. Set **Recommendation** to one of:
- **Patch/Minor**: safe update with no breaking changes.
- **Major available**: newer major exists; review changelog.
- **Skip (non-LTS)**: latest major is non-LTS and must be excluded.
- **Up to date**: already at latest.
6. Bold the **Latest** value when it is a major bump.
7. Flag deprecated or vulnerable packages when discovered.

## LTS Rules

- Enforce LTS-only updates for packages with LTS cadences.
- For this project, apply the rule to:
  - `node` / `@types/node`: only even major versions (20, 22, 24, 26, ...).
- If the newest release is non-LTS, show it in the table but mark recommendation as **Skip (non-LTS)** and exclude it from update commands.
- If additional LTS-governed packages are discovered, apply the same policy and note them.

## Output Requirements

1. Provide grouped update commands:
- **Safe updates**: one `npm install` command containing all patch/minor updates.
- **Major updates**: one `npm install` command per package plus a short breaking-change and stack-compatibility note (Next.js, React, TypeScript, Tailwind, etc., as relevant).
- **Excluded**: list skipped non-LTS packages with a short reason.
2. Call out pinned versions (no `^` or `~`) and entries under `overrides`.
3. Evaluate whether each `overrides` entry is still needed:
- Check whether upstream dependencies now include the required fix/version.
- Recommend removing overrides that are no longer necessary.
- Clearly list which overrides should remain and why.
4. Recommend execution order: patch/minor batch first, then major updates one at a time.
5. After applying updates, run:
- `npm run purge:install`
- `npm run check`
