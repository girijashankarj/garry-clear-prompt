/** Centralised file-name constants used across the application. */
export const FILE_NAMES = {
  /** Source entry points (informational — used by tooling / docs) */
  APP: 'src/App.tsx',
  MAIN: 'src/main.tsx',
  STYLES: 'src/index.css',
  PROMPT_TYPES: 'src/types/prompt.types.ts',

  /** Export base name (timestamp is appended at runtime) */
  EXPORT_BASE: 'prompt-export',
} as const;

/** Export file extensions */
export const EXPORT_EXTENSIONS = {
  MD: '.md',
  TXT: '.txt',
  JSON: '.json',
  ZIP: '.zip',
} as const;
