import { useMemo } from 'react';
import type { BasicPromptInput, AdvancedPromptInput, PromptEngineResult } from '@/types/prompt.types';
import { buildPromptFromBasic, buildPromptFromAdvanced, buildMetaPrompt } from '@/lib/engine/prompt-builder';
import { buildMetaPromptFromBasic } from '@/lib/engine/meta-prompt-builder';
import { ratePrompt } from '@/lib/engine/prompt-rater';
import { lintPrompt } from '@/lib/engine/prompt-linter';
import { estimateTokens } from '@/lib/engine/token-estimator';
import { recommendModel } from '@/lib/engine/model-advisor';
import { suggestMcpTools } from '@/lib/engine/mcp-advisor';

export function usePromptEngineBasic(input: BasicPromptInput): PromptEngineResult {
  return useMemo(() => {
    const structuredPrompt = buildPromptFromBasic(input);
    const metaPrompt = buildMetaPromptFromBasic(input);
    const rating = ratePrompt(input.goal);
    const lintWarnings = lintPrompt(input.goal);
    const tokenEstimate = estimateTokens(structuredPrompt);
    const modelRecommendation = recommendModel({
      taskType: 'general',
      complexity: input.detailLevel === 'detailed' ? 'medium' : 'low',
      riskLevel: 'low',
      contextSize: 'small',
      needsToolUse: false,
    });
    const mcpSuggestions = suggestMcpTools(input.goal);

    return {
      structuredPrompt,
      metaPrompt,
      rating,
      tokenEstimate,
      modelRecommendation,
      mcpSuggestions,
      lintWarnings,
    };
  }, [input.goal, input.detailLevel, input.styleTone, input.responseFormat, input.rules]);
}

export function usePromptEngineAdvanced(input: AdvancedPromptInput): PromptEngineResult {
  return useMemo(() => {
    const structuredPrompt = buildPromptFromAdvanced(input);
    const metaPrompt = buildMetaPrompt(input);
    const rating = ratePrompt(input.prompt);
    const lintWarnings = lintPrompt(input.prompt);
    const tokenEstimate = estimateTokens(structuredPrompt, input.outputSize, input.outputFormat);
    const modelRecommendation = recommendModel({
      taskType: input.taskType,
      complexity: input.complexity,
      riskLevel: input.riskLevel,
      contextSize: input.contextSize,
      needsToolUse: input.needsToolUse,
    });
    const mcpSuggestions = suggestMcpTools(input.prompt);

    return {
      structuredPrompt,
      metaPrompt,
      rating,
      tokenEstimate,
      modelRecommendation,
      mcpSuggestions,
      lintWarnings,
    };
  }, [
    input.prompt, input.metaPrompt, input.planFirst,
    input.taskType, input.complexity, input.riskLevel,
    input.contextSize, input.outputSize, input.needsToolUse,
    input.outputFormat.strictJson, input.outputFormat.includeCode,
    input.outputFormat.includeTables, input.outputFormat.includeDiagrams,
    input.outputFormat.includeExamples, input.audience,
  ]);
}
