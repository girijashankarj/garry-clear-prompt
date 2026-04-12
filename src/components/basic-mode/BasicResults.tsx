import { useRef } from 'react';
import { Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StickyScore } from '@/components/shared/StickyScore';
import type { PromptEngineResult, PromptSectionCoverage } from '@/types/prompt.types';
import { PromptRatingPanel } from '@/components/shared/PromptRatingPanel';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { PromptPreview } from '@/components/shared/PromptPreview';
import { BeforeAfterComparison } from '@/components/shared/BeforeAfterComparison';
import { NlpAnalysisPanel } from '@/components/shared/NlpAnalysisPanel';
import { VersionHistoryPanel } from '@/components/shared/VersionHistoryPanel';
import { PromptSuggestionsPanel } from '@/components/shared/PromptSuggestionsPanel';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { RATING_GUIDANCE } from '@/common/messages/info';
const BASIC_EXAMPLES = [
  'Explain how React hooks work for a beginner in 5 bullet points',
  'Compare REST and GraphQL APIs with pros and cons in a table',
  'Write a Python script that reads a CSV file and outputs a summary',
];

interface BasicResultsProps {
  result: PromptEngineResult;
  rawGoal?: string;
  onApplyImproved?: (improved: string) => void;
  isAnalyzing?: boolean;
  onTryExample?: (text: string) => void;
  onInsertSection?: (section: keyof PromptSectionCoverage) => void;
  onInsertFullOutline?: () => void;
}

export function BasicResults({
  result,
  rawGoal,
  onApplyImproved,
  isAnalyzing,
  onTryExample,
  onInsertSection,
  onInsertFullOutline,
}: BasicResultsProps) {
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const hasContent = result.structuredPrompt.trim().length > 0;

  if (!hasContent) {
    return (
      <Card className="border-dashed border-border/40">
        <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center min-h-[240px] text-muted-foreground">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 mb-4">
            <Lightbulb className="h-7 w-7 opacity-40" />
          </div>
          <p className="text-sm font-semibold">Start typing to see your prompt score</p>
          <p className="text-xs mt-1.5 mb-5 text-muted-foreground/70 max-w-[280px]">
            Your prompt will be analyzed for clarity, efficiency, and quality
          </p>
          {onTryExample && (
            <div className="w-full space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">
                Or try an example
              </p>
              {BASIC_EXAMPLES.map((example, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2.5 px-3.5 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  onClick={() => onTryExample(example)}
                >
                  <Zap className="h-3 w-3 mr-2.5 shrink-0 text-amber-500" />
                  <span className="truncate">{example}</span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <StickyScore
        score={result.rating.totalScore}
        band={result.rating.band}
        targetRef={scoreCardRef}
      />

      <div ref={scoreCardRef}>
        <PromptRatingPanel
          rating={result.rating}
          isAnalyzing={isAnalyzing}
          subtitle="Based on clarity, constraints, structure, and efficiency"
          improvementHint={RATING_GUIDANCE.IMPROVEMENT_HINT_BASIC}
          onInsertSection={onInsertSection}
          onInsertFullOutline={onInsertFullOutline}
        />
      </div>

      {rawGoal && <NlpAnalysisPanel text={result.structuredPrompt} analysis={result.nlpAnalysis} />}

      {/* Before/After Comparison */}
      {rawGoal && <BeforeAfterComparison promptText={rawGoal} onApplyImproved={onApplyImproved} />}

      {/* Structured Prompt Preview */}
      <PromptPreview title="Your Structured Prompt" content={result.structuredPrompt} />

      {/* Meta Prompt Preview */}
      {result.metaPrompt && (
        <PromptPreview title="Meta Prompt (System Instructions)" content={result.metaPrompt} />
      )}

      {/* Similar Prompts from History */}
      {rawGoal && (
        <PromptSuggestionsPanel
          currentText={rawGoal}
          mode="basic"
          onApply={onApplyImproved || (() => {})}
        />
      )}

      {/* Version History */}
      <VersionHistoryPanel
        currentPrompt={rawGoal || ''}
        currentMetaPrompt={result.metaPrompt}
        currentScore={result.rating.totalScore}
        mode="basic"
        onRestore={onApplyImproved || (() => {})}
      />

      {/* Export */}
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-semibold tracking-tight">Export</CardTitle>
            <InfoTooltip content="Export your prompt in multiple formats. Copy to clipboard, download as Markdown, Text, JSON, or a ZIP bundle with the full analysis." />
          </div>
        </CardHeader>
        <CardContent>
          <ExportButtons result={result} />
        </CardContent>
      </Card>
    </div>
  );
}
