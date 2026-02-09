import type { BasicPromptInput } from '@/types/prompt.types';

export function buildMetaPromptFromBasic(input: BasicPromptInput): string {
  const parts: string[] = [];

  parts.push('You are a helpful assistant.');

  const toneMap = {
    simple: 'Use simple, clear language that anyone can understand.',
    professional: 'Maintain a professional, formal tone throughout.',
    friendly: 'Be conversational and approachable.',
  };
  parts.push(toneMap[input.styleTone]);

  const detailMap = {
    short: 'Keep responses brief and to the point.',
    medium: 'Provide moderate detail without being verbose.',
    detailed: 'Be thorough and comprehensive in your response.',
  };
  parts.push(detailMap[input.detailLevel]);

  const formatMap = {
    steps: 'Structure your response as clear, numbered steps.',
    explanation: 'Provide flowing explanations with clear logic.',
    both: 'Combine step-by-step instructions with explanatory context.',
  };
  parts.push(formatMap[input.responseFormat]);

  if (input.rules.trim()) {
    parts.push(`Additional rules: ${input.rules.trim()}`);
  }

  return parts.join(' ');
}
