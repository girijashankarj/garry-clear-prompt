# Testing Guide

> How to write, run, and maintain tests.

---

## Overview

| Tool | Purpose |
|------|---------|
| Jest | Test runner, assertions, coverage |
| React Testing Library | Component rendering and DOM queries |
| ts-jest | TypeScript transformation |
| jest-environment-jsdom | Browser-like environment |
| identity-obj-proxy | CSS module mocking |

---

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npx jest --watch

# Run a single test file
npx jest tests/src/lib/engine/prompt-rater.test.ts

# Check test structure (every src file has a corresponding test)
npm run test:structure
```

---

## Coverage Requirements

| Metric | Threshold |
|--------|-----------|
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |
| Statements | 80% |

Coverage is enforced by Jest config (`jest.config.cjs`).

---

## Directory Structure

Tests mirror the `src/` directory (28 suites, 269 tests):

```
tests/
├── mock/
│   └── index.ts                        # Shared mock factories
└── src/
    ├── lib/
    │   ├── engine/
    │   │   ├── prompt-builder.test.ts
    │   │   ├── prompt-rater.test.ts
    │   │   ├── prompt-linter.test.ts
    │   │   ├── prompt-improver.test.ts
    │   │   ├── token-estimator.test.ts
    │   │   ├── model-advisor.test.ts
    │   │   ├── mcp-advisor.test.ts
    │   │   ├── nlp-analyzer.test.ts
    │   │   └── meta-prompt-builder.test.ts
    │   ├── exporters/
    │   │   ├── markdown-exporter.test.ts
    │   │   ├── text-exporter.test.ts
    │   │   ├── json-exporter.test.ts
    │   │   ├── cursor-exporter.test.ts
    │   │   └── zip-exporter.test.ts
    │   ├── calibration.test.ts
    │   ├── versioning.test.ts
    │   ├── storage.test.ts
    │   ├── test-cases.test.ts
    │   └── prompt-suggestions.test.ts
    ├── hooks/
    │   ├── use-local-storage.test.ts
    │   ├── use-mode.test.ts
    │   └── use-prompt-engine.test.ts
    ├── components/
    │   └── shared/
    │       ├── ScoreBadge.test.tsx
    │       ├── ModeToggle.test.tsx
    │       ├── InfoTooltip.test.tsx
    │       ├── CharCounter.test.tsx
    │       └── ExportButtons.test.tsx
    └── utils/
        └── loggerUtils.test.ts
```

---

## Mock Factories

`tests/mock/index.ts` provides shared test data:

### `createMockPrompt(overrides?)`

Returns a mock prompt string. Options:
- `text`: Custom text (overrides length selection)
- `length`: `'short'` | `'medium'` | `'long'`

### `createMockBasicInput(overrides?)`

Returns a `BasicPromptInput` with sensible defaults:
```typescript
{
  goal: 'Create a React component that displays a user profile card',
  detailLevel: 'medium',
  styleTone: 'simple',
  responseFormat: 'steps',
  rules: '',
}
```

### `createMockAdvancedInput(overrides?)`

Returns an `AdvancedPromptInput` with sensible defaults.

### `createMockEngineResult(overrides?)`

Returns a complete `PromptEngineResult` with realistic defaults for testing exporters and results-consuming components:
```typescript
{
  structuredPrompt: 'Create a REST API endpoint...',
  metaPrompt: 'You are an expert backend developer.',
  rating: { totalScore: 72, band: 'average', ... },
  tokenEstimate: { inputTokensLow: 50, ... },
  modelRecommendation: { recommended: 'balanced', ... },
  mcpSuggestions: [],
  lintWarnings: [...],
}
```

---

## Writing Tests

### Engine Module Tests

Pure functions are the easiest and highest-value tests:

```typescript
import { ratePrompt } from '@/lib/engine/prompt-rater';

describe('ratePrompt', () => {
  it('returns zero score for empty text', () => {
    const result = ratePrompt('');
    expect(result.totalScore).toBe(0);
    expect(result.band).toBe('poor');
  });

  it('gives higher score for well-structured prompt', () => {
    const good = ratePrompt(
      'Create a REST API endpoint for user authentication.\n\n' +
      'Output format: JSON with status codes.\n\n' +
      'Constraints: max 200 lines, include error handling.'
    );
    expect(good.totalScore).toBeGreaterThan(60);
  });
});
```

### Component Tests

Use React Testing Library for component behavior:

```typescript
import { render, screen } from '@testing-library/react';
import { ScoreBadge } from '@/components/shared/ScoreBadge';

describe('ScoreBadge', () => {
  it('renders the score and band label', () => {
    render(<ScoreBadge score={85} band="good" />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '85');
  });
});
```

### Test Naming Convention

```
describe('moduleName', () => {
  it('does X when Y', () => { ... });
  it('returns Z for edge case', () => { ... });
  it('handles empty input gracefully', () => { ... });
});
```

---

## What to Test

### Must Test

- All engine modules (pure functions)
- Utility functions (loggerUtils, storage helpers)
- Custom hooks (useLocalStorage, usePromptEngine)
- Critical component interactions (form submission, export)
- Storage functions — assert on `StorageResult<T>.success` and `.data`, not raw values

### Should Test

- Component rendering (key elements present)
- Accessibility attributes (roles, aria-labels)
- Error states and empty states

### Don't Test

- shadcn/ui primitives (tested upstream)
- CSS class names
- Implementation details (internal state shape)
- Third-party library internals

---

## TypeScript Configuration

Tests use a dedicated `tsconfig.test.json` that extends `tsconfig.app.json` with these overrides:

- `verbatimModuleSyntax: false` — allows CJS-style imports required by Jest/ts-jest
- `erasableSyntaxOnly: false` — permits `import type` erasure in test transforms
- `esModuleInterop: true` — enables default imports from CJS modules
- `types: ["jest", "@testing-library/jest-dom", "vite/client"]` — provides Jest and DOM matcher types
- `noUnusedLocals` / `noUnusedParameters` disabled for test flexibility

The Jest config (`jest.config.cjs`) references this via:
```javascript
transform: {
  '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
}
```

## Path Aliases

The Jest config maps `@/` to `<rootDir>/src/`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

---

## CSS Mocking

CSS imports are mocked via `identity-obj-proxy`:

```javascript
moduleNameMapper: {
  '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
}
```

This returns the class name as-is, so `styles.container` becomes `"container"`.
