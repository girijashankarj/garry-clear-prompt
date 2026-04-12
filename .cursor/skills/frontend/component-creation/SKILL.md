# Skill: Create UI Component — Garry Clear Prompt

## Description

Step-by-step workflow for creating accessible, tested components in the Garry Clear Prompt project.

## Trigger

When the user asks to create a new UI component.

## Steps

### Step 1: Plan

- [ ] Choose category: `ui/` | `layout/` | `basic-mode/` | `advanced-mode/` | `shared/`
- [ ] Name the component (PascalCase, e.g. `PromptDiffViewer`)
- [ ] Define purpose, parent/child relationships, and props
- [ ] Determine state needs: local `useState` | Redux `useSelector` | `useLocalStorage`

### Step 2: Create File

- [ ] `src/components/{category}/{ComponentName}.tsx`
- [ ] Define `interface {ComponentName}Props` with JSDoc
- [ ] Functional component, props destructured in signature

### Step 3: Implement

- [ ] Use shadcn/ui primitives from `src/components/ui/`
- [ ] Toast messages from `INFO_MESSAGES` / `ERROR_MESSAGES` (never hard-code strings)
- [ ] File names from `FILE_NAMES` if doing exports
- [ ] Handle loading, error, empty states

### Step 4: Accessibility

- [ ] Semantic HTML elements
- [ ] `aria-label` on icon-only buttons
- [ ] `role="tooltip"` + `aria-describedby` for tooltips
- [ ] Keyboard navigation (Tab, Enter/Space, Escape)
- [ ] Colour contrast ≥ 4.5:1

### Step 5: Style

- [ ] Tailwind CSS v4 utilities
- [ ] Responsive (mobile-first breakpoints)
- [ ] Dark mode via CSS variables
- [ ] Use project design tokens (--primary, --muted, etc.)

### Step 6: Test

- [ ] `tests/src/components/{category}/{ComponentName}.test.tsx`
- [ ] `render`, `screen`, `fireEvent` from `@testing-library/react`
- [ ] Use `createMockEngineResult()` for engine-result-consuming components
- [ ] Assert ARIA attributes and accessible roles
- [ ] Test user interactions

### Step 7: Export

- [ ] Export component and props interface from file

## Completion

Component is created, accessible, styled, tested, and follows all project conventions.
