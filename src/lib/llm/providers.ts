import type { LlmProviderConfig } from '@/types/prompt.types';

export const LLM_PROVIDERS: LlmProviderConfig[] = [
  {
    provider: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o, GPT-4o mini, o1, o3',
    models: [
      {
        id: 'gpt-4o-mini',
        label: 'GPT-4o mini',
        tier: 'fast',
        inputCostPer1k: 0.00015,
        outputCostPer1k: 0.0006,
        maxContext: 128000,
      },
      {
        id: 'gpt-4o',
        label: 'GPT-4o',
        tier: 'balanced',
        inputCostPer1k: 0.0025,
        outputCostPer1k: 0.01,
        maxContext: 128000,
      },
      {
        id: 'o1',
        label: 'o1',
        tier: 'reasoning',
        inputCostPer1k: 0.015,
        outputCostPer1k: 0.06,
        maxContext: 200000,
      },
      {
        id: 'o3-mini',
        label: 'o3-mini',
        tier: 'reasoning',
        inputCostPer1k: 0.0011,
        outputCostPer1k: 0.0044,
        maxContext: 200000,
      },
    ],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
      {
        key: 'baseUrl',
        label: 'Base URL (optional)',
        type: 'text',
        placeholder: 'https://api.openai.com/v1',
        required: false,
      },
    ],
  },
  {
    provider: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 4 Opus, Sonnet, Haiku',
    models: [
      {
        id: 'claude-haiku',
        label: 'Claude 3.5 Haiku',
        tier: 'fast',
        inputCostPer1k: 0.0008,
        outputCostPer1k: 0.004,
        maxContext: 200000,
      },
      {
        id: 'claude-sonnet',
        label: 'Claude 4 Sonnet',
        tier: 'balanced',
        inputCostPer1k: 0.003,
        outputCostPer1k: 0.015,
        maxContext: 200000,
      },
      {
        id: 'claude-opus',
        label: 'Claude 4 Opus',
        tier: 'reasoning',
        inputCostPer1k: 0.015,
        outputCostPer1k: 0.075,
        maxContext: 200000,
      },
    ],
    configFields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-ant-...',
        required: true,
      },
    ],
  },
  {
    provider: 'bedrock',
    label: 'AWS Bedrock',
    description: 'Claude, Titan, Llama via AWS',
    models: [
      {
        id: 'amazon.titan-text-express-v1',
        label: 'Titan Text Express',
        tier: 'fast',
        inputCostPer1k: 0.0002,
        outputCostPer1k: 0.0006,
        maxContext: 8000,
      },
      {
        id: 'anthropic.claude-3-5-sonnet',
        label: 'Claude 3.5 Sonnet (Bedrock)',
        tier: 'balanced',
        inputCostPer1k: 0.003,
        outputCostPer1k: 0.015,
        maxContext: 200000,
      },
      {
        id: 'anthropic.claude-3-5-haiku',
        label: 'Claude 3.5 Haiku (Bedrock)',
        tier: 'fast',
        inputCostPer1k: 0.0008,
        outputCostPer1k: 0.004,
        maxContext: 200000,
      },
    ],
    configFields: [
      {
        key: 'accessKeyId',
        label: 'Access Key ID',
        type: 'password',
        placeholder: 'AKIA...',
        required: true,
      },
      {
        key: 'secretAccessKey',
        label: 'Secret Access Key',
        type: 'password',
        placeholder: '...',
        required: true,
      },
      { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
    ],
  },
];

export function getProviderConfig(provider: string): LlmProviderConfig | undefined {
  return LLM_PROVIDERS.find((p) => p.provider === provider);
}

export function estimateCost(
  provider: string,
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const config = getProviderConfig(provider);
  if (!config) return 0;
  const model = config.models.find((m) => m.id === modelId);
  if (!model) return 0;
  return (
    (inputTokens / 1000) * model.inputCostPer1k + (outputTokens / 1000) * model.outputCostPer1k
  );
}
