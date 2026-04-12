import type { PromptSectionCoverage } from '@/types/prompt.types';

/** Snippets inserted when the user adds a section from the rating panel. */
export const PROMPT_SECTION_SNIPPETS: Record<keyof PromptSectionCoverage, string> = {
  goal: '\n\nGoal:\n',
  context: '\n\nContext:\n',
  constraints: '\n\nConstraints:\n',
  output: '\n\nOutput:\n',
};

export const PROMPT_FULL_SECTION_OUTLINE = '\n\nGoal:\n\nContext:\n\nConstraints:\n\nOutput:\n';
