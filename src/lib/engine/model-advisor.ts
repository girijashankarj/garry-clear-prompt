import type {
  ModelRecommendation,
  TaskType,
  Complexity,
  RiskLevel,
  ContextSize,
} from '@/types/prompt.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

interface ModelAdvisorInput {
  taskType: TaskType;
  complexity: Complexity;
  riskLevel: RiskLevel;
  contextSize: ContextSize;
  needsToolUse: boolean;
}

// Scoring weights
const TASK_SCORES: Record<TaskType, { fast: number; balanced: number; reasoning: number }> = {
  refactor: { fast: 1, balanced: 3, reasoning: 2 },
  debug: { fast: 0, balanced: 2, reasoning: 3 },
  design: { fast: 0, balanced: 1, reasoning: 3 },
  sql: { fast: 1, balanced: 3, reasoning: 2 },
  docs: { fast: 2, balanced: 3, reasoning: 1 },
  data: { fast: 1, balanced: 3, reasoning: 2 },
  testing: { fast: 2, balanced: 3, reasoning: 1 },
  general: { fast: 2, balanced: 3, reasoning: 1 },
};

const COMPLEXITY_SCORES: Record<Complexity, { fast: number; balanced: number; reasoning: number }> =
  {
    low: { fast: 3, balanced: 2, reasoning: 0 },
    medium: { fast: 1, balanced: 3, reasoning: 2 },
    high: { fast: 0, balanced: 1, reasoning: 3 },
  };

const RISK_SCORES: Record<RiskLevel, { fast: number; balanced: number; reasoning: number }> = {
  low: { fast: 3, balanced: 2, reasoning: 0 },
  medium: { fast: 1, balanced: 3, reasoning: 2 },
  high: { fast: 0, balanced: 1, reasoning: 3 },
};

const CONTEXT_SCORES: Record<ContextSize, { fast: number; balanced: number; reasoning: number }> = {
  small: { fast: 3, balanced: 2, reasoning: 1 },
  medium: { fast: 2, balanced: 3, reasoning: 2 },
  large: { fast: 1, balanced: 2, reasoning: 3 },
};

export function recommendModel(input: ModelAdvisorInput): ModelRecommendation {
  const scores = { fast: 0, balanced: 0, reasoning: 0 };

  // Add task type scores
  const taskScore = TASK_SCORES[input.taskType];
  scores.fast += taskScore.fast;
  scores.balanced += taskScore.balanced;
  scores.reasoning += taskScore.reasoning;

  // Add complexity scores
  const complexityScore = COMPLEXITY_SCORES[input.complexity];
  scores.fast += complexityScore.fast;
  scores.balanced += complexityScore.balanced;
  scores.reasoning += complexityScore.reasoning;

  // Add risk scores
  const riskScore = RISK_SCORES[input.riskLevel];
  scores.fast += riskScore.fast;
  scores.balanced += riskScore.balanced;
  scores.reasoning += riskScore.reasoning;

  // Add context size scores
  const contextScore = CONTEXT_SCORES[input.contextSize];
  scores.fast += contextScore.fast;
  scores.balanced += contextScore.balanced;
  scores.reasoning += contextScore.reasoning;

  // Tool use bonus for balanced/reasoning
  if (input.needsToolUse) {
    scores.balanced += 1;
    scores.reasoning += 2;
    scores.fast -= 1;
  }

  // Rank tiers
  const tiers: Array<{ tier: 'fast' | 'balanced' | 'reasoning'; score: number }> = [
    { tier: 'fast', score: scores.fast },
    { tier: 'balanced', score: scores.balanced },
    { tier: 'reasoning', score: scores.reasoning },
  ];
  tiers.sort((a, b) => b.score - a.score);

  const recommended = tiers[0].tier;
  const alternative = tiers[1].tier;
  const avoid = tiers[2].score <= 2 ? tiers[2].tier : null;

  // Calculate confidence based on score gap
  const gap = tiers[0].score - tiers[1].score;
  const confidence = gap >= 4 ? 'high' : gap >= 2 ? 'medium' : 'low';

  // Generate reason
  const reasons: string[] = [];
  if (input.complexity === 'high') reasons.push('high complexity');
  if (input.riskLevel === 'high') reasons.push('high risk');
  if (input.contextSize === 'large') reasons.push('large context');
  if (input.needsToolUse) reasons.push('tool use needed');
  if (input.complexity === 'low' && input.riskLevel === 'low')
    reasons.push('simple, low-risk task');

  const reasonStr =
    reasons.length > 0
      ? `Recommended based on: ${reasons.join(', ')}`
      : `Best general-purpose option for ${input.taskType} tasks`;

  loggerDebug(
    DEBUG_MESSAGES.MODEL_RECOMMENDED,
    { recommended, confidence },
    'engine',
    'model-advisor.ts',
    'recommendModel'
  );

  return {
    recommended,
    alternative,
    avoid,
    confidence,
    reason: reasonStr,
  };
}
