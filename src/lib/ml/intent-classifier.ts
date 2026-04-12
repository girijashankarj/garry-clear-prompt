import type { ImprovePromptIntent } from '@/common/messages/improve-checklists';
import { loggerWarn } from '@/utils/loggerUtils';
import { WARN_MESSAGES } from '@/common/messages/warn';
import {
  ML_INTENT_MODEL_ID,
  ML_NONE_INTENT_LABEL,
  ML_ZERO_SHOT_LABEL_BY_INTENT,
} from './ml-intent-config';

/**
 * Vite replaces `process.env.VITE_ML_INTENT_ENABLED` via `define` in vite.config.ts.
 * Jest uses real `process.env` (see jest.setup.js).
 */
export const ML_INTENT_FEATURE_ENABLED =
  typeof process !== 'undefined' && process.env.VITE_ML_INTENT_ENABLED === 'true';

const labelToIntent = new Map<string, ImprovePromptIntent>(
  (Object.entries(ML_ZERO_SHOT_LABEL_BY_INTENT) as [ImprovePromptIntent, string][]).map(
    ([intent, label]) => [label, intent]
  )
);

let classifierPromise: Promise<unknown> | null = null;

async function getZeroShotClassifier(): Promise<unknown> {
  if (!classifierPromise) {
    classifierPromise = (async () => {
      const { pipeline } = await import('@xenova/transformers');
      return pipeline('zero-shot-classification', ML_INTENT_MODEL_ID, { quantized: true });
    })();
  }
  return classifierPromise;
}

export interface MlIntentClassification {
  intent: ImprovePromptIntent | null;
  score: number;
  topLabel: string;
}

type ZeroShotOutput = {
  labels: string[];
  scores: number[];
};

function normalizeOutput(raw: unknown): ZeroShotOutput {
  if (Array.isArray(raw)) {
    const first = raw[0] as ZeroShotOutput;
    return { labels: first.labels, scores: first.scores };
  }
  const o = raw as ZeroShotOutput;
  return { labels: o.labels, scores: o.scores };
}

const DEFAULT_MIN_CONFIDENCE = 0.22;

/**
 * Classifies user prompt into an `ImprovePromptIntent` using in-browser zero-shot NLI.
 * Returns `null` when the feature is off or inference fails.
 */
export async function classifyIntentWithMl(
  text: string,
  options?: { minConfidence?: number }
): Promise<MlIntentClassification | null> {
  if (!ML_INTENT_FEATURE_ENABLED || !text.trim()) {
    return null;
  }
  const minConfidence = options?.minConfidence ?? DEFAULT_MIN_CONFIDENCE;
  try {
    const classifier = (await getZeroShotClassifier()) as (
      seq: string,
      labels: string[],
      cfg: { multi_label: boolean }
    ) => Promise<unknown>;

    const labels = [...Object.values(ML_ZERO_SHOT_LABEL_BY_INTENT), ML_NONE_INTENT_LABEL];
    const truncated = text.trim().slice(0, 2500);
    const raw = await classifier(truncated, labels, { multi_label: false });
    const { labels: outLabels, scores } = normalizeOutput(raw);
    const topLabel = outLabels[0];
    const score = scores[0];
    if (topLabel === ML_NONE_INTENT_LABEL || score < minConfidence) {
      return { intent: null, score, topLabel };
    }
    const intent = labelToIntent.get(topLabel) ?? null;
    return { intent, score, topLabel };
  } catch (err) {
    loggerWarn(
      WARN_MESSAGES.ML_INTENT_CLASSIFIER_FAILED,
      { err: err instanceof Error ? err.message : String(err) },
      'ml',
      'intent-classifier.ts',
      'classifyIntentWithMl'
    );
    return null;
  }
}
