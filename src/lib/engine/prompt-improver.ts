import { ratePrompt } from './prompt-rater';
import { detectPrimaryImproveIntent } from './improve-intent';
import type { ImprovePromptIntent } from '@/common/messages/improve-checklists';
import type { PromptRating } from '@/types/prompt.types';
import { loggerInfo } from '@/utils/loggerUtils';
import { INFO_MESSAGES } from '@/common/messages/info';
import {
  IMPROVE_CHECKLIST_CHANGE_SUMMARY,
  IMPROVE_CHECKLIST_HEADER,
  IMPROVE_CHECKLIST_LINES,
} from '@/common/messages/improve-checklists';
import {
  classifyIntentWithMl,
  ML_INTENT_FEATURE_ENABLED,
  type MlIntentClassification,
} from '@/lib/ml/intent-classifier';

export interface PromptImprovement {
  original: string;
  improved: string;
  originalRating: PromptRating;
  improvedRating: PromptRating;
  changes: string[];
}

/** Maps raw user text to the string that should be scored (e.g. advanced assembled prompt). */
export type RatingTextAssembler = (rawUserPrompt: string) => string;

export interface ImprovePromptOptions {
  ratingAssembler?: RatingTextAssembler;
}

const CHECKLIST_SUMMARIES = new Set<string>(Object.values(IMPROVE_CHECKLIST_CHANGE_SUMMARY));

export type MlRefineStatus =
  | 'skipped_feature_off'
  | 'skipped_inference_failed'
  | 'skipped_low_confidence'
  | 'applied';

export interface MlRefinementOutcome {
  improvement: PromptImprovement;
  status: MlRefineStatus;
  classification: MlIntentClassification | null;
}

