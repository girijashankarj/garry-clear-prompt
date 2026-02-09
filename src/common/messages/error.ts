export const ERROR_MESSAGES = {
  UNEXPECTED: 'An unexpected error occurred',
  STORAGE_FULL: 'Local storage is full',
  STORAGE_READ_FAILED: 'Failed to read from storage',
  STORAGE_WRITE_FAILED: 'Failed to save to storage',
  EXPORT_FAILED: 'Failed to create export',
  CLIPBOARD_FAILED: 'Failed to copy to clipboard',
  PROMPT_EMPTY: 'Write a prompt first',
  INVALID_INPUT: 'Invalid input provided',
  LLM_DISABLED: 'LLM integration is not enabled yet',
  ZIP_FAILED: 'Failed to create ZIP',
} as const;
