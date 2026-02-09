# Command: Check for Secrets — Garry Clear Prompt

## Invocation
`/check-secrets`

## Description
Scan for accidentally committed secrets. Run before pushing to the public repo.

## Action
```bash
# API keys and tokens
rg -i "(api[_-]?key|api[_-]?token|access[_-]?token|secret[_-]?key)" --type-not lock -g '!node_modules' -g '!.git' -g '!.env.example'

# Hardcoded passwords
rg -i "(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]{8,}" --type-not lock -g '!node_modules' -g '!.git'

# Private keys
rg "BEGIN (RSA |EC |DSA )?PRIVATE KEY" -g '!node_modules' -g '!.git'
```

## Project-Specific Env Vars to Watch
These should **only** appear in `.env` and `.env.example`, never in source code:
- `VITE_OPENAI_API_KEY`
- `VITE_ANTHROPIC_API_KEY`
- `VITE_BEDROCK_ACCESS_KEY_ID`
- `VITE_BEDROCK_SECRET_ACCESS_KEY`

## When to Use
- Before committing
- Before pushing to GitHub
- During code review
