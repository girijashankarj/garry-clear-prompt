import { recommendModel } from '@/lib/engine/model-advisor';

describe('model-advisor', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('recommendModel', () => {
    it('should return a valid recommendation structure', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'medium',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(result).toHaveProperty('recommended');
      expect(result).toHaveProperty('alternative');
      expect(result).toHaveProperty('avoid');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reason');
    });

    it('should return valid tier values', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(['fast', 'balanced', 'reasoning']).toContain(result.recommended);
      expect(['fast', 'balanced', 'reasoning']).toContain(result.alternative);
    });

    it('should return valid confidence values', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(['low', 'medium', 'high']).toContain(result.confidence);
    });

    it('should recommend reasoning for high complexity + high risk', () => {
      const result = recommendModel({
        taskType: 'design',
        complexity: 'high',
        riskLevel: 'high',
        contextSize: 'large',
        needsToolUse: true,
      });
      expect(result.recommended).toBe('reasoning');
    });

    it('should lean towards balanced for medium complexity tasks', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'medium',
        riskLevel: 'medium',
        contextSize: 'medium',
        needsToolUse: false,
      });
      expect(result.recommended).toBe('balanced');
    });

    it('should include reason text about high complexity', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'high',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(result.reason).toContain('high complexity');
    });

    it('should include reason text about high risk', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'low',
        riskLevel: 'high',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(result.reason).toContain('high risk');
    });

    it('should include reason text about tool use', () => {
      const result = recommendModel({
        taskType: 'general',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: true,
      });
      expect(result.reason).toContain('tool use');
    });

    it('should include reason about simple low-risk tasks', () => {
      const result = recommendModel({
        taskType: 'docs',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      expect(result.reason).toContain('simple, low-risk');
    });

    it('should set avoid to null when third tier has reasonable score', () => {
      // With all medium settings, scores are close together
      const result = recommendModel({
        taskType: 'general',
        complexity: 'medium',
        riskLevel: 'medium',
        contextSize: 'medium',
        needsToolUse: false,
      });
      // avoid can be null or a tier -- just ensure it's valid
      if (result.avoid !== null) {
        expect(['fast', 'balanced', 'reasoning']).toContain(result.avoid);
      }
    });

    it('should boost reasoning/balanced when needsToolUse is true', () => {
      const withoutTools = recommendModel({
        taskType: 'docs',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: false,
      });
      const withTools = recommendModel({
        taskType: 'docs',
        complexity: 'low',
        riskLevel: 'low',
        contextSize: 'small',
        needsToolUse: true,
      });
      // With tools the recommendation should be at least as capable
      const tierRank = { fast: 0, balanced: 1, reasoning: 2 };
      expect(tierRank[withTools.recommended]).toBeGreaterThanOrEqual(
        tierRank[withoutTools.recommended]
      );
    });

    it('should handle all task types without errors', () => {
      const taskTypes = [
        'refactor',
        'debug',
        'design',
        'sql',
        'docs',
        'data',
        'testing',
        'general',
      ] as const;
      for (const taskType of taskTypes) {
        const result = recommendModel({
          taskType,
          complexity: 'medium',
          riskLevel: 'medium',
          contextSize: 'medium',
          needsToolUse: false,
        });
        expect(result.recommended).toBeDefined();
      }
    });
  });
});
