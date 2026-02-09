import type { LintWarning } from '@/types/prompt.types';
import { LINT_RULES } from '@/lib/data/lint-rules';

export function lintPrompt(text: string): LintWarning[] {
  if (!text.trim()) return [];

  const warnings: LintWarning[] = [];

  for (const rule of LINT_RULES) {
    if (rule.check(text)) {
      warnings.push({
        rule: rule.name,
        severity: rule.severity,
        message: rule.description,
        suggestion: rule.suggestion,
      });
    }
  }

  // Sort: errors first, then warnings, then info
  const severityOrder = { error: 0, warning: 1, info: 2 };
  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return warnings;
}
