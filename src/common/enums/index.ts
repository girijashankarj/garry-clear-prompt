// Using const objects instead of enum keyword (erasableSyntaxOnly is enabled)

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
export type ThemeModeValue = (typeof ThemeMode)[keyof typeof ThemeMode];

export const PromptMode = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
} as const;
export type PromptModeValue = (typeof PromptMode)[keyof typeof PromptMode];

export const DetailLevelEnum = {
  SHORT: 'short',
  MEDIUM: 'medium',
  DETAILED: 'detailed',
} as const;
export type DetailLevelValue = (typeof DetailLevelEnum)[keyof typeof DetailLevelEnum];

export const StyleToneEnum = {
  SIMPLE: 'simple',
  PROFESSIONAL: 'professional',
  FRIENDLY: 'friendly',
} as const;
export type StyleToneValue = (typeof StyleToneEnum)[keyof typeof StyleToneEnum];

export const ResponseFormatEnum = {
  STEPS: 'steps',
  EXPLANATION: 'explanation',
  BOTH: 'both',
} as const;
export type ResponseFormatValue = (typeof ResponseFormatEnum)[keyof typeof ResponseFormatEnum];

export const LintSeverityEnum = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;
export type LintSeverityValue = (typeof LintSeverityEnum)[keyof typeof LintSeverityEnum];
