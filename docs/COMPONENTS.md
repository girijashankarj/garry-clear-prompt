# Component Catalog

> Every component in the project, organized by category.

---

## UI Primitives (`src/components/ui/`)

These are [shadcn/ui](https://ui.shadcn.com/) components built on [Radix UI](https://www.radix-ui.com/) primitives. Styled with Tailwind CSS v4. (11 components)

| Component | File | Description |
|-----------|------|-------------|
| **Button** | `button.tsx` | Primary action element with variants: default, destructive, outline, secondary, ghost, link |
| **Card** | `card.tsx` | Container with Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **Badge** | `badge.tsx` | Small label with variants: default, secondary, destructive, outline |
| **Label** | `label.tsx` | Accessible form label |
| **Textarea** | `textarea.tsx` | Multi-line text input |
| **Select** | `select.tsx` | Dropdown selector with SelectTrigger, SelectContent, SelectItem, SelectValue |
| **Switch** | `switch.tsx` | Toggle switch for boolean values |
| **Tooltip** | `tooltip.tsx` | Hover/focus tooltip with TooltipProvider, Tooltip, TooltipTrigger, TooltipContent |
| **Progress** | `progress.tsx` | Horizontal progress bar |
| **Separator** | `separator.tsx` | Visual divider line |
| **ScrollArea** | `scroll-area.tsx` | Scrollable container with custom scrollbar |

---

## Layout Components (`src/components/layout/`)

### Header

```
File: Header.tsx
Props: mode, onModeChange, theme, onThemeToggle
```

Sticky top navigation bar containing:
- App logo (Sparkles icon) + name (`APP_NAME` constant)
- Tagline (hidden on mobile)
- ModeToggle (Basic/Advanced tab switcher)
- ThemeToggle (light/dark icon button)

**Accessibility**: `role="banner"`, `<nav>` with `aria-label`, decorative icon has `aria-hidden`.

### Footer

```
File: Footer.tsx
Props: none
```

Simple footer with the app philosophy tagline. Uses `APP_NAME` constant.

**Accessibility**: `role="contentinfo"`.

---

## Shared Components (`src/components/shared/`)

### InfoTooltip

```
File: InfoTooltip.tsx
Props: content (string), side? ('top' | 'right' | 'bottom' | 'left')
```

Small `(i)` icon that shows descriptive text on hover. Built on shadcn Tooltip.

**Usage**: Placed next to form labels and section headers to explain what each control does.

### CharCounter

```
File: CharCounter.tsx
Props: current (number), max? (number), showWords? (boolean), text? (string)
```

Character count display with optional:
- Word count (when `showWords` + `text` provided)
- Max limit indicator (e.g., `1,234 / 2,000 chars`)
- Color coding: amber at 90% capacity, red when over limit

### ScoreBadge

```
File: ScoreBadge.tsx
Props: score (number), band (RatingBand), size? ('sm' | 'lg')
```

Animated SVG ring that displays the prompt quality score (0-100). Features:
- Ease-out counting animation
- Color-coded by band (emerald/blue/amber/orange/red)
- Two sizes: `sm` (80px) for inline, `lg` (120px) for featured display

**Accessibility**: `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.

### ModeToggle

```
File: ModeToggle.tsx
Props: mode (AppMode), onModeChange (callback)
```

Basic/Advanced tab switcher. Styled as pill buttons.

**Accessibility**: `role="tablist"` container, `role="tab"` + `aria-selected` on each button.

### ThemeToggle

```
File: ThemeToggle.tsx
Props: theme ('light' | 'dark'), onToggle (callback)
```

Sun/Moon icon button for theme switching. Uses shadcn Button ghost variant.

**Accessibility**: `aria-label="Toggle theme"`.

### ExportButtons

```
File: ExportButtons.tsx
Props: result (PromptEngineResult)
```

Row of export action buttons. All downloaded files include a timestamp in the filename (e.g. `prompt-export_09_02_2026_14_35.md`):
- Copy Prompt (clipboard)
- Copy Meta (clipboard, shown only when meta prompt exists)
- Download .md (Markdown)
- Download .txt (plain text)
- Download .json (machine-readable)
- Download .zip (full bundle)

Uses constants from `src/common/messages/{info,error}.ts` for toast text and `src/common/fileNames.ts` for export base names.

### PromptPreview

```
File: PromptPreview.tsx
Props: title (string), content (string), maxHeight? (string)
```

Scrollable card that renders prompt content as Markdown using `react-markdown` + `remark-gfm`. Used for both structured prompts and meta prompts.

### BeforeAfterComparison

```
File: BeforeAfterComparison.tsx
Props: promptText (string), onApplyImproved? (callback)
```

Side-by-side score comparison showing:
- Original vs improved ScoreBadge (with arrow between)
- List of changes applied
- Improved prompt preview
- "Copy Improved" and "Apply" buttons

Only renders if the improver made changes.

### NlpAnalysisPanel

```
File: NlpAnalysisPanel.tsx
Props: text (string)
```

NLP analysis card showing:
- Intent badge (question/instruction/description/comparison)
- Complexity badge (simple/moderate/complex)
- Readability grade badge
- Stats grid: words, sentences, avg/sentence, nouns, verbs, questions
- Feature flags: has list, conditional, negation
- Top nouns and verbs

### VersionHistoryPanel

```
File: VersionHistoryPanel.tsx
Props: currentPrompt, currentMetaPrompt, currentScore, mode, onRestore
```

Version management card:
- Save current prompt as vN
- List of saved versions with score, timestamp, preview
- Hover actions: restore, delete
- Clear all button

### PromptSuggestionsPanel

```
File: PromptSuggestionsPanel.tsx
Props: currentText (string), mode ('basic' | 'advanced'), onApply (callback)
```

Surfaces similar prompts from version history using keyword-based Jaccard similarity. Each suggestion shows version label, match %, score, and matched keywords.

### CalibrationPanel

```
File: CalibrationPanel.tsx
Props: promptSnippet (string), tokenEstimate (TokenEstimate)
```

Token calibration tool (Advanced mode only):
- Record actual input/output token counts after running a prompt
- View correction factors (input/output multipliers)
- Recent records list
- Clear all

### TestCasesPanel

```
File: TestCasesPanel.tsx
Props: promptSnippet (string)
```

Test suite manager (Advanced mode only):
- Create named test suites
- Add input/expected-output pairs (max 10 per suite)
- Export suite as JSON
- Delete suites/cases

### CursorExportPanel

```
File: CursorExportPanel.tsx
Props: result (PromptEngineResult)
```

Cursor IDE export (Advanced mode only):
- Type selector: Rule (.mdc), Agent (.md), Skill (SKILL.md), Command (.md)
- Name input
- Preview, Copy, Download actions

### LlmRunnerPanel

```
File: LlmRunnerPanel.tsx
Props: result (PromptEngineResult)
```

LLM execution panel (currently disabled):
- Provider selector (OpenAI, Anthropic, AWS Bedrock)
- Model selector with tier badges
- Cost preview grid (estimated cost, tokens, speed)
- Expandable settings (credentials, temperature, max tokens)
- Run button (locked with "Coming Soon" badge)
- Run history placeholder

---

## Basic Mode Components (`src/components/basic-mode/`)

### BasicPromptForm

```
File: BasicPromptForm.tsx
Props: input (BasicPromptInput), onChange (callback)
```

User-friendly prompt input form:
- Main goal textarea (2,000 char limit) with word count + char counter
- Detail level selector (Short/Medium/Detailed) as option cards
- Style tone selector (Simple/Professional/Friendly)
- Response format selector (Steps/Explanation/Both)
- Rules textarea (500 char limit)
- InfoTooltip on every section

### BasicResults

```
File: BasicResults.tsx
Props: result (PromptEngineResult), rawGoal?, onApplyImproved?
```

Results panel for Basic mode:
1. Score card with ScoreBadge + suggestions
2. NLP Analysis
3. Before/After Comparison
4. Structured Prompt preview
5. Meta Prompt preview
6. Similar Prompts from History
7. Version History
8. Export (with InfoTooltip)

---

## Advanced Mode Components (`src/components/advanced-mode/`)

### AdvancedPromptForm

```
File: AdvancedPromptForm.tsx
Props: input (AdvancedPromptInput), onChange (callback)
```

Full-control prompt editor:
- Prompt textarea (10,000 char limit) with word count + char counter + token estimate
- Meta prompt textarea (4,000 char limit)
- Task configuration grid: task type, complexity, risk, context size, output size, audience
- Output format toggles: plan first, strict JSON, code, tables, diagrams, examples, tool use
- InfoTooltip on every section and toggle

### AdvancedResults

```
File: AdvancedResults.tsx
Props: result (PromptEngineResult), rawPrompt?, onApplyImproved?
```

Results panel for Advanced mode, organized into sections:
1. **Analysis**: Rating, NLP, Lint warnings
2. **Improvement**: Before/After comparison
3. **Intelligence**: Model advisor, Token estimator, MCP advisor, Calibration
4. **Prompt Output**: Structured prompt, Meta prompt previews
5. **History**: Similar prompts, Version history
6. **Testing**: Test cases
7. **Export**: Multi-format export, Cursor IDE export
8. **LLM Runner**: Run prompt (disabled)

### PromptRatingPanel

```
File: PromptRating.tsx
Props: rating (PromptRating)
```

Detailed rating breakdown with:
- ScoreBadge (lg) + top 3 suggestions
- 5 dimension progress bars with scores and feedback

### ModelAdvisorPanel

```
File: ModelAdvisor.tsx
Props: recommendation (ModelRecommendation)
```

Model tier recommendation card with confidence badge, recommended tier card, reason, alternative, and avoid.

### TokenEstimatorPanel

```
File: TokenEstimator.tsx
Props: estimate (TokenEstimate)
```

Token range display: input, output, total (low-high).

### LintWarningsPanel

```
File: LintWarnings.tsx
Props: warnings (LintWarning[])
```

List of lint warnings sorted by severity (error > warning > info).

### McpAdvisorPanel

```
File: McpAdvisor.tsx
Props: suggestions (McpToolSuggestion[])
```

MCP tool suggestions with permission levels, safe environments, and risk notes.
