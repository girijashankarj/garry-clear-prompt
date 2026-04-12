/**
 * LLM Adapter Layer
 *
 * Unified interface for running prompts against LLM providers.
 * Set LLM_FEATURE_ENABLED to true (or use VITE_LLM_FEATURE_ENABLED env var)
 * and configure credentials in .env to activate.
 */

import type { LlmRunResult, LlmSettings } from '@/types/prompt.types';
import type { ApiResult } from '@/common/interfaces';
import { ERROR_MESSAGES } from '@/common/messages/error';
import { estimateCost, getProviderConfig } from './providers';

export const LLM_FEATURE_ENABLED =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_FEATURE_ENABLED === 'true';

export class LlmNotEnabledError extends Error {
  constructor() {
    super(ERROR_MESSAGES.LLM_DISABLED);
    this.name = 'LlmNotEnabledError';
  }
}

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

export async function runPrompt(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<LlmRunResult> {
  if (!LLM_FEATURE_ENABLED) {
    throw new LlmNotEnabledError();
  }

  switch (settings.provider) {
    case 'openai':
      return runOpenAi(prompt, systemPrompt, settings);
    case 'anthropic':
      return runAnthropic(prompt, systemPrompt, settings);
    case 'bedrock':
      return runBedrock(prompt, systemPrompt, settings);
    default:
      throw new Error(`Unknown provider: ${settings.provider}`);
  }
}

function getMaxContext(settings: LlmSettings): number {
  const config = getProviderConfig(settings.provider);
  const model = config?.models.find((m) => m.id === settings.modelId);
  return model?.maxContext ?? 128_000;
}

// ===== OpenAI =====

export async function runOpenAi(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<LlmRunResult> {
  const apiKey = settings.credentials['apiKey'];
  if (!apiKey) throw new Error('OpenAI API key is required');

  const baseUrl =
    settings.credentials['baseUrl']?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
  const start = performance.now();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: settings.modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: Math.min(settings.maxTokens, getMaxContext(settings)),
      temperature: settings.temperature,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const durationMs = Math.round(performance.now() - start);
  const inputTokens: number = data.usage?.prompt_tokens ?? 0;
  const outputTokens: number = data.usage?.completion_tokens ?? 0;

  return {
    output: data.choices?.[0]?.message?.content ?? '',
    provider: 'openai',
    model: settings.modelId,
    inputTokens,
    outputTokens,
    durationMs,
    estimatedCost: estimateCost('openai', settings.modelId, inputTokens, outputTokens),
    timestamp: Date.now(),
  };
}

// ===== Anthropic =====

export async function runAnthropic(
  prompt: string,
  systemPrompt: string,
  settings: LlmSettings
): Promise<LlmRunResult> {
  const apiKey = settings.credentials['apiKey'];
  if (!apiKey) throw new Error('Anthropic API key is required');

  const start = performance.now();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.modelId,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.min(settings.maxTokens, getMaxContext(settings)),
      temperature: settings.temperature,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const durationMs = Math.round(performance.now() - start);
  const inputTokens: number = data.usage?.input_tokens ?? 0;
  const outputTokens: number = data.usage?.output_tokens ?? 0;

  return {
    output: data.content?.map((b: { text: string }) => b.text).join('') ?? '',
    provider: 'anthropic',
    model: settings.modelId,
    inputTokens,
    outputTokens,
    durationMs,
    estimatedCost: estimateCost('anthropic', settings.modelId, inputTokens, outputTokens),
    timestamp: Date.now(),
  };
}

// ===== AWS Bedrock =====

export async function runBedrock(
  _prompt: string,
  _systemPrompt: string,
  _settings: LlmSettings
): Promise<LlmRunResult> {
  // Bedrock requires AWS SigV4 signing which needs the AWS SDK.
  // For a browser-based tool, consider using a backend proxy instead.
  void _prompt;
  void _systemPrompt;
  void _settings;
  throw new Error(
    'AWS Bedrock requires server-side integration — not yet supported in browser mode'
  );
}

export function preEstimateCost(
  settings: LlmSettings,
  inputTokenEstimate: number,
  outputTokenEstimate: number
): number {
  return estimateCost(settings.provider, settings.modelId, inputTokenEstimate, outputTokenEstimate);
}
