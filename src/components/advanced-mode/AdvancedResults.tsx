import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PromptEngineResult } from '@/types/prompt.types';
import { PromptRatingPanel } from './PromptRating';
import { ModelAdvisorPanel } from './ModelAdvisor';
import { TokenEstimatorPanel } from './TokenEstimator';
import { McpAdvisorPanel } from './McpAdvisor';
import { LintWarningsPanel } from './LintWarnings';
import { PromptPreview } from '@/components/shared/PromptPreview';
import { ExportButtons } from '@/components/shared/ExportButtons';

interface AdvancedResultsProps {
  result: PromptEngineResult;
}

export function AdvancedResults({ result }: AdvancedResultsProps) {
  const hasContent = result.structuredPrompt.trim().length > 0;

  if (!hasContent) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[200px] text-muted-foreground">
          <Lightbulb className="h-10 w-10 mb-3 opacity-50" />
          <p className="text-sm font-medium">Write a prompt to see analysis</p>
          <p className="text-xs mt-1">
            Rating, model advice, token estimates, lint, and MCP suggestions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PromptRatingPanel rating={result.rating} />
      <ModelAdvisorPanel recommendation={result.modelRecommendation} />
      <TokenEstimatorPanel estimate={result.tokenEstimate} />
      <LintWarningsPanel warnings={result.lintWarnings} />
      <McpAdvisorPanel suggestions={result.mcpSuggestions} />

      <Separator />

      <PromptPreview title="Structured Prompt" content={result.structuredPrompt} />
      {result.metaPrompt && (
        <PromptPreview title="Meta Prompt" content={result.metaPrompt} />
      )}

      <Separator />

      {/* Export */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Export</span>
            <ExportButtons result={result} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
