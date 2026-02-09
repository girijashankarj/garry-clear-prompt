import { lintPrompt } from '@/lib/engine/prompt-linter';

describe('prompt-linter', () => {
  describe('lintPrompt', () => {
    it('should return empty array for empty text', () => {
      const result = lintPrompt('');
      expect(result).toEqual([]);
    });

    it('should return empty array for whitespace-only text', () => {
      const result = lintPrompt('   ');
      expect(result).toEqual([]);
    });

    it('should return an array of warnings', () => {
      const result = lintPrompt('Please help me with something about stuff');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should sort warnings by severity (errors first)', () => {
      const result = lintPrompt('Please kindly do everything about all the things and stuff');
      if (result.length >= 2) {
        const severityOrder = { error: 0, warning: 1, info: 2 };
        for (let i = 1; i < result.length; i++) {
          expect(severityOrder[result[i].severity]).toBeGreaterThanOrEqual(
            severityOrder[result[i - 1].severity]
          );
        }
      }
    });

    it('should have proper structure for each warning', () => {
      const result = lintPrompt('Please do everything about stuff and things');
      for (const warning of result) {
        expect(warning).toHaveProperty('rule');
        expect(warning).toHaveProperty('severity');
        expect(warning).toHaveProperty('message');
        expect(warning).toHaveProperty('suggestion');
        expect(['error', 'warning', 'info']).toContain(warning.severity);
      }
    });
  });
});
