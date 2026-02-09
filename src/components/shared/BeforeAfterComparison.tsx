import { useMemo } from 'react';
import { ArrowRight, Copy, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from './ScoreBadge';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils';
import { improvePrompt, type PromptImprovement } from '@/lib/engine/prompt-improver';

interface BeforeAfterComparisonProps {
  promptText: string;
  onApplyImproved?: (improved: string) => void;
}

export function BeforeAfterComparison({ promptText, onApplyImproved }: BeforeAfterComparisonProps) {
  const improvement: PromptImprovement = useMemo(
    () => improvePrompt(promptText),
    [promptText]
  );

  if (!promptText.trim() || improvement.changes.length === 0) {
    return null;
  }

  const scoreDiff = improvement.improvedRating.totalScore - improvement.originalRating.totalScore;

  const handleCopyImproved = async () => {
    const ok = await copyToClipboard(improvement.improved);
    if (ok) toast.success('Improved prompt copied');
    else toast.error('Failed to copy');
  };

  const handleApply = () => {
    onApplyImproved?.(improvement.improved);
    toast.success('Improved prompt applied');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-sm font-medium">Before / After Comparison</CardTitle>
          {scoreDiff > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs font-mono">
              +{scoreDiff} pts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score comparison */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Before</span>
            <ScoreBadge score={improvement.originalRating.totalScore} band={improvement.originalRating.band} size="sm" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground mt-4" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">After</span>
            <ScoreBadge score={improvement.improvedRating.totalScore} band={improvement.improvedRating.band} size="sm" />
          </div>
        </div>

        {/* Changes made */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Changes applied:</p>
          {improvement.changes.map((change, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-emerald-500 mt-0.5">+</span>
              <span className="text-muted-foreground">{change}</span>
            </div>
          ))}
        </div>

        {/* Improved prompt preview */}
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Improved prompt:</p>
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
            {improvement.improved}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyImproved}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy Improved
          </Button>
          {onApplyImproved && (
            <Button variant="default" size="sm" onClick={handleApply}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
