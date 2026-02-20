---
name: review-comments-validator
description: Validate code review comments before making changes. Use when handling reviewer findings, nitpicks, or AI-generated feedback where each claim must be checked against the current code and only valid issues should be fixed.
---

# Review Comments Validator

Validate every requested finding against the current code before editing.

## Workflow

1. Inspect each comment and map it to concrete files, symbols, and lines.
2. Read the current implementation and tests before changing anything.
3. Classify each finding as `valid`, `invalid`, or `unclear`.
4. Fix only `valid` findings.
5. For `invalid` findings, do not patch code and record why.
6. For `unclear` findings, gather additional evidence (tests, grep results, runtime behavior) before deciding.
7. Run focused verification for each applied fix.

## Decision Rules

- Prefer evidence from current code over reviewer wording.
- Reject claims based on outdated line numbers when behavior is already correct.
- Reject stylistic changes when there is no correctness, maintainability, or consistency benefit.
- Treat "consistency" claims as invalid unless confirmed by nearby project patterns.

## Response Contract

- Include a per-finding status list: `valid` / `invalid` / `unclear`.
- List concrete edits only for valid findings.
- End with a summary section that explains why invalid findings were rejected.
- If no changes are needed, explicitly state that no code was modified.
