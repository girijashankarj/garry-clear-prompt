import type { RatingBand } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  band: RatingBand;
  size?: 'sm' | 'lg';
}

const BAND_COLORS: Record<RatingBand, string> = {
  excellent: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
  good: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
  average: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
  weak: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
  poor: 'text-red-500 border-red-500/30 bg-red-500/10',
};

const BAND_LABELS: Record<RatingBand, string> = {
  excellent: 'Excellent',
  good: 'Good',
  average: 'Average',
  weak: 'Weak',
  poor: 'Poor',
};

export function ScoreBadge({ score, band, size = 'sm' }: ScoreBadgeProps) {
  const isLarge = size === 'lg';

  return (
    <div className={cn(
      'inline-flex flex-col items-center justify-center rounded-xl border-2',
      BAND_COLORS[band],
      isLarge ? 'w-28 h-28 gap-1' : 'w-20 h-20 gap-0.5'
    )}>
      <span className={cn('font-bold', isLarge ? 'text-3xl' : 'text-xl')}>
        {score}
      </span>
      <span className={cn('font-medium', isLarge ? 'text-sm' : 'text-xs')}>
        {BAND_LABELS[band]}
      </span>
    </div>
  );
}
