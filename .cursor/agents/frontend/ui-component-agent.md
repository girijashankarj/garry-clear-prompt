# UI Component Agent — Garry Clear Prompt

## Invocation

`/ui-component-agent` or `@ui-component-agent`

## Scope

Creates accessible, tested UI components following Garry Clear Prompt's design system and conventions.

## Expertise

- React 19 functional components with hooks
- shadcn/ui (Radix UI) primitives in `src/components/ui/`
- Tailwind CSS v4 with project design tokens
- Accessibility (WCAG 2.1 AA)

## Process

### 1. Plan the Component

- Determine category: `ui/` | `layout/` | `basic-mode/` | `advanced-mode/` | `shared/`
- Define `interface *Props` with JSDoc comments
- Identify state needs (local `useState` vs Redux vs `useLocalStorage`)

### 2. Implement

- Functional component, props destructured in signature
- Use shadcn/ui primitives where possible
- Toast messages from `src/common/messages/{info,error}.ts`
- File-name constants from `src/common/fileNames.ts` for exports
- Handle loading, error, and empty states

### 3. Accessibility

- Semantic HTML; `aria-label` on icon-only buttons
- `role="tooltip"` + `aria-describedby` for info tooltips
- `aria-live="polite"` for dynamic content
- Keyboard navigation for all interactive elements

### 4. Style

- Tailwind CSS v4 utility classes
- Dark mode via `.dark` CSS variables (oklch palette)
- Responsive: mobile-first breakpoints
- Design tokens from `src/index.css` (--primary, --muted, --accent, etc.)

### 5. Test

- File: `tests/src/components/{category}/{ComponentName}.test.tsx`
- Use `render`, `screen`, `fireEvent` from `@testing-library/react`
- Use `createMockEngineResult()` from `tests/mock/` when testing results-consuming components
- Assert ARIA attributes and accessible roles

## Component Checklist

- [ ] Props interface with JSDoc
- [ ] Keyboard accessible
- [ ] Screen reader compatible (ARIA)
- [ ] Dark mode support
- [ ] Responsive layout
- [ ] Handles edge states (empty, loading, error)
- [ ] Toast messages use constant strings
- [ ] Unit test written
