# Contributing Guide

> How to contribute to Garry Clear Prompt.

Thank you for your interest in contributing! This guide walks you through the process.

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.19 (recommended: v24.13.0)
- **npm** >= 10
- **Git**

### Setup

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/garry-clear-prompt.git
cd garry-clear-prompt

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start the dev server
npm run dev

# Open http://localhost:5173
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

| Prefix       | Use For                                   |
| ------------ | ----------------------------------------- |
| `feature/*`  | New features or enhancements              |
| `fix/*`      | Bug fixes                                 |
| `hotfix/*`   | Critical production fixes                 |
| `docs/*`     | Documentation changes                     |
| `refactor/*` | Code improvements without behavior change |
| `test/*`     | Adding or updating tests                  |

### 2. Make Changes

Follow these conventions:

**Code Standards**

- Use TypeScript strict mode
- Use `src/common/constants` for all magic strings, storage keys, and limits
- Use `src/common/messages/{info,error,warn,debug}.ts` for all toast and log messages — never hard-code strings
- Use `src/common/fileNames.ts` for export file-name constants (`FILE_NAMES`, `EXPORT_EXTENSIONS`)
- Use `src/common/interfaces/` for typed returns: `StorageResult<T>` (storage), `ApiResult<T>` (LLM)
- Use `src/utils/loggerUtils` for structured logging in new modules
- Follow existing component patterns (see `docs/DESIGN-SYSTEM.md`)

**UI Standards**

- Add `InfoTooltip` to every new form field and section header
- Add `CharCounter` to every new text input with a character limit
- Use `APP_NAME` from constants instead of hardcoded strings
- Toast messages must use constants: `toast.success(INFO_MESSAGES.*)` / `toast.error(ERROR_MESSAGES.*)`
- Add ARIA attributes for accessibility (roles, labels, states)

**File Organization**

- Components go in the appropriate subdirectory under `src/components/`
- Engine modules go in `src/lib/engine/`
- Static data goes in `src/lib/data/`
- Types go in `src/types/prompt.types.ts`
- Constants go in `src/common/constants/index.ts`
- Message strings go in `src/common/messages/`
- Shared interfaces go in `src/common/interfaces/index.ts`

### 3. Write Tests

```bash
# Run tests
npm test

# Run a specific test file
npx jest tests/src/lib/engine/prompt-rater.test.ts

# Check test structure
npm run test:structure
```

**Requirements**:

- Every new source file must have a corresponding test in `tests/src/`
- Minimum 80% coverage on branches, functions, lines, and statements
- Use mock factories from `tests/mock/index.ts` (`createMockBasicInput`, `createMockAdvancedInput`, `createMockEngineResult`)
- Tests use `tsconfig.test.json` (extends `tsconfig.app.json`, disables `verbatimModuleSyntax` for Jest)
- Storage tests must assert on `StorageResult<T>.success` and `.data`, not raw values

### 4. Lint & Format

```bash
# Check for lint errors
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format all files
npm run format

# Check formatting
npm run format:check
```

### 5. Create a Changeset

Every PR that changes behavior must include a changeset:

```bash
npx changeset
```

This will prompt you to:

1. Select the package (there's only one)
2. Choose the bump type: `patch` (fix), `minor` (feature), `major` (breaking)
3. Write a summary of the change

The changeset file is committed with your PR.

### 6. Commit

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add prompt template library"
```

| Type       | When                                     |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or enhancement               |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation only                       |
| `refactor` | Code change without behavior change      |
| `test`     | Adding or updating tests                 |
| `chore`    | Build process, dependencies, tooling     |
| `style`    | Formatting, whitespace (no logic change) |
| `perf`     | Performance improvement                  |

**Format**: `type: lowercase description`
**Max header length**: 100 characters (enforced by commitlint)

### 7. Pre-commit Checks

Husky automatically runs on every commit:

1. **Branch name validation** -- must match allowed pattern
2. **Changeset check** -- must have a changeset file staged
3. **ESLint auto-fix** -- fixes and re-stages
4. **Prettier formatting** -- formats and re-stages
5. **Test coverage** -- must pass 80% threshold

If any check fails, the commit is blocked with a clear error message.

### 8. Push & Open a PR

```bash
git push -u origin feature/your-feature-name
```

Then open a Pull Request on GitHub against the `main` branch. Fill in the PR template.

---

## PR Checklist

Before submitting, verify:

- [ ] Code follows project conventions
- [ ] Tests added/updated for all changes
- [ ] All tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Format check passes (`npm run format:check`)
- [ ] Changeset created (`npx changeset`)
- [ ] No hardcoded secrets or PII
- [ ] InfoTooltips added for new form fields
- [ ] CharCounters added for new text inputs
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Structured logging added for new engine/utility modules

---

## Code Review

What we look for:

1. **Correctness** -- Does it work? Edge cases handled?
2. **Consistency** -- Follows existing patterns and conventions?
3. **Accessibility** -- ARIA roles, keyboard navigation, color contrast?
4. **Performance** -- No unnecessary re-renders? Proper memoization?
5. **Test quality** -- Meaningful assertions? Good coverage?
6. **Security** -- No secrets, PII, or injection risks?

---

## Project Architecture

For a deep dive into the codebase structure:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** -- System design, data flow, state management
- **[COMPONENTS.md](./COMPONENTS.md)** -- Component catalog with props and usage
- **[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)** -- Visual language, patterns, accessibility
- **[ENGINE-API.md](./ENGINE-API.md)** -- Engine module API reference
- **[TESTING.md](./TESTING.md)** -- Testing guide and conventions

---

## Cursor IDE Users

The project includes a comprehensive `.cursor/` configuration:

| Resource             | Description                                   |
| -------------------- | --------------------------------------------- |
| `.cursor/rules/`     | 10 always-applied AI rules for code standards |
| `.cursor/agents/`    | 4 specialized frontend AI agents              |
| `.cursor/skills/`    | 2 step-by-step skill workflows                |
| `.cursor/commands/`  | 4 quick-action commands                       |
| `.cursor/templates/` | Component and test scaffolding templates      |

---

## Questions?

If you're unsure about anything, open an issue or discussion on GitHub. We're happy to help!
