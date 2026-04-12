import { useCallback } from 'react';
import type { BasicPromptInput, PromptSectionCoverage } from '@/types/prompt.types';
import {
  PROMPT_FULL_SECTION_OUTLINE,
  PROMPT_SECTION_SNIPPETS,
} from '@/common/prompt-section-snippets';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePromptEngineBasic } from '@/hooks/use-prompt-engine';
import { BasicPromptForm } from './BasicPromptForm';
import { BasicResults } from './BasicResults';
import { MobileTabLayout } from '@/components/shared/MobileTabLayout';
import { STORAGE_KEYS } from '@/common/constants';

const DEFAULT_BASIC_INPUT: BasicPromptInput = {
  goal: '',
  detailLevel: 'medium',
  styleTone: 'simple',
  responseFormat: 'steps',
  rules: '',
};

export default function BasicMode() {
  const [input, setInput] = useLocalStorage<BasicPromptInput>(
    STORAGE_KEYS.BASIC_INPUT,
    DEFAULT_BASIC_INPUT
  );
  const { result, isAnalyzing } = usePromptEngineBasic(input);

  const handleApplyImproved = useCallback(
    (improved: string) => {
      setInput((prev) => ({ ...prev, goal: improved }));
    },
    [setInput]
  );

  const handleTryExample = useCallback(
    (text: string) => {
      setInput((prev) => ({ ...prev, goal: text }));
    },
    [setInput]
  );

  const appendToGoal = useCallback(
    (snippet: string) => {
      setInput((prev) => {
        const base = prev.goal;
        const joiner = base.trim() && !base.endsWith('\n') ? '\n' : '';
        return { ...prev, goal: `${base}${joiner}${snippet}` };
      });
    },
    [setInput]
  );

  const handleInsertSection = useCallback(
    (key: keyof PromptSectionCoverage) => {
      appendToGoal(PROMPT_SECTION_SNIPPETS[key]);
    },
    [appendToGoal]
  );

  const handleInsertFullOutline = useCallback(() => {
    appendToGoal(PROMPT_FULL_SECTION_OUTLINE);
  }, [appendToGoal]);

  return (
    <MobileTabLayout
      form={<BasicPromptForm input={input} onChange={setInput} />}
      results={
        <BasicResults
          result={result}
          rawGoal={input.goal}
          onApplyImproved={handleApplyImproved}
          isAnalyzing={isAnalyzing}
          onTryExample={handleTryExample}
          onInsertSection={handleInsertSection}
          onInsertFullOutline={handleInsertFullOutline}
        />
      }
    />
  );
}
