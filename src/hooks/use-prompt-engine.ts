import { useState, useEffect, useRef } from 'react';
import type {
  BasicPromptInput,
  AdvancedPromptInput,
  PromptEngineResult,
} from '@/types/prompt.types';
import {
  buildPromptFromBasic,
  buildPromptFromAdvanced,
  buildMetaPrompt,
} from '@/lib/engine/prompt-builder';
import { buildMetaPromptFromBasic } from '@/lib/engine/meta-prompt-builder';
import { ratePrompt } from '@/lib/engine/prompt-rater';
import { analyzePromptNlp } from '@/lib/engine/nlp-analyzer';
import { lintPrompt } from '@/lib/engine/prompt-linter';
import { estimateTokens } from '@/lib/engine/token-estimator';
import { recommendModel } from '@/lib/engine/model-advisor';
import { suggestMcpTools } from '@/lib/engine/mcp-advisor';

const DEBOUNCE_MS = 300;

export interface PromptEngineHookResult {
  result: PromptEngineResult;
  isAnalyzing: boolean;
}

function computeBasicResult(input: BasicPromptInput): PromptEngineResult {
  const structuredPrompt = buildPromptFromBasic(input);
  const metaPrompt = buildMetaPromptFromBasic(input);
  const suggestionSource = [input.goal, input.rules].filter(Boolean).join('\n\n');
  const nlpAnalysis = analyzePromptNlp(structuredPrompt);
  const rating = ratePrompt(structuredPrompt, {
    suggestionSource,
    nlpIntent: nlpAnalysis.intent,
  });
  const lintWarnings = lintPrompt(structuredPrompt);
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
    nlpAnalysis,
    tokenEstimate,
    modelRecommendation,
    mcpSuggestions,
    lintWarnings,
  };
}

function computeAdvancedResult(input: AdvancedPromptInput): PromptEngineResult {
  const structuredPrompt = buildPromptFromAdvanced(input);
  const metaPrompt = buildMetaPrompt(input);
  // Score the same assembled prompt users export; lint stays on the raw textarea for author-hygiene rules.
  const nlpAnalysis = analyzePromptNlp(structuredPrompt);
  const rating = ratePrompt(structuredPrompt, {
    suggestionSource: input.prompt,
    nlpIntent: nlpAnalysis.intent,
  });
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
    nlpAnalysis,
    tokenEstimate,
    modelRecommendation,
    mcpSuggestions,
    lintWarnings,
  };
}

export function usePromptEngineBasic(input: BasicPromptInput): PromptEngineHookResult {
  const [result, setResult] = useState<PromptEngineResult>(() => computeBasicResult(input));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    queueMicrotask(() => setIsAnalyzing(true));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setResult(computeBasicResult(input));
      setIsAnalyzing(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
    // Intentional field list: debounce should not restart on unrelated `input` identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- track primitive fields only
  }, [input.goal, input.detailLevel, input.styleTone, input.responseFormat, input.rules]);

  return { result, isAnalyzing };
}

export function usePromptEngineAdvanced(input: AdvancedPromptInput): PromptEngineHookResult {
  const [result, setResult] = useState<PromptEngineResult>(() => computeAdvancedResult(input));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    queueMicrotask(() => setIsAnalyzing(true));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setResult(computeAdvancedResult(input));
      setIsAnalyzing(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- track primitive fields only
  }, [
    input.prompt,
    input.metaPrompt,
    input.planFirst,
    input.taskType,
    input.complexity,
    input.riskLevel,
    input.contextSize,
    input.outputSize,
    input.needsToolUse,
    input.outputFormat.strictJson,
    input.outputFormat.includeCode,
    input.outputFormat.includeTables,
    input.outputFormat.includeDiagrams,
    input.outputFormat.includeExamples,
    input.audience,
  ]);

  return { result, isAnalyzing };
}
