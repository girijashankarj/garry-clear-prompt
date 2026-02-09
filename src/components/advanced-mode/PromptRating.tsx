import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PromptRating as PromptRatingType, RatingDimension } from '@/types/prompt.types';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { cn } from '@/lib/utils';

interface PromptRatingProps {
  rating: PromptRatingType;
}

function DimensionBar({ dimension }: { dimension: RatingDimension }) {
  const isNegative = dimension.maxScore === 0; // Risk penalty
  const percentage = isNegative
    ? Math.max(0, 100 + (dimension.score / 15) * 100) // Inverted for risk
    : dimension.maxScore > 0 ? (dimension.score / dimension.maxScore) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{dimension.name}</span>
        <span className={cn(
          'text-xs font-mono',
          isNegative ? 'text-destructive' : 'text-muted-foreground'
        )}>
          {isNegative ? dimension.score : `${dimension.score}/${dimension.maxScore}`}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-[11px] text-muted-foreground">{dimension.feedback}</p>
    </div>
  );
}

export function PromptRatingPanel({ rating }: PromptRatingProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Prompt Quality Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score badge + suggestions side by side */}
        <div className="flex items-start gap-4">
          <ScoreBadge score={rating.totalScore} band={rating.band} size="lg" />
          <div className="flex-1 space-y-2">
            {rating.suggestions.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                <span className="text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dimension breakdown */}
        <div className="space-y-3 pt-2">
          <DimensionBar dimension={rating.dimensions.clarity} />
          <DimensionBar dimension={rating.dimensions.constraints} />
          <DimensionBar dimension={rating.dimensions.structure} />
          <DimensionBar dimension={rating.dimensions.tokenEfficiency} />
          <DimensionBar dimension={rating.dimensions.riskPenalty} />
        </div>
      </CardContent>
    </Card>
  );
}
