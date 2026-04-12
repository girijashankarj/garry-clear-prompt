import { useState } from 'react';
import { Check, Lightbulb, Circle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type {
  PromptRating as PromptRatingType,
  RatingBand,
  RatingDimension,
  PromptSectionCoverage,
} from '@/types/prompt.types';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { RATING_GUIDANCE } from '@/common/messages/info';
import { cn } from '@/lib/utils';

const DEFAULT_SUGGESTIONS_SHOWN = 3;

const BAND_GLOW: Record<RatingBand, string> = {
  excellent: 'score-glow-emerald',
  good: 'score-glow-blue',
  average: 'score-glow-amber',
  weak: 'score-glow-orange',
  poor: 'score-glow-red',
};

const SECTION_ITEMS: { key: keyof PromptSectionCoverage; label: string }[] = [
  { key: 'goal', label: 'Goal' },
  { key: 'context', label: 'Context' },
  { key: 'constraints', label: 'Constraints' },
  { key: 'output', label: 'Output' },
];

interface PromptRatingPanelProps {
  rating: PromptRatingType;
  isAnalyzing?: boolean;
  /** Shown under the title (e.g. basic mode explainer). */
  subtitle?: string;
  /** Where to find Before / After (basic vs advanced layout). */
  improvementHint?: string;
  onInsertSection?: (section: keyof PromptSectionCoverage) => void;
  onInsertFullOutline?: () => void;
}

function DimensionBar({ dimension, hint }: { dimension: RatingDimension; hint: string }) {
  const isNegative = dimension.maxScore === 0;
  const percentage = isNegative
    ? Math.max(0, 100 + (dimension.score / 15) * 100)
    : dimension.maxScore > 0
      ? (dimension.score / dimension.maxScore) * 100
      : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-tight">{dimension.name}</span>
        <span
          className={cn(
            'text-xs font-mono font-medium',
            isNegative ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {isNegative ? dimension.score : `${dimension.score}/${dimension.maxScore}`}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" />
      <p className="text-[11px] text-muted-foreground leading-relaxed">{dimension.feedback}</p>
      <p className="text-[10px] text-muted-foreground/90 leading-snug border-l-2 border-primary/25 pl-2">
        <span className="font-medium text-foreground/80">Next: </span>
        {hint}
      </p>
    </div>
  );
}

function SectionCoverageRow({
  coverage,
  onInsertSection,
}: {
  coverage: PromptSectionCoverage;
  onInsertSection?: (section: keyof PromptSectionCoverage) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="list"
      aria-label="Detected sections in your prompt"
    >
      {SECTION_ITEMS.map(({ key, label }) => {
        const present = coverage[key];
        const interactive = Boolean(onInsertSection);
        const body = (
          <>
            {present ? (
              <Check className="h-3 w-3 shrink-0" aria-hidden />
            ) : (
              <Circle className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
            )}
            <span>{label}</span>
            {interactive && !present ? (
              <Plus className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            ) : null}
          </>
        );

        if (interactive && !present) {
          return (
            <button
              key={key}
              type="button"
              role="listitem"
              onClick={() => onInsertSection?.(key)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors',
                'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer'
              )}
              aria-label={`Insert ${label} section heading into your prompt`}
            >
              {body}
            </button>
          );
        }

        return (
          <span
            key={key}
            role="listitem"
            aria-label={present ? `${label} section detected` : `${label} section not detected`}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium',
              present
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'border-border/60 bg-muted/40 text-muted-foreground'
            )}
          >
            {body}
          </span>
        );
      })}
    </div>
  );
}

export function PromptRatingPanel({
  rating,
  isAnalyzing,
  subtitle,
  improvementHint,
  onInsertSection,
  onInsertFullOutline,
}: PromptRatingPanelProps) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const visibleSuggestions = showAllSuggestions
    ? rating.suggestions
    : rating.suggestions.slice(0, DEFAULT_SUGGESTIONS_SHOWN);
  const hints = rating.dimensionHints;

  return (
    <Card className={cn('overflow-hidden', BAND_GLOW[rating.band])}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-4">
          <ScoreBadge score={rating.totalScore} band={rating.band} size="lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight">Prompt Quality Rating</h3>
              {isAnalyzing && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Analyzing...
                </span>
              )}
            </div>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {RATING_GUIDANCE.SCORE_EXPLAINER}
            </p>
            {improvementHint ? (
              <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
                {improvementHint}
              </p>
            ) : null}
            <SectionCoverageRow
              coverage={rating.sectionCoverage}
              onInsertSection={onInsertSection}
            />
            {onInsertFullOutline ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[11px] rounded-md"
                onClick={onInsertFullOutline}
              >
                Insert Goal → Output outline
              </Button>
            ) : null}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-foreground/80">
                {RATING_GUIDANCE.SUGGESTED_NEXT_STEPS}
              </p>
              {visibleSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" aria-hidden />
                  <span className="text-muted-foreground leading-relaxed">{s}</span>
                </div>
              ))}
              {rating.suggestions.length > DEFAULT_SUGGESTIONS_SHOWN && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAllSuggestions((prev) => !prev)}
                >
                  {showAllSuggestions
                    ? RATING_GUIDANCE.SHOW_LESS
                    : RATING_GUIDANCE.SHOW_ALL(rating.suggestions.length)}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <div className="space-y-3">
          <DimensionBar dimension={rating.dimensions.clarity} hint={hints.clarity} />
          <DimensionBar dimension={rating.dimensions.constraints} hint={hints.constraints} />
          <DimensionBar dimension={rating.dimensions.structure} hint={hints.structure} />
          <DimensionBar
            dimension={rating.dimensions.tokenEfficiency}
            hint={hints.tokenEfficiency}
          />
          <DimensionBar dimension={rating.dimensions.riskPenalty} hint={hints.riskPenalty} />
        </div>
      </CardContent>
    </Card>
  );
}
