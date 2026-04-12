import type { TokenEstimate, OutputSize, OutputFormatOptions } from '@/types/prompt.types';
import { OUTPUT_SIZE_RANGES, FORMAT_MULTIPLIERS } from '@/lib/data/output-multipliers';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

export function estimateInputTokens(text: string): { low: number; high: number } {
  if (!text.trim()) return { low: 0, high: 0 };

  const charCount = text.length;

  // Heuristic: 1 token ~= 4 chars for English, range from chars/5 to chars/3
  const low = Math.ceil(charCount / 5);
  const high = Math.ceil(charCount / 3);

  return { low, high };
}

export function estimateOutputTokens(
  outputSize: OutputSize,
  formatOptions: OutputFormatOptions
): { low: number; high: number } {
  const baseRange = OUTPUT_SIZE_RANGES[outputSize].tokenRange;

  // Apply format multipliers
  let multiplier = 1;

  if (formatOptions.strictJson) {
    multiplier *= FORMAT_MULTIPLIERS.strictJson;
  }
  if (formatOptions.includeCode) {
    multiplier *= FORMAT_MULTIPLIERS.includeCode;
  }
  if (formatOptions.includeTables) {
    multiplier *= FORMAT_MULTIPLIERS.includeTables;
  }
  if (formatOptions.includeDiagrams) {
    multiplier *= FORMAT_MULTIPLIERS.includeDiagrams;
  }
  if (formatOptions.includeExamples) {
    multiplier *= FORMAT_MULTIPLIERS.includeExamples;
  }

  return {
    low: Math.ceil(baseRange.low * multiplier),
    high: Math.ceil(baseRange.high * multiplier),
  };
}

export function estimateTokens(
  promptText: string,
  outputSize: OutputSize = 'm',
  formatOptions: OutputFormatOptions = {
    strictJson: false,
    includeCode: false,
    includeTables: false,
    includeDiagrams: false,
    includeExamples: false,
  }
): TokenEstimate {
  const inputTokens = estimateInputTokens(promptText);
  const outputTokens = estimateOutputTokens(outputSize, formatOptions);

  const estimate: TokenEstimate = {
    inputTokens,
    outputTokens,
    totalTokens: {
      low: inputTokens.low + outputTokens.low,
      high: inputTokens.high + outputTokens.high,
    },
  };

  loggerDebug(
    DEBUG_MESSAGES.TOKEN_ESTIMATE,
    { total: estimate.totalTokens },
    'engine',
    'token-estimator.ts',
    'estimateTokens'
  );
  return estimate;
}
