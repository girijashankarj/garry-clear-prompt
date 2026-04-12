import { useEffect, useState } from 'react';
import type { RatingBand } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  band: RatingBand;
  size?: 'sm' | 'lg';
}

const BAND_COLORS: Record<RatingBand, { text: string; stroke: string; bg: string; glow: string }> =
  {
    excellent: {
      text: 'text-emerald-500',
      stroke: 'stroke-emerald-500',
      bg: 'bg-emerald-500/10',
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    },
    good: {
      text: 'text-blue-500',
      stroke: 'stroke-blue-500',
      bg: 'bg-blue-500/10',
      glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]',
    },
    average: {
      text: 'text-amber-500',
      stroke: 'stroke-amber-500',
      bg: 'bg-amber-500/10',
      glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    },
    weak: {
      text: 'text-orange-500',
      stroke: 'stroke-orange-500',
      bg: 'bg-orange-500/10',
      glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]',
    },
    poor: {
      text: 'text-red-500',
      stroke: 'stroke-red-500',
      bg: 'bg-red-500/10',
      glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    },
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
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const ringSize = isLarge ? 120 : 80;
  const strokeWidth = isLarge ? 6 : 4;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate score counting up
  useEffect(() => {
    setAnimatedScore(0);
    setAnimatedProgress(0);

    if (score === 0) return;

    const duration = 800;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      setAnimatedProgress(score * eased);

      if (current >= steps) {
        setAnimatedScore(score);
        setAnimatedProgress(score);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  const colors = BAND_COLORS[band];

  return (
    <div
      className={cn(
        'relative inline-flex flex-col items-center justify-center',
        isLarge ? 'w-[120px] h-[120px]' : 'w-[80px] h-[80px]'
      )}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Prompt quality score: ${score} out of 100 (${BAND_LABELS[band]})`}
    >
      {/* SVG ring */}
      <svg
        width={ringSize}
        height={ringSize}
        className={cn('absolute inset-0 -rotate-90', colors.glow)}
      >
        {/* Background ring */}
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          className={cn(colors.stroke, 'transition-all duration-100')}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <span
          className={cn('font-bold tabular-nums', colors.text, isLarge ? 'text-3xl' : 'text-xl')}
        >
          {animatedScore}
        </span>
        <span className={cn('font-medium', colors.text, isLarge ? 'text-xs' : 'text-[10px]')}>
          {BAND_LABELS[band]}
        </span>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Score updated to {score}, {BAND_LABELS[band]}
      </span>
    </div>
  );
}
