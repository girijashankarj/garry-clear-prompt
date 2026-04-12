import type { AppMode } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div
      className="flex items-center rounded-xl bg-muted/60 border border-border/40 p-1 gap-0.5"
      role="tablist"
      aria-label="Prompt mode"
    >
      <button
        role="tab"
        aria-selected={mode === 'basic'}
        onClick={() => onModeChange('basic')}
        className={cn(
          'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
          mode === 'basic'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Basic
      </button>
      <button
        role="tab"
        aria-selected={mode === 'advanced'}
        onClick={() => onModeChange('advanced')}
        className={cn(
          'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
          mode === 'advanced'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Advanced
      </button>
    </div>
  );
}
