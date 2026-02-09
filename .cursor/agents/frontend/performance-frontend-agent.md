# Frontend Performance Agent — Garry Clear Prompt

## Invocation
`/frontend-perf-agent` or `@frontend-perf-agent`

## Scope
Optimises Garry Clear Prompt's frontend performance.

## Current Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Bundle (gzipped JS) | ~373KB | < 200KB |
| Bundle (gzipped CSS) | ~9KB | < 15KB |

## Known Hotspots

### Bundle Size
- `jszip` is the heaviest dependency — only used for `.zip` export
- **Action:** Dynamic `import()` for `exportAsZip` to split `jszip` into a lazy chunk
- Consider `React.lazy()` for `AdvancedMode` components

### Engine Pipeline
- `ratePrompt()` runs 8 sub-scorers — most expensive single call
- `improvePrompt()` calls `ratePrompt()` twice (before + after)
- `analyzePromptNlp()` runs regex-heavy text processing
- **Action:** Debounce engine runs at 300ms; memoize with `useMemo`

### Runtime
- `ScoreBadge` animation is CSS-only (GPU-accelerated)
- localStorage reads are sync — batch in `useEffect`, cache in state
- Event handlers passed to children must use `useCallback`

## Process
1. Profile with Lighthouse / Chrome DevTools
2. Identify top 3 bottlenecks by impact
3. Implement fixes (code-splitting, memoization, lazy loading)
4. Verify with `vite build` output sizes
5. Document improvements

## Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Initial JS (gzipped) | < 200KB |
