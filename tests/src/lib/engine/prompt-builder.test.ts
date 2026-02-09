import { buildPromptFromBasic, buildPromptFromAdvanced, buildMetaPrompt } from '@/lib/engine/prompt-builder';
import { createMockBasicInput, createMockAdvancedInput } from '../../../mock';

describe('prompt-builder', () => {
  describe('buildPromptFromBasic', () => {
    it('should include the goal in the output', () => {
      const input = createMockBasicInput({ goal: 'Explain TypeScript generics' });
      const result = buildPromptFromBasic(input);
      expect(result).toContain('Explain TypeScript generics');
    });

    it('should include detail level modifier', () => {
      const input = createMockBasicInput({ detailLevel: 'short' });
      const result = buildPromptFromBasic(input);
      expect(result).toContain('brief and concise');
    });

    it('should include style tone modifier', () => {
      const input = createMockBasicInput({ styleTone: 'professional' });
      const result = buildPromptFromBasic(input);
      expect(result).toContain('professional and formal');
    });

    it('should include response format modifier', () => {
      const input = createMockBasicInput({ responseFormat: 'steps' });
      const result = buildPromptFromBasic(input);
      expect(result).toContain('numbered steps');
    });

    it('should include rules when provided', () => {
      const input = createMockBasicInput({ rules: 'No code examples' });
      const result = buildPromptFromBasic(input);
      expect(result).toContain('No code examples');
    });

    it('should not include rules section when rules is empty', () => {
      const input = createMockBasicInput({ rules: '' });
      const result = buildPromptFromBasic(input);
      expect(result).not.toContain('Rules to follow');
    });

    it('should separate sections with double newlines', () => {
      const input = createMockBasicInput();
      const result = buildPromptFromBasic(input);
      expect(result).toContain('\n\n');
    });
  });

  describe('buildPromptFromAdvanced', () => {
    it('should include the main prompt text', () => {
      const input = createMockAdvancedInput({ prompt: 'Build a REST API' });
      const result = buildPromptFromAdvanced(input);
      expect(result).toContain('Build a REST API');
    });

    it('should include plan-first instruction when enabled', () => {
      const input = createMockAdvancedInput({ planFirst: true });
      const result = buildPromptFromAdvanced(input);
      expect(result).toContain('Think step-by-step');
    });

    it('should not include plan-first instruction when disabled', () => {
      const input = createMockAdvancedInput({ planFirst: false });
      const result = buildPromptFromAdvanced(input);
      expect(result).not.toContain('Think step-by-step');
    });

    it('should include output format instructions when flags are set', () => {
      const input = createMockAdvancedInput({
        outputFormat: {
          strictJson: true,
          includeCode: true,
          includeTables: false,
          includeDiagrams: false,
          includeExamples: false,
        },
      });
      const result = buildPromptFromAdvanced(input);
      expect(result).toContain('strict, valid JSON');
      expect(result).toContain('code examples');
    });

    it('should include audience when specified', () => {
      const input = createMockAdvancedInput({ audience: 'junior developers' });
      const result = buildPromptFromAdvanced(input);
      expect(result).toContain('junior developers');
    });

    it('should return empty string for empty prompt', () => {
      const input = createMockAdvancedInput({ prompt: '  ' });
      const result = buildPromptFromAdvanced(input);
      expect(result).toBe('');
    });
  });

  describe('buildMetaPrompt', () => {
    it('should return custom meta prompt when provided', () => {
      const input = createMockAdvancedInput({ metaPrompt: 'You are a helpful assistant' });
      const result = buildMetaPrompt(input);
      expect(result).toBe('You are a helpful assistant');
    });

    it('should auto-generate meta prompt when not provided', () => {
      const input = createMockAdvancedInput({ metaPrompt: '', taskType: 'debug' });
      const result = buildMetaPrompt(input);
      expect(result).toContain('debug');
      expect(result).toContain('expert assistant');
    });

    it('should include complexity in auto-generated meta prompt', () => {
      const input = createMockAdvancedInput({ metaPrompt: '', complexity: 'high' });
      const result = buildMetaPrompt(input);
      expect(result).toContain('complex');
    });

    it('should include risk level in auto-generated meta prompt', () => {
      const input = createMockAdvancedInput({ metaPrompt: '', riskLevel: 'high' });
      const result = buildMetaPrompt(input);
      expect(result).toContain('high-stakes');
    });
  });
});
