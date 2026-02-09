import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PromptEngineResult } from '@/types/prompt.types';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { PromptPreview } from '@/components/shared/PromptPreview';

interface BasicResultsProps {
  result: PromptEngineResult;
}

export function BasicResults({ result }: BasicResultsProps) {
  const hasContent = result.structuredPrompt.trim().length > 0;

  if (!hasContent) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[200px] text-muted-foreground">
          <Lightbulb className="h-10 w-10 mb-3 opacity-50" />
          <p className="text-sm font-medium">Start typing to see your prompt score</p>
          <p className="text-xs mt-1">
            Your prompt will be analyzed for clarity, efficiency, and quality
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score + Suggestions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            <ScoreBadge score={result.rating.totalScore} band={result.rating.band} size="lg" />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Prompt Quality Score</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Based on clarity, constraints, structure, and efficiency
                </p>
              </div>
              <div className="space-y-1.5">
                {result.rating.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    <span className="text-muted-foreground">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Prompt Preview */}
      <PromptPreview title="Your Structured Prompt" content={result.structuredPrompt} />

      {/* Meta Prompt Preview */}
      {result.metaPrompt && (
        <PromptPreview title="Meta Prompt (System Instructions)" content={result.metaPrompt} />
      )}

      <Separator />

      {/* Export */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Export</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportButtons result={result} />
        </CardContent>
      </Card>
    </div>
  );
}
