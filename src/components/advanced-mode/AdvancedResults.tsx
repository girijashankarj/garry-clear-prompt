import { useRef } from 'react';
import {
  Lightbulb,
  Zap,
  BarChart3,
  Sparkles,
  Brain,
  FileOutput,
  Clock,
  FlaskConical,
  Download,
  Cpu,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { StickyScore } from '@/components/shared/StickyScore';
import type { PromptEngineResult, PromptSectionCoverage } from '@/types/prompt.types';
import type { RatingTextAssembler } from '@/lib/engine/prompt-improver';
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
import { RATING_GUIDANCE } from '@/common/messages/info';

const ADVANCED_EXAMPLES = [
  'You are a senior TypeScript developer. Refactor the following function to use async/await and add proper error handling with typed exceptions.',
  'Act as a database architect. Design a normalized PostgreSQL schema for an e-commerce platform with products, orders, users, and reviews. Include indexes and constraints.',
  'You are a technical writer. Create comprehensive API documentation for a REST endpoint that handles user authentication with JWT tokens.',
];

interface AdvancedResultsProps {
  result: PromptEngineResult;
  rawPrompt?: string;
  onApplyImproved?: (improved: string) => void;
  isAnalyzing?: boolean;
  onTryExample?: (text: string) => void;
  ratingAssembler?: RatingTextAssembler;
  onInsertSection?: (section: keyof PromptSectionCoverage) => void;
  onInsertFullOutline?: () => void;
}

export function AdvancedResults({
  result,
  rawPrompt,
  onApplyImproved,
  isAnalyzing,
  onTryExample,
  ratingAssembler,
  onInsertSection,
  onInsertFullOutline,
}: AdvancedResultsProps) {
  const ratingRef = useRef<HTMLDivElement>(null);
  const hasContent = result.structuredPrompt.trim().length > 0;

  if (!hasContent) {
    return (
      <Card className="border-dashed border-border/40">
        <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center min-h-[240px] text-muted-foreground">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 mb-4">
            <Lightbulb className="h-7 w-7 opacity-40" />
          </div>
          <p className="text-sm font-semibold">Write a prompt to see analysis</p>
          <p className="text-xs mt-1.5 mb-5 text-muted-foreground/70 max-w-[300px]">
            Rating, model advice, token estimates, lint, and MCP suggestions
          </p>
          {onTryExample && (
            <div className="w-full space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">
                Or try an example
              </p>
              {ADVANCED_EXAMPLES.map((example, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2.5 px-3.5 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  onClick={() => onTryExample(example)}
                >
                  <Zap className="h-3 w-3 mr-2.5 shrink-0 text-amber-500" />
                  <span className="line-clamp-2">{example}</span>
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
        targetRef={ratingRef}
      />

      <div ref={ratingRef}>
        <PromptRatingPanel
          rating={result.rating}
          isAnalyzing={isAnalyzing}
          improvementHint={RATING_GUIDANCE.IMPROVEMENT_HINT_ADVANCED}
          onInsertSection={onInsertSection}
          onInsertFullOutline={onInsertFullOutline}
        />
      </div>

      <Card className="overflow-hidden">
        <Accordion type="multiple" defaultValue={['analysis', 'improvement', 'output']}>
          <AccordionItem value="analysis" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-pink-500" />
                Analysis
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {rawPrompt && (
                <NlpAnalysisPanel text={result.structuredPrompt} analysis={result.nlpAnalysis} />
              )}
              <LintWarningsPanel warnings={result.lintWarnings} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="improvement" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Improvement
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {rawPrompt && (
                <BeforeAfterComparison
                  promptText={rawPrompt}
                  onApplyImproved={onApplyImproved}
                  ratingAssembler={ratingAssembler}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="intelligence" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-violet-500" />
                Intelligence
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <ModelAdvisorPanel recommendation={result.modelRecommendation} />
              <TokenEstimatorPanel estimate={result.tokenEstimate} />
              <McpAdvisorPanel suggestions={result.mcpSuggestions} />
              <CalibrationPanel
                promptSnippet={rawPrompt || ''}
                tokenEstimate={result.tokenEstimate}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="output" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <FileOutput className="h-3.5 w-3.5 text-blue-500" />
                Prompt Output
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <PromptPreview title="Structured Prompt" content={result.structuredPrompt} />
              {result.metaPrompt && (
                <PromptPreview title="Meta Prompt" content={result.metaPrompt} />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="history" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-cyan-500" />
                History &amp; Suggestions
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {rawPrompt && (
                <PromptSuggestionsPanel
                  currentText={rawPrompt}
                  mode="advanced"
                  onApply={onApplyImproved || (() => {})}
                />
              )}
              <VersionHistoryPanel
                currentPrompt={rawPrompt || ''}
                currentMetaPrompt={result.metaPrompt}
                currentScore={result.rating.totalScore}
                mode="advanced"
                onRestore={onApplyImproved || (() => {})}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="testing" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <FlaskConical className="h-3.5 w-3.5 text-emerald-500" />
                Testing &amp; Validation
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <TestCasesPanel promptSnippet={rawPrompt || ''} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="export" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <Download className="h-3.5 w-3.5 text-orange-500" />
                Export
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <ExportButtons result={result} />
              <CursorExportPanel result={result} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="llm" className="px-5">
            <AccordionTrigger className="text-sm py-3">
              <span className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-rose-500" />
                LLM Runner
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <LlmRunnerPanel result={result} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
