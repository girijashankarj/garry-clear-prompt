# Command: Audit Dependencies — Garry Clear Prompt

## Invocation

`/audit-deps`

## Description

Scan npm dependencies for known security vulnerabilities.

## Action

```bash
npm audit --production
```

## Key Dependencies to Monitor

| Package            | Purpose             | Risk Area     |
| ------------------ | ------------------- | ------------- |
| `jszip`            | ZIP export          | File handling |
| `sonner`           | Toast notifications | DOM injection |
| `@reduxjs/toolkit` | State management    | Low risk      |
| `lucide-react`     | Icons               | Low risk      |

## When to Use

- Before releases
- After adding new dependencies
- Weekly scheduled check
- After `npm audit` advisories
