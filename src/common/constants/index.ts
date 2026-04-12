export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export const THEME_COLORS = {
  primary: '#0ea5e9',
  background: '#0b0b0b',
  text: '#f8fafc',
} as const;

export const APP_NAME = 'Garry Clear Prompt' as const;
export const APP_VERSION = '0.1.0' as const;

/** Display names and official project URLs for the footer “open stack” strip (runtime dependencies). */
export const PUBLIC_TECH_STACK = [
  { label: 'React', href: 'https://react.dev' },
  { label: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { label: 'Vite', href: 'https://vitejs.dev' },
  { label: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { label: 'Redux Toolkit', href: 'https://redux-toolkit.js.org' },
  { label: 'Radix UI', href: 'https://www.radix-ui.com' },
  { label: 'Zod', href: 'https://zod.dev' },
  { label: 'React Hook Form', href: 'https://react-hook-form.com' },
  { label: 'compromise', href: 'https://github.com/spencermountain/compromise' },
  { label: 'Transformers.js', href: 'https://huggingface.co/docs/transformers.js' },
  { label: 'gpt-tokenizer', href: 'https://github.com/niieani/gpt-tokenizer' },
  { label: 'JSZip', href: 'https://stuk.github.io/jszip/' },
  { label: 'Sonner', href: 'https://sonner.emilkowal.ski' },
  { label: 'React Markdown', href: 'https://github.com/remarkjs/react-markdown' },
] as const;

export const STORAGE_KEYS = {
  MODE: 'gcp-mode',
  THEME: 'gcp-theme',
  BASIC_INPUT: 'gcp-basic-input',
  ADVANCED_INPUT: 'gcp-advanced-input',
  VERSIONS: 'gcp-versions',
  CALIBRATION: 'gcp-calibration',
  TEST_CASES: 'gcp-test-cases',
  LLM_SETTINGS: 'gcp-llm-settings',
  LLM_HISTORY: 'gcp-llm-history',
} as const;

export const SCORE_BANDS = {
  EXCELLENT: { min: 90, label: 'Excellent' },
  GOOD: { min: 75, label: 'Good' },
  AVERAGE: { min: 60, label: 'Average' },
  WEAK: { min: 40, label: 'Weak' },
  POOR: { min: 0, label: 'Poor' },
} as const;

export const MAX_PROMPT_VERSIONS = 50;
export const MAX_TEST_CASES_PER_SUITE = 10;
