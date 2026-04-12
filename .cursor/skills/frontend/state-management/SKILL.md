# Skill: State Management — Garry Clear Prompt

## Description

Workflow for choosing and implementing the right state approach for a new feature.

## Trigger

When the user needs to manage state for a new feature or refactor existing state.

## Steps

### Step 1: Analyse Requirements

- [ ] What data needs to be managed?
- [ ] Is it UI state, persisted state, or derived?
- [ ] How many components need access?
- [ ] Does it persist across sessions?

### Step 2: Choose Approach

| Scenario               | Solution                | Location                   |
| ---------------------- | ----------------------- | -------------------------- |
| Single component       | `useState`              | Component file             |
| Complex local          | `useReducer`            | Component file             |
| App-wide (mode, theme) | Redux Toolkit           | `src/store/promptSlice.ts` |
| Persisted data         | `useLocalStorage` + lib | `src/lib/` + `src/hooks/`  |
| Derived data           | `useMemo`               | Hook or component          |

### Step 3: Implement

- [ ] Define types in `src/types/` or `src/common/`
- [ ] Storage key in `STORAGE_KEYS` (`src/common/constants.ts`)
- [ ] Lib functions return `StorageResult<T>` from `src/common/interfaces/`
- [ ] Log transitions: `loggerDebug(DEBUG_MESSAGES.*)` / `loggerInfo(INFO_MESSAGES.*)`
- [ ] Toast user messages: `toast.success(INFO_MESSAGES.*)` / `toast.error(ERROR_MESSAGES.*)`

### Step 4: Connect Components

- [ ] Use `useSelector` / `useDispatch` for Redux state
- [ ] Use `useLocalStorage` for persisted state
- [ ] Handle empty, loading, error states
- [ ] Respect max limits from constants (`MAX_PROMPT_VERSIONS`, etc.)

### Step 5: Test

- [ ] Test lib functions in `tests/src/lib/`
- [ ] Test hook with `renderHook` from `@testing-library/react`
- [ ] Mock localStorage and `crypto.randomUUID`
- [ ] Assert `StorageResult.success` and `.data`

## Completion

State management is implemented, connected, tested, and follows project conventions.
