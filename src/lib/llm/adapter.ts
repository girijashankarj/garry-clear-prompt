/**
 * LLM Adapter Layer
 *
 * This module provides a unified interface for running prompts against
 * different LLM providers (OpenAI, Anthropic, AWS Bedrock).
 *
 * CURRENTLY DISABLED -- all run functions throw a "not enabled" error.
 * When ready to enable, implement the actual API calls for each provider.
 */

import type { LlmProvider, LlmRunResult, LlmSettings } from '@/types/prompt.types';
import { estimateCost } from './providers';

export const LLM_FEATURE_ENABLED = false;

export class LlmNotEnabledError extends Error {
  constructor() {
    super('LLM integration is not enabled yet. Coming soon!');
    this.name = 'LlmNotEnabledError';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _runOpenAi(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<LlmRunResult> {
  // TODO: Implement OpenAI API call
  // const response = await fetch(`${settings.credentials.baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${settings.credentials.apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     model: settings.modelId,
  //     messages: [
  //       { role: 'system', content: systemPrompt },
  //       { role: 'user', content: prompt },
  //     ],
  //     max_tokens: settings.maxTokens,
  //     temperature: settings.temperature,
  //   }),
  // });
  void prompt; void systemPrompt; void settings;
  throw new LlmNotEnabledError();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _runAnthropic(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<LlmRunResult> {
  // TODO: Implement Anthropic API call
  // const response = await fetch('https://api.anthropic.com/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': settings.credentials.apiKey,
  //     'anthropic-version': '2023-06-01',
  //   },
  //   body: JSON.stringify({
  //     model: settings.modelId,
  //     system: systemPrompt,
  //     messages: [{ role: 'user', content: prompt }],
  //     max_tokens: settings.maxTokens,
  //     temperature: settings.temperature,
  //   }),
  // });
  void prompt; void systemPrompt; void settings;
  throw new LlmNotEnabledError();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _runBedrock(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
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
