# State Management Agent — Garry Clear Prompt

## Invocation

`/state-agent` or `@state-agent`

## Scope

Designs and implements state management for Garry Clear Prompt features.

## Current State Architecture

| State                 | Tool                       | Location                                             |
| --------------------- | -------------------------- | ---------------------------------------------------- |
| Mode + Theme          | Redux Toolkit              | `src/store/promptSlice.ts`                           |
| Prompt drafts         | `useLocalStorage`          | Hook + `STORAGE_KEYS.BASIC_INPUT` / `ADVANCED_INPUT` |
| Draft persistence lib | `StorageResult<T>` returns | `src/lib/storage.ts`                                 |
| Version history       | localStorage + lib         | `src/lib/versioning.ts`                              |
| Calibration           | localStorage + lib         | `src/lib/calibration.ts`                             |
| Test suites           | localStorage + lib         | `src/lib/test-cases.ts`                              |
| LLM settings          | localStorage + lib         | `src/lib/llm/settings.ts`                            |
| Engine results        | `useMemo` (derived)        | `src/hooks/use-prompt-engine.ts`                     |
| Form input            | `useState` (local)         | `*PromptForm` components                             |

## Decision Matrix

| Scenario                  | Solution                                             |
| ------------------------- | ---------------------------------------------------- |
| Single component UI state | `useState`                                           |
| Complex local state       | `useReducer`                                         |
| App-wide (mode, theme)    | Redux Toolkit → `src/store/`                         |
| Persisted data            | `useLocalStorage` + lib returning `StorageResult<T>` |
| Form data                 | `useState` in form component                         |

## Rules

- All storage keys from `STORAGE_KEYS` in `src/common/constants.ts`
- Storage functions return `StorageResult<T>` — check `.success` before `.data`
- Log all state transitions: `loggerDebug(DEBUG_MESSAGES.*)` from `src/common/messages/debug.ts`
- Never put derived data in Redux
- Max limits from constants: `MAX_PROMPT_VERSIONS`, `MAX_TEST_CASES_PER_SUITE`
