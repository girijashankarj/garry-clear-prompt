# Engine API Reference

> Pure function APIs for all engine modules.

---

## Prompt Builder

**File**: `src/lib/engine/prompt-builder.ts`

### `buildPromptFromBasic(input: BasicPromptInput): string`

Constructs a structured prompt from basic mode inputs. Combines goal, detail level, style tone, response format, and optional rules into a multi-paragraph prompt.

### `buildPromptFromAdvanced(input: AdvancedPromptInput): string`

Constructs a structured prompt from advanced mode inputs. Includes the main prompt, plan-first instruction, output format directives, and audience targeting.

### `buildMetaPrompt(input: AdvancedPromptInput): string`

Generates a meta prompt (system instructions). If `input.metaPrompt` is provided, returns it as-is. Otherwise, auto-generates from task type, complexity, risk level, and audience.

---

## Meta Prompt Builder

**File**: `src/lib/engine/meta-prompt-builder.ts`

### `buildMetaPromptFromBasic(input: BasicPromptInput): string`

Generates a meta prompt for basic mode from style tone, detail level, response format, and rules.

---

## Prompt Rater

**File**: `src/lib/engine/prompt-rater.ts`

### `ratePrompt(text: string): PromptRating`

Scores a prompt across 5 dimensions:

| Dimension | Max Score | Key Checks |
|-----------|-----------|------------|
| Clarity | 25 | Action verb, specificity, single task, word count |
| Constraints | 20 | Output format, length limits, do/don't rules, scope |
| Structure | 20 | Line breaks, labeled sections, bullet points, paragraphs |
| Token Efficiency | 20 | Filler words, repetition, conversational padding |
| Risk Penalty | -15 | Open-ended scope, multiple tasks, missing audience |

**Returns**: `{ totalScore, band, dimensions, suggestions }`

---

## Prompt Linter

**File**: `src/lib/engine/prompt-linter.ts`

### `lintPrompt(text: string): LintWarning[]`

Runs 15+ lint rules against the prompt text. Rules are defined in `src/lib/data/lint-rules.ts`.

**Rule categories**:
- **Quality**: missing goal, too vague, no output format, no length constraint, too many tasks, open-ended, repetition, no examples
- **Efficiency**: emotional/filler language, absolutist language
- **Security**: potential secret exposure, potential PII, prompt injection patterns
- **Conflict**: conflicting instructions (brief + detailed)

**Severity levels**: `error` > `warning` > `info`

---

## Token Estimator

**File**: `src/lib/engine/token-estimator.ts`

### `estimateTokens(promptText, outputSize?, formatOptions?): TokenEstimate`

Estimates input and output token ranges.

**Input tokens**: `chars/5` (low) to `chars/3` (high) — English heuristic.

**Output tokens**: Based on output size selector + format multipliers:

| Format | Multiplier |
|--------|-----------|
| Strict JSON | 1.1x |
| Include code | 1.5x |
| Include tables | 1.2x |
| Include diagrams | 1.5x |
| Include examples | 1.4x |

### `estimateInputTokens(text: string): { low, high }`

Standalone input token estimator.

### `estimateOutputTokens(outputSize, formatOptions): { low, high }`

Standalone output token estimator.

---

## Model Advisor

**File**: `src/lib/engine/model-advisor.ts`

### `recommendModel(input): ModelRecommendation`

Rule-based model tier recommendation using weighted scoring across:
- Task type (refactor, debug, design, sql, docs, data, testing, general)
- Complexity (low, medium, high)
- Risk level (low, medium, high)
- Context size (small, medium, large)
- Tool use requirement

**Returns**: `{ recommended, alternative, avoid, confidence, reason }`

**Tiers**: `fast`, `balanced`, `reasoning`
**Confidence**: `high` (gap >= 4), `medium` (gap >= 2), `low`

---

## MCP Advisor

**File**: `src/lib/engine/mcp-advisor.ts`

### `suggestMcpTools(promptText: string): McpToolSuggestion[]`

Keyword-based matching against known MCP tools (Postgres, Playwright, Figma, GitHub, Filesystem, OpenSearch).

### `shouldUseMcp(promptText: string): boolean`

Heuristic: returns `true` if the prompt mentions data/action keywords and is not purely reasoning/planning.

---

## NLP Analyzer

**File**: `src/lib/engine/nlp-analyzer.ts`

### `analyzePromptNlp(text: string): NlpAnalysis`

Full NLP analysis using `compromise`:

| Field | Type | Description |
|-------|------|-------------|
| intent | `PromptIntent` | question, instruction, description, comparison, unknown |
| complexity | `ComplexityLevel` | simple, moderate, complex |
| sentenceCount | number | |
| wordCount | number | |
| avgWordsPerSentence | number | |
| questionCount | number | |
| verbCount | number | |
| nounCount | number | |
| adjectiveCount | number | |
| topNouns | string[] | Top 5 unique nouns |
| topVerbs | string[] | Top 5 unique verbs |
| hasList | boolean | Detects bullet/numbered lists |
| hasConditional | boolean | if, when, unless, etc. |
| hasNegation | boolean | not, don't, never, etc. |
| readabilityGrade | number | Flesch-Kincaid grade level |

