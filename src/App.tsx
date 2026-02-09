import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'sonner';
import type { BasicPromptInput, AdvancedPromptInput } from '@/types/prompt.types';
import { useMode } from '@/hooks/use-mode';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePromptEngineBasic, usePromptEngineAdvanced } from '@/hooks/use-prompt-engine';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BasicPromptForm } from '@/components/basic-mode/BasicPromptForm';
import { BasicResults } from '@/components/basic-mode/BasicResults';
import { AdvancedPromptForm } from '@/components/advanced-mode/AdvancedPromptForm';
import { AdvancedResults } from '@/components/advanced-mode/AdvancedResults';

const DEFAULT_BASIC_INPUT: BasicPromptInput = {
  goal: '',
  detailLevel: 'medium',
  styleTone: 'simple',
  responseFormat: 'steps',
  rules: '',
};

const DEFAULT_ADVANCED_INPUT: AdvancedPromptInput = {
  prompt: '',
  metaPrompt: '',
  planFirst: false,
  taskType: 'general',
  complexity: 'medium',
  riskLevel: 'low',
  contextSize: 'small',
  outputSize: 'm',
  outputFormat: {
    strictJson: false,
    includeCode: false,
    includeTables: false,
    includeDiagrams: false,
    includeExamples: false,
  },
  needsToolUse: false,
  audience: '',
};

function BasicMode() {
  const [input, setInput] = useLocalStorage<BasicPromptInput>('gcp-basic-input', DEFAULT_BASIC_INPUT);
  const result = usePromptEngineBasic(input);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <BasicPromptForm input={input} onChange={setInput} />
      </div>
      <div>
        <BasicResults result={result} />
      </div>
    </div>
  );
}

function AdvancedMode() {
  const [input, setInput] = useLocalStorage<AdvancedPromptInput>('gcp-advanced-input', DEFAULT_ADVANCED_INPUT);
  const result = usePromptEngineAdvanced(input);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <AdvancedPromptForm input={input} onChange={setInput} />
      </div>
      <div>
        <AdvancedResults result={result} />
      </div>
    </div>
  );
}

export default function App() {
  const { mode, setMode } = useMode();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('gcp-theme', 'dark');

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        mode={mode}
        onModeChange={setMode}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {mode === 'basic' ? <BasicMode /> : <AdvancedMode />}
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        theme={theme}
        richColors
      />
    </div>
  );
}
