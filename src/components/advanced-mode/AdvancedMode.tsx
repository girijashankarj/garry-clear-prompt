import { useCallback } from 'react';
import type { AdvancedPromptInput, PromptSectionCoverage } from '@/types/prompt.types';
import {
  PROMPT_FULL_SECTION_OUTLINE,
  PROMPT_SECTION_SNIPPETS,
} from '@/common/prompt-section-snippets';
import { buildPromptFromAdvanced } from '@/lib/engine/prompt-builder';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePromptEngineAdvanced } from '@/hooks/use-prompt-engine';
import { AdvancedPromptForm } from './AdvancedPromptForm';
import { AdvancedResults } from './AdvancedResults';
import { MobileTabLayout } from '@/components/shared/MobileTabLayout';
import { STORAGE_KEYS } from '@/common/constants';

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

export default function AdvancedMode() {
  const [input, setInput] = useLocalStorage<AdvancedPromptInput>(
    STORAGE_KEYS.ADVANCED_INPUT,
    DEFAULT_ADVANCED_INPUT
  );
  const { result, isAnalyzing } = usePromptEngineAdvanced(input);

  const handleApplyImproved = useCallback(
    (improved: string) => {
      setInput((prev) => ({ ...prev, prompt: improved }));
    },
    [setInput]
  );

  const handleTryExample = useCallback(
    (text: string) => {
      setInput((prev) => ({ ...prev, prompt: text }));
    },
    [setInput]
  );

  const advancedRatingAssembler = useCallback(
    (raw: string) => buildPromptFromAdvanced({ ...input, prompt: raw }),
    [input]
  );

  const appendToPrompt = useCallback(
    (snippet: string) => {
      setInput((prev) => {
        const base = prev.prompt;
        const joiner = base.trim() && !base.endsWith('\n') ? '\n' : '';
        return { ...prev, prompt: `${base}${joiner}${snippet}` };
      });
    },
    [setInput]
  );

  const handleInsertSection = useCallback(
    (key: keyof PromptSectionCoverage) => {
      appendToPrompt(PROMPT_SECTION_SNIPPETS[key]);
    },
    [appendToPrompt]
  );

  const handleInsertFullOutline = useCallback(() => {
    appendToPrompt(PROMPT_FULL_SECTION_OUTLINE);
  }, [appendToPrompt]);

  return (
    <MobileTabLayout
      form={<AdvancedPromptForm input={input} onChange={setInput} />}
      results={
        <AdvancedResults
          result={result}
          rawPrompt={input.prompt}
          onApplyImproved={handleApplyImproved}
          isAnalyzing={isAnalyzing}
          onTryExample={handleTryExample}
          ratingAssembler={advancedRatingAssembler}
          onInsertSection={handleInsertSection}
          onInsertFullOutline={handleInsertFullOutline}
        />
      }
    />
  );
}
