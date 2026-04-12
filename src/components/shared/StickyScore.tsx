import { useEffect, useState } from 'react';
import type { RatingBand } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface StickyScoreProps {
  score: number;
  band: RatingBand;
  targetRef: React.RefObject<HTMLElement | null>;
}

const BAND_COLORS: Record<RatingBand, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-blue-500',
  average: 'bg-amber-500',
  weak: 'bg-orange-500',
  poor: 'bg-red-500',
};

const BAND_TEXT_COLORS: Record<RatingBand, string> = {
  excellent: 'text-emerald-500',
  good: 'text-blue-500',
  average: 'text-amber-500',
  weak: 'text-orange-500',
  poor: 'text-red-500',
};

export function StickyScore({ score, band, targetRef }: StickyScoreProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: '-60px 0px 0px 0px',
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  return (
    <div
      className={cn(
        'sticky top-14 z-40 transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      )}
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/90 backdrop-blur-md px-4 py-2 shadow-lg w-fit">
        <div
          className={cn(
            'h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-background',
            BAND_COLORS[band],
            `ring-${band === 'excellent' ? 'emerald' : band === 'good' ? 'blue' : band === 'average' ? 'amber' : band === 'weak' ? 'orange' : 'red'}-500/20`
          )}
        />
        <span className={cn('text-sm font-bold tabular-nums', BAND_TEXT_COLORS[band])}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground capitalize font-medium">{band}</span>
      </div>
    </div>
  );
}
