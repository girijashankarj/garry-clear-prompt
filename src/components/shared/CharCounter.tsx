import { cn } from '@/lib/utils';

interface CharCounterProps {
  current: number;
  max?: number;
  showWords?: boolean;
  text?: string;
}

export function CharCounter({ current, max, showWords, text }: CharCounterProps) {
  const isNearLimit = max ? current > max * 0.9 : false;
  const isOverLimit = max ? current > max : false;
  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      className="flex items-center gap-2 text-xs text-muted-foreground"
      aria-live="polite"
      aria-atomic="true"
    >
      {showWords && text && text.trim().length > 0 && (
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      )}
      {showWords && text && text.trim().length > 0 && (
        <span className="text-muted-foreground/40">|</span>
      )}
      <span
        className={cn(
          'tabular-nums',
          isOverLimit && 'text-destructive font-medium',
          isNearLimit && !isOverLimit && 'text-amber-500'
        )}
      >
        {current.toLocaleString()}
        {max ? ` / ${max.toLocaleString()}` : ''} chars
      </span>
    </div>
  );
}
