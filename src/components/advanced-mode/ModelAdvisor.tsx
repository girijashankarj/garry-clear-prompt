import { Brain, Zap, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ModelRecommendation, ModelTier } from '@/types/prompt.types';
import { MODEL_TIERS } from '@/lib/data/model-tiers';
import { cn } from '@/lib/utils';

interface ModelAdvisorProps {
  recommendation: ModelRecommendation;
}

const TIER_ICONS: Record<ModelTier, typeof Brain> = {
  fast: Zap,
  balanced: Cpu,
  reasoning: Brain,
};

const TIER_COLORS: Record<ModelTier, string> = {
  fast: 'text-emerald-500',
  balanced: 'text-blue-500',
  reasoning: 'text-purple-500',
};

const CONFIDENCE_COLORS = {
  high: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  low: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export function ModelAdvisorPanel({ recommendation }: ModelAdvisorProps) {
  const recommendedTier = MODEL_TIERS.find((t) => t.tier === recommendation.recommended);
  const RecommendedIcon = TIER_ICONS[recommendation.recommended];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Model Recommendation</CardTitle>
          <Badge
            variant="outline"
            className={cn('text-xs', CONFIDENCE_COLORS[recommendation.confidence])}
          >
            {recommendation.confidence} confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Recommended */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg border p-3',
            'border-primary/20 bg-primary/5'
          )}
        >
          <RecommendedIcon className={cn('h-8 w-8', TIER_COLORS[recommendation.recommended])} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{recommendedTier?.label}</span>
              <Badge variant="secondary" className="text-xs">
                Recommended
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{recommendedTier?.description}</p>
          </div>
        </div>

        {/* Reason */}
        <p className="text-xs text-muted-foreground">{recommendation.reason}</p>

        {/* Alternative & Avoid */}
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground">
            Alternative:{' '}
            <span className="font-medium text-foreground">{recommendation.alternative}</span>
          </span>
          {recommendation.avoid && (
            <span className="text-muted-foreground">
              | Avoid: <span className="font-medium text-destructive">{recommendation.avoid}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
