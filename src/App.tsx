import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import type { BasicPromptInput, AdvancedPromptInput } from '@/types/prompt.types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePromptEngineBasic, usePromptEngineAdvanced } from '@/hooks/use-prompt-engine';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BasicPromptForm } from '@/components/basic-mode/BasicPromptForm';
import { BasicResults } from '@/components/basic-mode/BasicResults';
import { AdvancedPromptForm } from '@/components/advanced-mode/AdvancedPromptForm';
import { AdvancedResults } from '@/components/advanced-mode/AdvancedResults';
import { STORAGE_KEYS } from '@/common/constants';
import { setMode, toggleTheme } from '@/store/promptSlice';
import type { RootState, AppDispatch } from '@/store';

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
  const [input, setInput] = useLocalStorage<BasicPromptInput>(STORAGE_KEYS.BASIC_INPUT, DEFAULT_BASIC_INPUT);
  const result = usePromptEngineBasic(input);

  const handleApplyImproved = useCallback((improved: string) => {
    setInput((prev) => ({ ...prev, goal: improved }));
  }, [setInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <BasicPromptForm input={input} onChange={setInput} />
      </div>
      <div>
        <BasicResults result={result} rawGoal={input.goal} onApplyImproved={handleApplyImproved} />
      </div>
    </div>
  );
}

function AdvancedMode() {
  const [input, setInput] = useLocalStorage<AdvancedPromptInput>(STORAGE_KEYS.ADVANCED_INPUT, DEFAULT_ADVANCED_INPUT);
  const result = usePromptEngineAdvanced(input);

  const handleApplyImproved = useCallback((improved: string) => {
    setInput((prev) => ({ ...prev, prompt: improved }));
  }, [setInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <AdvancedPromptForm input={input} onChange={setInput} />
      </div>
      <div>
        <AdvancedResults result={result} rawPrompt={input.prompt} onApplyImproved={handleApplyImproved} />
      </div>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.prompt.mode);
  const theme = useSelector((state: RootState) => state.prompt.theme);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleModeChange = useCallback(
    (newMode: 'basic' | 'advanced') => {
      dispatch(setMode(newMode));
    },
    [dispatch],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        theme={theme}
        onThemeToggle={handleToggleTheme}
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
