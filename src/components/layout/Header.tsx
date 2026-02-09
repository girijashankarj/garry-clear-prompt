import { Sparkles } from 'lucide-react';
import type { AppMode } from '@/types/prompt.types';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { APP_NAME } from '@/common/constants';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ mode, onModeChange, theme, onThemeToggle }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-bold leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Write better prompts. Get better answers.
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3" aria-label="App controls">
          <ModeToggle mode={mode} onModeChange={onModeChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </nav>
      </div>
    </header>
  );
}
