# Command: Test Single File — Garry Clear Prompt

## Invocation

`/test-single`

## Description

Run tests for a single file instead of the full suite. Saves ~95K tokens.

## Action

```bash
jest --testPathPattern={file_path}
```

## Examples

```bash
# Test a specific engine module
jest --testPathPattern=tests/src/lib/engine/prompt-rater

# Test a specific component
jest --testPathPattern=tests/src/components/shared/ExportButtons

# Test a specific hook
jest --testPathPattern=tests/src/hooks/use-prompt-engine

# Test storage
jest --testPathPattern=tests/src/lib/storage
```

## Token Cost

~5K tokens (vs ~100K for full suite)
