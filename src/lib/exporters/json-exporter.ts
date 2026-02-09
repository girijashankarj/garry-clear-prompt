import type { PromptEngineResult } from '@/types/prompt.types';
import { APP_NAME } from '@/common/constants';

export function exportAsJson(result: PromptEngineResult): string {
  const exportData = {
    generatedBy: APP_NAME,
    generatedAt: new Date().toISOString(),
    prompt: result.structuredPrompt,
    metaPrompt: result.metaPrompt,
    rating: {
      totalScore: result.rating.totalScore,
      band: result.rating.band,
      dimensions: {
        clarity: { score: result.rating.dimensions.clarity.score, max: result.rating.dimensions.clarity.maxScore },
        constraints: { score: result.rating.dimensions.constraints.score, max: result.rating.dimensions.constraints.maxScore },
        structure: { score: result.rating.dimensions.structure.score, max: result.rating.dimensions.structure.maxScore },
        tokenEfficiency: { score: result.rating.dimensions.tokenEfficiency.score, max: result.rating.dimensions.tokenEfficiency.maxScore },
        riskPenalty: { score: result.rating.dimensions.riskPenalty.score },
      },
      suggestions: result.rating.suggestions,
    },
    tokenEstimate: result.tokenEstimate,
    modelRecommendation: result.modelRecommendation,
    mcpSuggestions: result.mcpSuggestions,
    lintWarnings: result.lintWarnings,
  };

  return JSON.stringify(exportData, null, 2);
}
