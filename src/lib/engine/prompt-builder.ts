import type { BasicPromptInput, AdvancedPromptInput } from '@/types/prompt.types';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

export function buildPromptFromBasic(input: BasicPromptInput): string {
  if (!input.goal.trim()) {
    return '';
  }

  const parts: string[] = [];

  // Goal
  parts.push(input.goal.trim());

  // Detail level modifier
  const detailMap = {
    short: 'Keep the response brief and concise.',
    medium: 'Provide a moderately detailed response.',
    detailed: 'Provide a thorough and detailed response.',
  };
  parts.push(detailMap[input.detailLevel]);

  // Style tone modifier
  const toneMap = {
    simple: 'Use simple, easy-to-understand language.',
    professional: 'Use a professional and formal tone.',
    friendly: 'Use a friendly and conversational tone.',
  };
  parts.push(toneMap[input.styleTone]);

  // Response format modifier
  const formatMap = {
    steps: 'Present the response as numbered steps.',
    explanation: 'Present the response as a clear explanation.',
    both: 'Include both step-by-step instructions and explanations.',
  };
  parts.push(formatMap[input.responseFormat]);

  // Rules
  if (input.rules.trim()) {
    parts.push(`Rules to follow: ${input.rules.trim()}`);
  }

  const result = parts.join('\n\n');
  loggerDebug(
    DEBUG_MESSAGES.BASIC_PROMPT_BUILT,
    { wordCount: result.split(/\s+/).length },
    'engine',
    'prompt-builder.ts',
    'buildPromptFromBasic'
  );
  return result;
}

export function buildPromptFromAdvanced(input: AdvancedPromptInput): string {
  const parts: string[] = [];

  // Main prompt
  if (input.prompt.trim()) {
    parts.push(input.prompt.trim());
  }

  // Plan first instruction
  if (input.planFirst) {
    parts.push('Think step-by-step. Create a plan before providing the final answer.');
  }

  // Output format instructions
  const formatInstructions: string[] = [];
  if (input.outputFormat.strictJson) {
    formatInstructions.push('Return the output in strict, valid JSON format.');
  }
  if (input.outputFormat.includeCode) {
    formatInstructions.push('Include code examples where relevant.');
  }
  if (input.outputFormat.includeTables) {
    formatInstructions.push('Use tables to organize structured data.');
  }
  if (input.outputFormat.includeDiagrams) {
    formatInstructions.push('Include Mermaid diagrams where they add clarity.');
  }
  if (input.outputFormat.includeExamples) {
    formatInstructions.push('Include practical examples to illustrate key points.');
  }

  if (formatInstructions.length > 0) {
    parts.push('Output format:\n' + formatInstructions.map((f) => `- ${f}`).join('\n'));
  }

  // Audience
  if (input.audience.trim()) {
    parts.push(`Target audience: ${input.audience.trim()}`);
  }

  const result = parts.join('\n\n');
  loggerDebug(
    DEBUG_MESSAGES.ADVANCED_PROMPT_BUILT,
    { wordCount: result.split(/\s+/).length },
    'engine',
    'prompt-builder.ts',
    'buildPromptFromAdvanced'
  );
  return result;
}

export function buildMetaPrompt(input: AdvancedPromptInput): string {
  if (input.metaPrompt.trim()) {
    return input.metaPrompt.trim();
  }

  // Auto-generate a meta prompt from settings
  const parts: string[] = [];

  parts.push(`You are an expert assistant helping with a ${input.taskType} task.`);

  const complexityMap = {
    low: 'This is a straightforward task.',
    medium: 'This requires moderate analysis and attention to detail.',
    high: 'This is a complex task requiring deep reasoning and careful consideration.',
  };
  parts.push(complexityMap[input.complexity]);

  const riskMap = {
    low: 'The risk of errors is low.',
    medium: 'Accuracy is important. Double-check your reasoning.',
    high: 'This is high-stakes. Validate every assumption and flag uncertainties.',
  };
  parts.push(riskMap[input.riskLevel]);

  if (input.audience.trim()) {
    parts.push(`The output is intended for: ${input.audience.trim()}`);
  }

  return parts.join(' ');
}
