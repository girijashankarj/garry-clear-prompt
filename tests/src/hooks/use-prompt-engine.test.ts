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
      expect(result.current).toHaveProperty('structuredPrompt');
      expect(result.current).toHaveProperty('metaPrompt');
      expect(result.current).toHaveProperty('rating');
      expect(result.current).toHaveProperty('tokenEstimate');
      expect(result.current).toHaveProperty('modelRecommendation');
      expect(result.current).toHaveProperty('mcpSuggestions');
      expect(result.current).toHaveProperty('lintWarnings');
    });

    it('should generate a structured prompt from goal', () => {
      const input = createMockBasicInput({ goal: 'Explain TypeScript generics' });
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.structuredPrompt).toContain('Explain TypeScript generics');
    });

    it('should generate a meta prompt', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.metaPrompt).toContain('helpful assistant');
    });

    it('should compute a rating with valid band', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(['excellent', 'good', 'average', 'weak', 'poor']).toContain(result.current.rating.band);
    });

    it('should compute token estimates', () => {
      const input = createMockBasicInput();
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.tokenEstimate.totalTokens.low).toBeGreaterThan(0);
    });

    it('should handle empty goal gracefully', () => {
      const input = createMockBasicInput({ goal: '' });
      const { result } = renderHook(() => usePromptEngineBasic(input));
      expect(result.current.rating.totalScore).toBe(0);
    });
  });

  describe('usePromptEngineAdvanced', () => {
    it('should return a valid PromptEngineResult', () => {
      const input = createMockAdvancedInput();
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current).toHaveProperty('structuredPrompt');
      expect(result.current).toHaveProperty('metaPrompt');
      expect(result.current).toHaveProperty('rating');
      expect(result.current).toHaveProperty('tokenEstimate');
      expect(result.current).toHaveProperty('modelRecommendation');
      expect(result.current).toHaveProperty('mcpSuggestions');
      expect(result.current).toHaveProperty('lintWarnings');
    });

    it('should generate structured prompt from advanced input', () => {
      const input = createMockAdvancedInput({ prompt: 'Build a GraphQL API' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.structuredPrompt).toContain('Build a GraphQL API');
    });

    it('should use custom meta prompt when provided', () => {
      const input = createMockAdvancedInput({ metaPrompt: 'You are a code review expert' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.metaPrompt).toBe('You are a code review expert');
    });

    it('should handle empty prompt gracefully', () => {
      const input = createMockAdvancedInput({ prompt: '' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.structuredPrompt).toBe('');
    });

    it('should generate model recommendation', () => {
      const input = createMockAdvancedInput({ complexity: 'high', riskLevel: 'high' });
      const { result } = renderHook(() => usePromptEngineAdvanced(input));
      expect(result.current.modelRecommendation.recommended).toBe('reasoning');
    });
  });
});
