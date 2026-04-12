import { RotateCcw, Sparkles } from 'lucide-react';
import type { AppMode } from '@/types/prompt.types';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/common/constants';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onResetApp: () => void;
}

export function Header({ mode, onModeChange, theme, onThemeToggle, onResetApp }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md" role="banner">
      <div className="header-gradient-line" />
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
            <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">{APP_NAME}</h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Write better prompts. Get better answers.
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="App controls">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={onResetApp}
            aria-label="Reset app to defaults"
          >
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline text-xs font-medium">Reset</span>
          </Button>
          <ModeToggle mode={mode} onModeChange={onModeChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </nav>
      </div>
      <div className="h-px bg-border/50" />
    </header>
  );
}
