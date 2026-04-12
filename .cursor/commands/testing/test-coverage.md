# Command: Check Coverage — Garry Clear Prompt

## Invocation

`/check-coverage`

## Description

Run full test coverage and check against the 80% minimum threshold.

## Action

```bash
jest --coverage
```

## Current Stats

- **Suites:** 28
- **Tests:** 269
- **Threshold:** 80% minimum

## When to Use

- Before submitting a PR
- After writing new tests
- Periodic coverage check

## Note

This is an expensive operation (~100K tokens). Prefer `/test-single` for quick validation.
