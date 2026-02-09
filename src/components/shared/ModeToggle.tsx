import type { AppMode } from '@/types/prompt.types';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center rounded-lg bg-muted p-1 gap-1">
      <button
        onClick={() => onModeChange('basic')}
        className={cn(
          'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
          mode === 'basic'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Basic
      </button>
      <button
        onClick={() => onModeChange('advanced')}
        className={cn(
          'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
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
