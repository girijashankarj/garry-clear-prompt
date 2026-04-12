import { buildMetaPromptFromBasic } from '@/lib/engine/meta-prompt-builder';
import { createMockBasicInput } from '../../../mock';

describe('meta-prompt-builder', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('buildMetaPromptFromBasic', () => {
    it('should always include the assistant role', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput());
      expect(result).toContain('helpful assistant');
    });

    it('should include simple tone instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ styleTone: 'simple' }));
      expect(result).toContain('simple, clear language');
    });

    it('should include professional tone instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ styleTone: 'professional' }));
      expect(result).toContain('professional, formal tone');
    });

    it('should include friendly tone instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ styleTone: 'friendly' }));
      expect(result).toContain('conversational and approachable');
    });

    it('should include short detail instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ detailLevel: 'short' }));
      expect(result).toContain('brief and to the point');
    });

    it('should include medium detail instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ detailLevel: 'medium' }));
      expect(result).toContain('moderate detail');
    });

    it('should include detailed detail instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ detailLevel: 'detailed' }));
      expect(result).toContain('thorough and comprehensive');
    });

    it('should include steps format instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ responseFormat: 'steps' }));
      expect(result).toContain('numbered steps');
    });

    it('should include explanation format instruction', () => {
      const result = buildMetaPromptFromBasic(
        createMockBasicInput({ responseFormat: 'explanation' })
      );
      expect(result).toContain('flowing explanations');
    });

    it('should include both format instruction', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ responseFormat: 'both' }));
      expect(result).toContain('step-by-step instructions');
    });

    it('should include rules when provided', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ rules: 'No code examples' }));
      expect(result).toContain('No code examples');
      expect(result).toContain('Additional rules');
    });

    it('should not include rules section when rules is empty', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ rules: '' }));
      expect(result).not.toContain('Additional rules');
    });

    it('should not include rules section when rules is whitespace', () => {
      const result = buildMetaPromptFromBasic(createMockBasicInput({ rules: '   ' }));
      expect(result).not.toContain('Additional rules');
    });
  });
});
