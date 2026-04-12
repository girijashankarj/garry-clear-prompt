/**
 * Maps lint rule display names (see `LINT_RULES[].name`) to the closest rating dimension
 * so users can connect lint rows to the score breakdown.
 */
export const LINT_RULE_RATING_FOCUS: Record<string, string> = {
  'Missing clear goal': 'Clarity',
  'Overly vague language': 'Clarity',
  'Missing output format': 'Constraints',
  'No length constraint': 'Constraints',
  'Potentially conflicting instructions': 'Constraints',
  'Multiple tasks in one prompt': 'Risk',
  'Emotional or filler language': 'Token efficiency',
  'Repetitive content': 'Token efficiency',
  'No audience specified': 'Risk',
  'Open-ended request': 'Risk',
  'Absolutist language': 'Constraints',
  'No examples provided': 'Constraints',
  'Potential secret exposure': 'Security',
  'Potential PII in prompt': 'Security',
  'Prompt injection pattern': 'Security',
};

export function ratingFocusForLintRule(ruleName: string): string | undefined {
  return LINT_RULE_RATING_FOCUS[ruleName];
}
