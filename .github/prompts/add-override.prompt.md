---
agent: Plan
description: 'Add a package override in package.json and document why it exists'
---

# Add Override

Add an npm override to `package.json` for a given package name and version, and document why the override is needed.

## Required Inputs

- Package name (for example: `fast-xml-parser`)
- Override version (for example: `5.3.6`)
- Reason for override (for example: security advisory, upstream version conflict, broken transitive dependency)

## Steps

1. Open `package.json`.
2. Add or update the entry under `overrides`:
   - `"package-name": "version"`
3. Add a matching human-readable explanation in the `//overrides` section.
   - Keep existing explanations.
   - Add one new line for the new override with concrete context (affected parent dependency, issue/CVE, and fixed version when known).
4. Keep keys and notes tidy and consistent with existing formatting.
5. Return a short summary of what changed.

## Missing Context Rule

If the reason for the override is not known or cannot be inferred confidently from the repository context, do **not** invent one. Ask the user for the missing information before editing:

- What issue does this override fix?
- Which dependency path requires it?
- What version is known-good and why?
