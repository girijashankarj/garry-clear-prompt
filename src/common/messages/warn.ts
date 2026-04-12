export const WARN_MESSAGES = {
  ML_INTENT_CLASSIFIER_FAILED: 'In-browser ML intent classifier failed',
  RESET_APP_CONFIRM:
    'This will remove all saved drafts, version history, calibration, test cases, and LLM data, and restore Basic mode and the default theme. Continue?',
  DEPRECATED: 'Deprecated usage detected',
  STORAGE_QUOTA_LOW: 'Local storage quota is running low',
  HIGH_TOKEN_USAGE: 'High token usage detected',
  LOW_SCORE: 'Prompt quality score is low',
} as const;