/** Removes the domain checklist block appended by `improvePrompt` (for ML re-routing). */
export function stripDomainChecklistBlock(text: string): string {
  const marker = `\n\n${IMPROVE_CHECKLIST_HEADER}`;
  const idx = text.indexOf(marker);
  if (idx === -1) return text.replace(/\n{3,}/g, '\n\n').trim();
  return text
    .slice(0, idx)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Appends the checklist for `intent`, replacing any existing checklist block. */
export function appendDomainChecklistForIntent(text: string, intent: ImprovePromptIntent): string {
  const base = stripDomainChecklistBlock(text);
  const lines = IMPROVE_CHECKLIST_LINES[intent];
  const block = `\n\n${IMPROVE_CHECKLIST_HEADER}\n${lines.map((line) => `- ${line}`).join('\n')}`;
  return `${base}${block}`.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Re-runs domain checklist selection using in-browser ML (Transformers.js), when enabled.
 * Regex-based `improvePrompt` remains the default; this refines checklist only.
 */
export async function refineImprovementWithMl(
  base: PromptImprovement,
  rawUserPrompt: string,
  options?: ImprovePromptOptions & { minMlConfidence?: number }
): Promise<MlRefinementOutcome> {
  if (!ML_INTENT_FEATURE_ENABLED) {
    return { improvement: base, status: 'skipped_feature_off', classification: null };
  }

  const classification = await classifyIntentWithMl(rawUserPrompt, {
    minConfidence: options?.minMlConfidence,
  });

  if (!classification) {
    return { improvement: base, status: 'skipped_inference_failed', classification: null };
  }

  if (classification.intent === null) {
    return {
      improvement: base,
      status: 'skipped_low_confidence',
      classification,
    };
  }

  const improved = appendDomainChecklistForIntent(base.improved, classification.intent);
  const changes = base.changes.filter((c) => !CHECKLIST_SUMMARIES.has(c));
  changes.push(
    `${INFO_MESSAGES.ML_CHECKLIST_REFINED} (${classification.intent}, ${Math.round(classification.score * 100)}%)`
  );

  const improvedRating = rateWithOptionalAssembly(improved, options);

  loggerInfo(
    INFO_MESSAGES.PROMPT_IMPROVED,
    {
      originalScore: base.originalRating.totalScore,
      improvedScore: improvedRating.totalScore,
      changeCount: changes.length,
      mlIntent: classification.intent,
    },
    'engine',
    'prompt-improver.ts',
    'refineImprovementWithMl'
  );

  return {
    improvement: {
      ...base,
      improved,
      improvedRating,
      changes,
    },
    status: 'applied',
    classification,
  };
}

export { ML_INTENT_FEATURE_ENABLED, type MlIntentClassification } from '@/lib/ml/intent-classifier';

function rateWithOptionalAssembly(raw: string, options?: ImprovePromptOptions): PromptRating {
  const trimmed = raw.trim();
  const ratedText = options?.ratingAssembler ? options.ratingAssembler(trimmed) : trimmed;
  return ratePrompt(ratedText, { suggestionSource: trimmed });
}

export function improvePrompt(text: string, options?: ImprovePromptOptions): PromptImprovement {
  if (!text.trim()) {
    const emptyRating = ratePrompt('');
    return {
      original: text,
      improved: '',
      originalRating: emptyRating,
      improvedRating: emptyRating,
      changes: [],
    };
  }

  let improved = text.trim();
  const changes: string[] = [];

  // 1. Remove filler / conversational padding
  const fillerPatterns = [
    { pattern: /\b(please|kindly)\s+/gi, label: 'Removed filler: "please/kindly"' },
    { pattern: /\bi think\s+/gi, label: 'Removed hedge: "I think"' },
    { pattern: /\b(maybe|perhaps)\s+/gi, label: 'Removed hedge: "maybe/perhaps"' },
    { pattern: /\bi want you to\s+/gi, label: 'Removed padding: "I want you to"' },
    { pattern: /\bi need you to\s+/gi, label: 'Removed padding: "I need you to"' },
    { pattern: /\bcould you (please\s+)?/gi, label: 'Removed padding: "could you"' },
    { pattern: /\bcan you help me\s+(to\s+)?/gi, label: 'Removed padding: "can you help me"' },
    { pattern: /\bwould you mind\s+/gi, label: 'Removed padding: "would you mind"' },
  ];

  for (const { pattern, label } of fillerPatterns) {
    if (pattern.test(improved)) {
      improved = improved.replace(pattern, '');
      changes.push(label);
    }
  }

  // 2. Capitalize first letter after cleanup
  improved = improved.replace(/^\s*\w/, (c) => c.toUpperCase());

  // 3. Add output format if missing
  const hasFormat = /\b(bullet|list|table|json|markdown|steps|format|structured|numbered)\b/i.test(
    improved
  );
  if (!hasFormat) {
    improved += '\n\nProvide the response in a clear, structured format.';
    changes.push('Added output format instruction');
  }

  // 4. Add length constraint if missing
  const hasLength =
    /\b(\d+\s*(points?|items?|sentences?|words?|lines?)|max|limit|brief|concise)\b/i.test(improved);
  if (!hasLength) {
    improved += '\nKeep the response concise.';
    changes.push('Added length constraint');
  }

  // 5. Add audience if missing and prompt is complex
  const wordCount = improved.trim().split(/\s+/).length;
  const hasAudience =
    /\b(for a|audience|reader|beginner|expert|senior|junior|non-technical|technical)\b/i.test(
      improved
    );
  if (wordCount > 20 && !hasAudience) {
    // Don't add audience for simple prompts -- it would feel forced
    changes.push('Consider specifying your target audience');
  }

  // 6. Domain checklist (single intent; see improve-intent.ts for full priority order)
  const intent = detectPrimaryImproveIntent(improved);
  if (intent && !improved.includes(IMPROVE_CHECKLIST_HEADER)) {
    const lines = IMPROVE_CHECKLIST_LINES[intent];
    const block = `\n\n${IMPROVE_CHECKLIST_HEADER}\n${lines.map((line) => `- ${line}`).join('\n')}`;
    improved += block;
    changes.push(IMPROVE_CHECKLIST_CHANGE_SUMMARY[intent]);
  }

  // Clean up extra whitespace
  improved = improved.replace(/\n{3,}/g, '\n\n').trim();

  const originalRating = rateWithOptionalAssembly(text, options);
  const improvedRating = rateWithOptionalAssembly(improved, options);

  loggerInfo(
    INFO_MESSAGES.PROMPT_IMPROVED,
    {
      originalScore: originalRating.totalScore,
      improvedScore: improvedRating.totalScore,
      changeCount: changes.length,
    },
    'engine',
    'prompt-improver.ts',
    'improvePrompt'
  );

  return {
    original: text.trim(),
    improved,
    originalRating,
    improvedRating,
    changes,
  };
}
