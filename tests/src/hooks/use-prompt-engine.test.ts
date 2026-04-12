import { renderHook } from '@testing-library/react';
import { usePromptEngineBasic, usePromptEngineAdvanced } from '@/hooks/use-prompt-engine';
import { createMockBasicInput, createMockAdvancedInput } from '../../mock';

describe('usePromptEngine', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('usePromptEngineBasic', () => {
    it('should return a valid PromptEngineResult', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      const engine = result.current.result;
      expect(engine).toHaveProperty('structuredPrompt');
      expect(engine).toHaveProperty('metaPrompt');
      expect(engine).toHaveProperty('rating');
      expect(engine).toHaveProperty('tokenEstimate');
      expect(engine).toHaveProperty('modelRecommendation');
      expect(engine).toHaveProperty('mcpSuggestions');
      expect(engine).toHaveProperty('lintWarnings');
      expect(engine).toHaveProperty('nlpAnalysis');
      expect(result.current).toHaveProperty('isAnalyzing');
    });

    it('should generate a structured prompt from goal', () => {
      const input = createMockBasicInput({ goal: 'Explain TypeScript generics' });
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.result.structuredPrompt).toContain('Explain TypeScript generics');
    });

    it('should generate a meta prompt', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.result.metaPrompt).toContain('helpful assistant');
    });

    it('should compute a rating with valid band', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(['excellent', 'good', 'average', 'weak', 'poor']).toContain(
        result.current.result.rating.band
      );
    });

    it('should compute token estimates', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.result.tokenEstimate.totalTokens.low).toBeGreaterThan(0);
    });

    it('should handle empty goal gracefully', () => {
      const input = createMockBasicInput({ goal: '' });
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.result.rating.totalScore).toBe(0);
    });
  });

  describe('usePromptEngineAdvanced', () => {
    it('should return a valid PromptEngineResult', () => {
      const input = createMockAdvancedInput();
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      const engine = result.current.result;
      expect(engine).toHaveProperty('structuredPrompt');
      expect(engine).toHaveProperty('metaPrompt');
      expect(engine).toHaveProperty('rating');
      expect(engine).toHaveProperty('tokenEstimate');
      expect(engine).toHaveProperty('modelRecommendation');
      expect(engine).toHaveProperty('mcpSuggestions');
      expect(engine).toHaveProperty('lintWarnings');
      expect(engine).toHaveProperty('nlpAnalysis');
    });

    it('should generate structured prompt from advanced input', () => {
      const input = createMockAdvancedInput({ prompt: 'Build a GraphQL API' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.result.structuredPrompt).toContain('Build a GraphQL API');
    });

    it('should use custom meta prompt when provided', () => {
      const input = createMockAdvancedInput({ metaPrompt: 'You are a code review expert' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.result.metaPrompt).toBe('You are a code review expert');
    });

    it('should handle empty prompt gracefully', () => {
      const input = createMockAdvancedInput({ prompt: '' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.result.structuredPrompt).toBe('');
    });

    it('should generate model recommendation', () => {
      const input = createMockAdvancedInput({ complexity: 'high', riskLevel: 'high' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.result.modelRecommendation.recommended).toBe('reasoning');
    });
  });
});
