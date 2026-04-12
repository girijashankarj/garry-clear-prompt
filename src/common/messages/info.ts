export const INFO_MESSAGES = {
  APP_START: 'Application started',
  THEME_READY: 'Theme initialized',
  PROMPT_RATED: 'Prompt rated',
  PROMPT_IMPROVED: 'Prompt improved',
  PROMPT_EXPORTED: 'Prompt exported',
  PROMPT_COPIED: 'Prompt copied to clipboard',
  META_COPIED: 'Meta prompt copied to clipboard',
  VERSION_SAVED: 'Prompt version saved',
  VERSION_RESTORED: 'Prompt version restored',
  VERSION_DELETED: 'Version deleted',
  VERSION_CLEARED: 'Version history cleared',
  CALIBRATION_RECORDED: 'Calibration record added',
  CALIBRATION_CLEARED: 'Calibration data cleared',
  TEST_SUITE_CREATED: 'Test suite created',
  EXPORT_MD: 'Downloaded as Markdown',
  EXPORT_TXT: 'Downloaded as Text',
  EXPORT_JSON: 'Downloaded as JSON',
  EXPORT_ZIP: 'Downloaded as ZIP',
  IMPROVED_COPIED: 'Improved prompt copied to clipboard',
  IMPROVED_APPLIED: 'Improved prompt applied',
  ML_CHECKLIST_REFINED: 'Checklist updated using local ML intent',
  ML_CHECKLIST_SKIPPED_LOW_CONFIDENCE: 'ML had low confidence; checklist left unchanged',
  APP_RESET: 'Application reset to defaults',
} as const;

/** User-facing copy for the rating card and improvement flow (UI only). */
export const RATING_GUIDANCE = {
  SUGGESTED_NEXT_STEPS: 'Suggested next steps',
  SCORE_EXPLAINER:
    'Follow the steps below, use the “Next” hints under each dimension, and add missing sections where shown to raise your quality score toward 100.',
  IMPROVEMENT_HINT_BASIC:
    'Use Before / After below to try an automatic rewrite and compare scores.',
  IMPROVEMENT_HINT_ADVANCED:
    'Open the Improvement section for Before / After and score comparison.',
  NO_AUTO_IMPROVE_TITLE: 'No automatic quick edits',
  NO_AUTO_IMPROVE_BODY:
    'This text did not need the usual quick polish, but your score can still go up. Use the suggestions and “Next” hints in the rating card above, insert any missing sections, then edit your prompt directly.',
  SHOW_LESS: 'Show less',
  SHOW_ALL: (n: number) => `Show all ${n} suggestions`,
  ML_REFINE_BUTTON: 'Refine checklist (local ML)',
  ML_REFINE_HELP:
    'Runs a small Hugging Face model in your browser on demand. First use downloads model weights; your prompt stays on this device.',
} as const;

/** Footer: transparency / trust copy (UI only). */
export const FOOTER_COPY = {
  OPEN_SOURCE_INTRO:
    'Runs in your browser. Built with open-source libraries — each link opens the project’s site in a new tab.',
  STACK_NAV_LABEL: 'Open-source libraries used in this application',
  STACK_LINK_SUFFIX: 'project website (opens in new tab)',
} as const;
