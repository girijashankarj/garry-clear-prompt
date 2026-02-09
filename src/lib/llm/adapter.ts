/**
 * LLM Adapter Layer
 *
 * This module provides a unified interface for running prompts against
 * different LLM providers (OpenAI, Anthropic, AWS Bedrock).
 *
 * CURRENTLY DISABLED -- all run functions throw a "not enabled" error.
 * When ready to enable, implement the actual API calls for each provider.
 */

import type { LlmRunResult, LlmSettings } from '@/types/prompt.types';
import type { ApiResult } from '@/common/interfaces';
import { ERROR_MESSAGES } from '@/common/messages/error';
import { estimateCost } from './providers';

export const LLM_FEATURE_ENABLED = false;

export class LlmNotEnabledError extends Error {
  constructor() {
    super(ERROR_MESSAGES.LLM_DISABLED);
    this.name = 'LlmNotEnabledError';
  }
}

/** Wrap LLM run into a typed ApiResult */
export async function runPromptSafe(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<ApiResult<LlmRunResult>> {
  try {
    const data = await runPrompt(prompt, systemPrompt, settings);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED };
  }
}

/**
 * Run a prompt against the configured LLM provider.
 * Currently stubbed -- throws LlmNotEnabledError.
 *
 * When implementing:
 * - OpenAI: POST to /v1/chat/completions
 * - Anthropic: POST to /v1/messages
 * - Bedrock: Use AWS SDK InvokeModel
 */
export async function runPrompt(
  _prompt: string,
  _systemPrompt: string,
  _settings: LlmSettings
): Promise<LlmRunResult> {
  if (!LLM_FEATURE_ENABLED) {
    throw new LlmNotEnabledError();
  }

  // Placeholder for future implementation
  // Each provider adapter would go here:
  //
  // switch (settings.provider) {
  //   case 'openai':
  //     return runOpenAi(prompt, systemPrompt, settings);
  //   case 'anthropic':
  //     return runAnthropic(prompt, systemPrompt, settings);
  //   case 'bedrock':
  //     return runBedrock(prompt, systemPrompt, settings);
  // }

  throw new Error('Provider not implemented');
}

// ===== Provider stubs (implement when enabling) =====

// ===== Provider stubs (export for future use) =====

export async function runOpenAi(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings,
): Promise<LlmRunResult> {
  // TODO: Implement OpenAI API call
  void prompt; void systemPrompt; void settings;
  throw new LlmNotEnabledError();
}

export async function runAnthropic(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings,
): Promise<LlmRunResult> {
  // TODO: Implement Anthropic API call
  void prompt; void systemPrompt; void settings;
  throw new LlmNotEnabledError();
}

export async function runBedrock(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings,
): Promise<LlmRunResult> {
  // TODO: Implement AWS Bedrock API call via AWS SDK
  void prompt; void systemPrompt; void settings;
  throw new LlmNotEnabledError();
}

/**
 * Pre-flight cost estimate before running.
 */
export function preEstimateCost(
  settings: LlmSettings,
  inputTokenEstimate: number,
  outputTokenEstimate: number
): number {
  return estimateCost(settings.provider, settings.modelId, inputTokenEstimate, outputTokenEstimate);
}
