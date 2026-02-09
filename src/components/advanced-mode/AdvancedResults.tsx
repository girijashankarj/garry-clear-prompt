import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PromptEngineResult } from '@/types/prompt.types';
import { PromptRatingPanel } from './PromptRating';
import { ModelAdvisorPanel } from './ModelAdvisor';
import { TokenEstimatorPanel } from './TokenEstimator';
import { McpAdvisorPanel } from './McpAdvisor';
import { LintWarningsPanel } from './LintWarnings';
import { PromptPreview } from '@/components/shared/PromptPreview';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { BeforeAfterComparison } from '@/components/shared/BeforeAfterComparison';
import { CalibrationPanel } from '@/components/shared/CalibrationPanel';
import { NlpAnalysisPanel } from '@/components/shared/NlpAnalysisPanel';
import { CursorExportPanel } from '@/components/shared/CursorExportPanel';
import { VersionHistoryPanel } from '@/components/shared/VersionHistoryPanel';
import { TestCasesPanel } from '@/components/shared/TestCasesPanel';
import { PromptSuggestionsPanel } from '@/components/shared/PromptSuggestionsPanel';
import { LlmRunnerPanel } from '@/components/shared/LlmRunnerPanel';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

interface AdvancedResultsProps {
  result: PromptEngineResult;
  rawPrompt?: string;
  onApplyImproved?: (improved: string) => void;
}

export function AdvancedResults({ result, rawPrompt, onApplyImproved }: AdvancedResultsProps) {
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
      {/* ── Section 1: Analysis ────────────────────────────── */}
      <PromptRatingPanel rating={result.rating} />
      {rawPrompt && <NlpAnalysisPanel text={rawPrompt} />}
      <LintWarningsPanel warnings={result.lintWarnings} />

      {/* ── Section 2: Improvement ─────────────────────────── */}
      {rawPrompt && (
        <BeforeAfterComparison promptText={rawPrompt} onApplyImproved={onApplyImproved} />
      )}

      {/* ── Section 3: Intelligence ────────────────────────── */}
      <ModelAdvisorPanel recommendation={result.modelRecommendation} />
      <TokenEstimatorPanel estimate={result.tokenEstimate} />
      <McpAdvisorPanel suggestions={result.mcpSuggestions} />
      <CalibrationPanel promptSnippet={rawPrompt || ''} tokenEstimate={result.tokenEstimate} />

      <Separator />

      {/* ── Section 4: Prompt Output ───────────────────────── */}
      <PromptPreview title="Structured Prompt" content={result.structuredPrompt} />
      {result.metaPrompt && (
        <PromptPreview title="Meta Prompt" content={result.metaPrompt} />
      )}

      <Separator />

      {/* ── Section 5: History & Suggestions ────────────────── */}
      {rawPrompt && (
        <PromptSuggestionsPanel currentText={rawPrompt} mode="advanced" onApply={onApplyImproved || (() => {})} />
      )}

      <VersionHistoryPanel
        currentPrompt={rawPrompt || ''}
        currentMetaPrompt={result.metaPrompt}
        currentScore={result.rating.totalScore}
        mode="advanced"
        onRestore={onApplyImproved || (() => {})}
      />

      <Separator />

      {/* ── Section 6: Testing & Validation ─────────────────── */}
      <TestCasesPanel promptSnippet={rawPrompt || ''} />

      <Separator />

      {/* ── Section 7: Export ───────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-medium">Export</CardTitle>
            <InfoTooltip content="Export your prompt in multiple formats. Copy to clipboard, download as a file, or create a ZIP bundle with the full analysis." />
          </div>
        </CardHeader>
        <CardContent>
          <ExportButtons result={result} />
        </CardContent>
      </Card>

      <CursorExportPanel result={result} />

      <Separator />

      {/* ── Section 8: LLM Runner ──────────────────────────── */}
      <LlmRunnerPanel result={result} />
    </div>
  );
}
