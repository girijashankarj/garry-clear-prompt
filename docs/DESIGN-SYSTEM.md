# Design System

> Visual language, patterns, and conventions used throughout the app.

---

## Foundations

### Color Palette

The app uses Tailwind CSS v4 with CSS custom properties for theming. All colors adapt to light/dark mode.

Colors use the oklch color space for perceptual uniformity. Values are in `src/index.css`:

| Role | Light Mode | Dark Mode | CSS Variable |
|------|------------|-----------|--------------|
| Background | `oklch(1 0 0)` | `oklch(0.145 0 0)` | `--background` |
| Foreground (text) | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `--foreground` |
| Primary | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | `--primary` |
| Muted | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | `--muted` |
| Muted foreground | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | `--muted-foreground` |
| Border | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | `--border` |
| Destructive | — | — | `--destructive` |

### Score Band Colors

| Band | Score Range | Color | Tailwind Class |
|------|------------|-------|----------------|
| Excellent | 90-100 | Emerald | `text-emerald-500` |
| Good | 75-89 | Blue | `text-blue-500` |
| Average | 60-74 | Amber | `text-amber-500` |
| Weak | 40-59 | Orange | `text-orange-500` |
| Poor | 0-39 | Red | `text-red-500` |

### Accent Colors (Feature-specific)

| Feature | Color | Usage |
|---------|-------|-------|
| NLP Analysis | Pink | `text-pink-500` header icon |
| Calibration | Violet | `text-violet-500` header icon |
| Version History | Indigo | `text-indigo-500` header icon |
| Test Cases | Orange | `text-orange-500` header icon |
| Cursor Export | Cyan | `text-cyan-500` header icon |
| LLM Runner | Green | `text-green-500` header icon |
| Suggestions | Yellow | `text-yellow-500` header icon |
| Before/After | Amber | `text-amber-500` header icon |

---

## Typography

| Element | Size | Weight | Class |
|---------|------|--------|-------|
| App title | 18px | Bold | `text-lg font-bold` |
| Section title | 14px | Medium | `text-sm font-medium` |
| Body text | 14px | Normal | `text-sm` |
| Help text | 12px | Normal | `text-xs text-muted-foreground` |
| Micro label | 10px | Medium, uppercase | `text-[10px] uppercase tracking-wider` |
| Mono / code | 14px | Mono | `text-sm font-mono` |
| Score number (lg) | 30px | Bold, tabular | `text-3xl font-bold tabular-nums` |
| Score number (sm) | 20px | Bold, tabular | `text-xl font-bold tabular-nums` |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Gap between sections | 16px | `space-y-4` |
| Gap within cards | 12px | `space-y-3` |
| Card padding (content) | 24px top, 16px sides | `pt-6` + default padding |
| Card header padding | 12px bottom | `pb-3` |
| Button gap | 8px | `gap-2` |
| Grid gap | 8px | `gap-2` |
| Main content max width | 1024px | `max-w-5xl` |
| Main content padding | 16px horizontal, 24px vertical | `px-4 py-6` |

---

## Component Patterns

### Card Pattern

Every feature panel follows this pattern:

```tsx
<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <IconName className="h-4 w-4 text-{color}-500" />
      <CardTitle className="text-sm font-medium">Title</CardTitle>
      <InfoTooltip content="Description..." />
      {/* Optional: Badge or count on the right */}
      <Badge variant="secondary" className="ml-auto text-xs">count</Badge>
    </div>
  </CardHeader>
  <CardContent className="space-y-3">
    {/* Content */}
  </CardContent>
</Card>
```

### Info Tooltip Pattern

Every form field and section header includes an info tooltip:

```tsx
<div className="flex items-center gap-1.5">
  <Label className="text-sm font-medium">Field Label</Label>
  <InfoTooltip content="Explanation of what this does and why." />
</div>
```

### Char Counter Pattern

Every text input includes a character counter:

```tsx
<Textarea
  value={value}
  onChange={(e) => update(e.target.value.slice(0, MAX))}
  maxLength={MAX}
/>
<div className="flex justify-end">
  <CharCounter current={value.length} max={MAX} showWords text={value} />
</div>
```

### Option Card Pattern (Basic Mode)

Selection cards for mutually exclusive options:

```tsx
<button
  className={cn(
    'flex flex-col items-start rounded-lg border p-3 text-left',
    selected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'
  )}
>
  <span className="text-sm font-medium">{label}</span>
  <span className="text-xs text-muted-foreground">{description}</span>
</button>
```

### Toggle Row Pattern (Advanced Mode)

Switch toggles with labels:

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-1.5">
    <Label htmlFor="id" className="text-sm">Label</Label>
    <InfoTooltip content="Description..." side="right" />
  </div>
  <Switch id="id" checked={value} onCheckedChange={onChange} />
</div>
```

### Empty State Pattern

Both modes show a dashed card when no content:

```tsx
<Card className="border-dashed">
  <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[200px] text-muted-foreground">
    <IconName className="h-10 w-10 mb-3 opacity-50" />
    <p className="text-sm font-medium">Primary message</p>
    <p className="text-xs mt-1">Secondary message</p>
  </CardContent>
</Card>
```

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < 1024px (mobile/tablet) | Single column, form above results |
| >= 1024px (desktop) | Two columns side-by-side (`grid-cols-2`) |

Mobile-specific:
- Tagline in header hidden on `< sm` screens
- Export buttons wrap naturally via `flex-wrap`
- Option cards stack in 3-column grid even on mobile (compact)

---

## Animation

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Score ring | Count-up + stroke | 800ms | Ease-out cubic |
| Card hover states | Border color + bg | 200ms | Default transition |
| Tooltip | Fade + zoom in | Built-in Radix | Spring |
| Mode toggle switch | Background slide | 200ms | Default transition |
| Version actions | Opacity reveal on hover | Default | Default transition |

---

## Accessibility

### ARIA Roles

| Component | Role | Attributes |
|-----------|------|------------|
| Header | `banner` | -- |
| Footer | `contentinfo` | -- |
| ModeToggle container | `tablist` | `aria-label="Prompt mode"` |
| ModeToggle buttons | `tab` | `aria-selected` |
| ThemeToggle | button | `aria-label="Toggle theme"` |
| ScoreBadge | `meter` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| InfoTooltip trigger | button | `aria-label="More information"` |

### Keyboard Navigation

- All interactive elements are focusable
- Tab order follows visual order
- Tooltips appear on focus as well as hover
- Card-based selectors respond to click/tap

### Color Contrast

- All text meets WCAG AA contrast ratios
- Score bands use distinct hues (not just brightness)
- Destructive actions use red consistently
- Muted text uses `text-muted-foreground` which meets 4.5:1 contrast

---

## Icons

All icons come from [Lucide React](https://lucide.dev/). Standard size is `h-4 w-4` for inline, `h-3.5 w-3.5` for button prefixes.

| Icon | Usage |
|------|-------|
| `Sparkles` | App logo, Before/After, Apply button |
| `Lightbulb` | Suggestions, empty states |
| `Info` | InfoTooltip |
| `Brain` | NLP Analysis, Reasoning tier |
| `Zap` | Fast tier, token stats |
| `Cpu` | Balanced tier |
| `Activity` | Calibration |
| `History` | Version history |
| `FlaskConical` | Test cases |
| `FileCode2` | Cursor export |
| `Play` / `Lock` | LLM runner |
| `Copy` / `Download` | Export actions |
| `Save` / `Trash2` / `RotateCcw` | Version actions |
| `Sun` / `Moon` | Theme toggle |
