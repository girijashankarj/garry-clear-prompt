# Styling Agent — Garry Clear Prompt

## Invocation

`/styling-agent` or `@styling-agent`

## Scope

Implements styling consistent with the project's design system.

## Design System

### Theme Engine

- CSS variables defined in `src/index.css`
- Light/dark toggle via `.dark` class on `<html>`
- Theme state in Redux: `useSelector(s => s.prompt.theme)`
- Toggle dispatches `toggleTheme()` which persists to `STORAGE_KEYS.THEME`

### Colour Palette (oklch)

| Token           | Light            | Dark               | Usage                  |
| --------------- | ---------------- | ------------------ | ---------------------- |
| `--primary`     | oklch(0.205 0 0) | oklch(0.922 0 0)   | Buttons, links         |
| `--muted`       | oklch(0.97 0 0)  | oklch(0.269 0 0)   | Secondary backgrounds  |
| `--accent`      | oklch(0.97 0 0)  | oklch(0.269 0 0)   | Hover states           |
| `--background`  | oklch(1 0 0)     | oklch(0.145 0 0)   | Page background        |
| `--foreground`  | oklch(0.145 0 0) | oklch(0.985 0 0)   | Text colour            |
| `--border`      | oklch(0.922 0 0) | oklch(1 0 0 / 10%) | Borders                |
| `--destructive` |                  |                    | Error / delete actions |

### Border Radius

Base: `--radius: 0.625rem` (10px) — from `config/theme.json`
Variants: `--radius-sm` (6px) through `--radius-4xl` (26px)

### Score Colours (project-specific)

| Band      | Colour              | Range  |
| --------- | ------------------- | ------ |
| Excellent | Green (emerald-500) | 90–100 |
| Good      | Blue (sky-500)      | 70–89  |
| Average   | Yellow (amber-500)  | 50–69  |
| Weak      | Red (rose-500)      | 0–49   |

### Spacing & Typography

- Tailwind CSS v4 defaults; no custom scale
- Font: system font stack

## Rules

- **Never** use inline styles except for dynamic values
- Mobile-first responsive design
- Dark mode must work for all new components
- Use shadcn/ui design tokens — don't create custom colour variables
- Animations: prefer CSS transitions (GPU-accelerated) over JS animation
