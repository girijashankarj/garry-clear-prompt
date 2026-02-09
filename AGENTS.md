# AGENTS.md — Instructions for AI Agents

> This file provides instructions to AI agents working in this repository.

## Project Overview
This is **Garry Clear Prompt**, a standalone web app for prompt quality and efficiency. It rates, lints, and improves prompts with NLP analysis, model recommendations, token estimation, and export capabilities.

## Tech Stack
- TypeScript / React 19 / Vite / Tailwind CSS v4 / shadcn/ui
- Redux Toolkit for state management
- React Hook Form + Zod for form handling
- Jest + Testing Library for tests
- ESLint 9 (flat config) + Prettier for code quality

## Key Principles

### 1. Token Efficiency
- NEVER auto-run full test suites (100K+ tokens)
- NEVER auto-run full lint (50K+ tokens)
- Use `read_lints` tool instead of lint commands
- Run type-check (`tsc -b`, ~10K tokens) as the default validation
- Require explicit user confirmation for 50K+ token operations

### 2. Security
- NEVER hardcode secrets, API keys, passwords
- NEVER log PII (names, emails, SSN, credit cards)
- Use environment variables for all secrets
- Use generic placeholders for infrastructure

### 3. Code Conventions
- All shared types in `src/common/`
- Business logic in `src/lib/` (engine, exporters, data, llm)
- Components in `src/components/` (ui, layout, basic-mode, advanced-mode, shared)
- Hooks in `src/hooks/`
- Store in `src/store/`
- Utilities in `src/utils/`
- Path alias `@/` resolves to `src/`
- Import order: external → internal → relative

### 4. Testing
- Minimum 80% code coverage
- Mock all external dependencies
- Follow AAA pattern (Arrange-Act-Assert)
- Tests mirror `src/` structure in `tests/src/`

## Configuration
Project settings are in `.cursor/config/project.json`.

## Component Map
- **Rules**: `.cursor/rules/*.mdc` — Always-applied standards
- **Agents**: `.cursor/agents/*.md` — Specialized AI assistants
- **Skills**: `.cursor/skills/*/SKILL.md` — Step-by-step workflows
- **Commands**: `.cursor/commands/*.md` — Quick actions
- **Hooks**: `.cursor/hooks/*.sh` — Automation scripts
