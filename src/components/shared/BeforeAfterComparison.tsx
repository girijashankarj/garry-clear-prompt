import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Copy, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from './ScoreBadge';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';
import {
  improvePrompt,
  ML_INTENT_FEATURE_ENABLED,
  refineImprovementWithMl,
  type PromptImprovement,
  type RatingTextAssembler,
} from '@/lib/engine/prompt-improver';
import { INFO_MESSAGES, RATING_GUIDANCE } from '@/common/messages/info';
import { ERROR_MESSAGES } from '@/common/messages/error';

interface BeforeAfterComparisonProps {
  promptText: string;
  onApplyImproved?: (improved: string) => void;
  /** When set, before/after scores use `ratePrompt(assembler(raw))` so they match the main card (advanced mode). */
  ratingAssembler?: RatingTextAssembler;
}

type DiffSegment = { type: 'equal' | 'added' | 'removed'; text: string };

function computeWordDiff(original: string, improved: string): DiffSegment[] {
  const oldWords = original.split(/(\s+)/);
  const newWords = improved.split(/(\s+)/);
  const m = oldWords.length;
  const n = newWords.length;

  // LCS via DP (adequate for prompt-sized text)
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        oldWords[i - 1] === newWords[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const segments: DiffSegment[] = [];
  let i = m,
    j = n;
  const raw: DiffSegment[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      raw.push({ type: 'equal', text: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      raw.push({ type: 'added', text: newWords[j - 1] });
      j--;
    } else {
      raw.push({ type: 'removed', text: oldWords[i - 1] });
      i--;
    }
  }
  raw.reverse();

  // Merge consecutive segments of the same type
  for (const seg of raw) {
    const last = segments[segments.length - 1];
    if (last && last.type === seg.type) {
      last.text += seg.text;
    } else {
      segments.push({ ...seg });
    }
  }

  return segments;
}

export function BeforeAfterComparison({
  promptText,
  onApplyImproved,
  ratingAssembler,
}: BeforeAfterComparisonProps) {
  const syncImprovement: PromptImprovement = useMemo(
    () => improvePrompt(promptText, ratingAssembler ? { ratingAssembler } : undefined),
    [promptText, ratingAssembler]
  );

  const [mlImprovement, setMlImprovement] = useState<PromptImprovement | null>(null);
  const [mlBusy, setMlBusy] = useState(false);

  useEffect(() => {
    setMlImprovement(null);
  }, [promptText, ratingAssembler]);

  const improvement = mlImprovement ?? syncImprovement;

  const diff = useMemo(
    () => computeWordDiff(promptText, improvement.improved),
    [promptText, improvement.improved]
  );

  const handleMlRefine = useCallback(async () => {
    setMlBusy(true);
    try {
      const out = await refineImprovementWithMl(
        syncImprovement,
        promptText,
        ratingAssembler ? { ratingAssembler } : undefined
      );
      switch (out.status) {
        case 'applied':
          setMlImprovement(out.improvement);
          toast.success(INFO_MESSAGES.ML_CHECKLIST_REFINED);
          break;
        case 'skipped_low_confidence':
          toast.info(INFO_MESSAGES.ML_CHECKLIST_SKIPPED_LOW_CONFIDENCE);
          break;
        case 'skipped_inference_failed':
          toast.error(ERROR_MESSAGES.ML_INTENT_REFINE_FAILED);
          break;
        default:
          break;
      }
    } finally {
      setMlBusy(false);
    }
  }, [syncImprovement, promptText, ratingAssembler]);

  if (!promptText.trim()) {
    return null;
  }

  if (improvement.changes.length === 0) {
    if (improvement.originalRating.totalScore >= 100) {
      return null;
    }
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
            <CardTitle className="text-sm font-semibold tracking-tight">
              {RATING_GUIDANCE.NO_AUTO_IMPROVE_TITLE}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {RATING_GUIDANCE.NO_AUTO_IMPROVE_BODY}
          </p>
        </CardContent>
      </Card>
    );
  }

  const scoreDiff = improvement.improvedRating.totalScore - improvement.originalRating.totalScore;

  const handleCopyImproved = async () => {
    const ok = await copyToClipboard(improvement.improved);
    if (ok) toast.success(INFO_MESSAGES.IMPROVED_COPIED);
    else toast.error(ERROR_MESSAGES.CLIPBOARD_FAILED);
  };

  const handleApply = () => {
    onApplyImproved?.(improvement.improved);
    toast.success(INFO_MESSAGES.IMPROVED_APPLIED);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <CardTitle className="text-sm font-semibold tracking-tight">
            Before / After Comparison
          </CardTitle>
          {scoreDiff > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              +{scoreDiff} pts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {ratingAssembler ? (
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Scores use your full assembled prompt (output toggles, audience, plan-first)—same basis
            as the main quality rating card.
          </p>
        ) : null}
        {/* Score comparison */}
        <div className="flex items-center justify-center gap-5 py-1.5 rounded-lg bg-muted/30">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Before
            </span>
            <ScoreBadge
              score={improvement.originalRating.totalScore}
              band={improvement.originalRating.band}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              After
            </span>
            <ScoreBadge
              score={improvement.improvedRating.totalScore}
              band={improvement.improvedRating.band}
              size="sm"
            />
          </div>
        </div>

        {/* Changes made */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Changes applied:</p>
          {improvement.changes.map((change, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold shrink-0 mt-0.5">
                +
              </span>
              <span className="text-muted-foreground leading-relaxed">{change}</span>
            </div>
          ))}
        </div>

        {ML_INTENT_FEATURE_ENABLED ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-2.5 space-y-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full rounded-lg"
              disabled={mlBusy}
              aria-busy={mlBusy}
              aria-label={RATING_GUIDANCE.ML_REFINE_BUTTON}
              onClick={handleMlRefine}
            >
              {mlBusy ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin shrink-0" aria-hidden />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1.5 shrink-0" aria-hidden />
              )}
              {RATING_GUIDANCE.ML_REFINE_BUTTON}
            </Button>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {RATING_GUIDANCE.ML_REFINE_HELP}
            </p>
          </div>
        ) : null}

        {/* Diff view */}
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Diff:
          </p>
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed max-h-36 overflow-y-auto">
            {diff.map((seg, i) => {
              if (seg.type === 'added') {
                return (
                  <span
                    key={i}
                    className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded px-0.5 py-px"
                  >
                    {seg.text}
                  </span>
                );
              }
              if (seg.type === 'removed') {
                return (
                  <span
                    key={i}
                    className="bg-red-500/15 text-red-600 dark:text-red-400 line-through rounded px-0.5 py-px"
                  >
                    {seg.text}
                  </span>
                );
              }
              return <span key={i}>{seg.text}</span>;
            })}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyImproved} className="rounded-lg">
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy Improved
          </Button>
          {onApplyImproved && (
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              className="rounded-lg bg-gradient-to-r from-primary to-primary/80"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
