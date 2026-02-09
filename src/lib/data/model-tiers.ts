import type { ModelTierInfo } from '@/types/prompt.types';

export const MODEL_TIERS: ModelTierInfo[] = [
  {
    tier: 'fast',
    label: 'Fast',
    description: 'Quick, low-cost model for simple tasks',
    bestFor: [
      'Formatting and small edits',
      'Short summaries',
      'Simple translations',
      'Code formatting',
      'Boilerplate generation',
    ],
    avoidFor: [
      'Complex reasoning',
      'Architecture decisions',
      'Multi-step debugging',
      'Ambiguous requirements',
    ],
    costLevel: 'low',
    speedLevel: 'fast',
  },
  {
    tier: 'balanced',
    label: 'Balanced',
    description: 'Best for most development tasks',
    bestFor: [
      'Code generation',
      'Moderate reasoning',
      'Documentation writing',
      'Test generation',
      'Data transformation',
      'SQL queries',
    ],
    avoidFor: [
      'Complex architecture planning',
      'Deep root cause analysis',
      'Safety-critical decisions',
    ],
    costLevel: 'medium',
    speedLevel: 'medium',
  },
  {
    tier: 'reasoning',
    label: 'Reasoning',
    description: 'Deep thinking for complex, high-stakes tasks',
    bestFor: [
      'Architecture design',
      'Complex debugging',
      'Root cause analysis',
      'Security review',
      'Migration planning',
      'Multi-step problem solving',
    ],
    avoidFor: [
      'Simple formatting',
      'Boilerplate code',
      'Repetitive tasks',
    ],
    costLevel: 'high',
    speedLevel: 'slow',
  },
];

export const TASK_TYPE_LABELS: Record<string, string> = {
  refactor: 'Refactoring',
  debug: 'Debugging',
  design: 'Architecture / Design',
  sql: 'SQL / Database',
  docs: 'Documentation',
  data: 'Data Analysis',
  testing: 'Test Generation',
  general: 'General',
};