---

## Prompt Improver

**File**: `src/lib/engine/prompt-improver.ts`

### `improvePrompt(text: string): PromptImprovement`

Auto-rewrites a prompt by:
1. Removing filler words ("please", "I think", "maybe")
2. Removing conversational padding ("I want you to", "could you")
3. Capitalizing first letter
4. Adding output format instruction if missing
5. Adding length constraint if missing
6. Suggesting audience specification for complex prompts

**Returns**: `{ original, improved, originalRating, improvedRating, changes }`

---

## Storage

**File**: `src/lib/storage.ts`

All storage functions return typed `StorageResult<T>` from `src/common/interfaces/`:

```typescript
interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

| Function | Returns | Description |
|----------|---------|-------------|
| `saveBasicDraft(input)` | `StorageResult<void>` | Save basic mode draft to localStorage |
| `loadBasicDraft()` | `StorageResult<BasicPromptInput>` | Load basic mode draft |
| `clearBasicDraft()` | `void` | Remove basic mode draft |
| `saveAdvancedDraft(input)` | `StorageResult<void>` | Save advanced mode draft to localStorage |
| `loadAdvancedDraft()` | `StorageResult<AdvancedPromptInput>` | Load advanced mode draft |
| `clearAdvancedDraft()` | `void` | Remove advanced mode draft |

All save/load functions use message constants from `src/common/messages/debug.ts` and `src/common/messages/error.ts` for structured logging.

---

## Versioning

**File**: `src/lib/versioning.ts`

| Function | Description |
|----------|-------------|
| `getPromptVersions(mode?)` | List all versions, optionally filtered by mode |
| `savePromptVersion(prompt, meta, score, mode)` | Save a new version (auto-increments) |
| `deletePromptVersion(id)` | Delete a version by ID |
| `clearPromptVersions(mode?)` | Clear all or mode-specific versions |

Max versions: `MAX_PROMPT_VERSIONS` (50) from constants.

---

## Calibration

**File**: `src/lib/calibration.ts`

| Function | Description |
|----------|-------------|
| `addCalibrationRecord(record)` | Add actual token usage record |
| `getCalibrationRecords()` | List all records |
| `clearCalibrationRecords()` | Clear all records |
| `getCalibrationStats()` | Compute correction factors from records |

Max records: 100.

---

## Test Cases

**File**: `src/lib/test-cases.ts`

| Function | Description |
|----------|-------------|
| `getTestSuites()` | List all test suites |
| `createTestSuite(name, promptSnippet)` | Create a new suite |
| `addTestCase(suiteId, input, expected, notes?)` | Add a test case |
| `removeTestCase(suiteId, caseId)` | Remove a test case |
| `deleteTestSuite(suiteId)` | Delete a suite |
| `exportTestSuiteAsJson(suite)` | Export as JSON string |

Max cases per suite: `MAX_TEST_CASES_PER_SUITE` (10) from constants.

---

## Prompt Suggestions

**File**: `src/lib/prompt-suggestions.ts`

### `findSimilarPrompts(text, maxResults?, mode?): PromptSuggestion[]`

Keyword-based Jaccard similarity search across version history. Filters stop words, requires minimum 1 keyword match and >5% similarity score.

---

## Utilities

**File**: `src/lib/utils.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `cn(...inputs)` | `(...inputs: ClassValue[]) => string` | Tailwind class merging via `clsx` + `twMerge` |
| `copyToClipboard(text)` | `(text: string) => Promise<boolean>` | Copy to clipboard with fallback for older browsers |
| `downloadFile(content, filename, mimeType)` | `(content: string, filename: string, mimeType: string) => void` | Trigger a file download from a string |
| `formatExportTimestamp(date?)` | `(date?: Date) => string` | Format date as `DD_MM_YYYY_HH_MM` (e.g. `09_02_2026_14_35`) |
| `getExportFileName(base, ext)` | `(base: string, ext: string) => string` | Build timestamped filename (e.g. `prompt-export_09_02_2026_14_35.md`) |

---

## LLM Adapter

**File**: `src/lib/llm/adapter.ts` (currently disabled)

| Function | Returns | Description |
|----------|---------|-------------|
| `runPrompt(prompt, systemPrompt, settings)` | `Promise<LlmRunResult>` | Run prompt against configured LLM (throws `LlmNotEnabledError`) |
| `runPromptSafe(prompt, systemPrompt, settings)` | `Promise<ApiResult<LlmRunResult>>` | Safe wrapper returning typed `ApiResult<T>` |
| `preEstimateCost(settings, inputTokens, outputTokens)` | `number` | Pre-flight cost estimate |

```typescript
interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```
