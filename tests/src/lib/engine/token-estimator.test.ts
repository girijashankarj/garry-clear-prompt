import { estimateInputTokens, estimateOutputTokens, estimateTokens } from '@/lib/engine/token-estimator';

describe('token-estimator', () => {
  describe('estimateInputTokens', () => {
    it('should return zero for empty text', () => {
      const result = estimateInputTokens('');
      expect(result.low).toBe(0);
      expect(result.high).toBe(0);
    });

    it('should return zero for whitespace-only text', () => {
      const result = estimateInputTokens('   ');
      expect(result.low).toBe(0);
      expect(result.high).toBe(0);
    });

    it('should return low <= high', () => {
      const result = estimateInputTokens('Create a React component for user management');
      expect(result.low).toBeLessThanOrEqual(result.high);
    });

    it('should increase with longer text', () => {
      const short = estimateInputTokens('Hello');
      const long = estimateInputTokens('Create a comprehensive REST API with authentication, authorization, rate limiting, and input validation');
      expect(long.low).toBeGreaterThan(short.low);
      expect(long.high).toBeGreaterThan(short.high);
    });

    it('should return positive values for non-empty text', () => {
      const result = estimateInputTokens('Hello world');
      expect(result.low).toBeGreaterThan(0);
      expect(result.high).toBeGreaterThan(0);
    });
  });

  describe('estimateOutputTokens', () => {
    it('should return low <= high', () => {
      const result = estimateOutputTokens('m', {
        strictJson: false,
        includeCode: false,
        includeTables: false,
        includeDiagrams: false,
        includeExamples: false,
      });
      expect(result.low).toBeLessThanOrEqual(result.high);
    });

    it('should increase with format multipliers', () => {
      const base = estimateOutputTokens('m', {
        strictJson: false,
        includeCode: false,
        includeTables: false,
        includeDiagrams: false,
        includeExamples: false,
      });
      const withCode = estimateOutputTokens('m', {
        strictJson: false,
        includeCode: true,
        includeTables: false,
        includeDiagrams: false,
        includeExamples: false,
      });
      expect(withCode.high).toBeGreaterThanOrEqual(base.high);
    });

    it('should increase with larger output size', () => {
      const small = estimateOutputTokens('xs', {
        strictJson: false,
        includeCode: false,
        includeTables: false,
        includeDiagrams: false,
        includeExamples: false,
      });
      const large = estimateOutputTokens('xl', {
        strictJson: false,
        includeCode: false,
        includeTables: false,
        includeDiagrams: false,
        includeExamples: false,
      });
      expect(large.high).toBeGreaterThan(small.high);
    });
  });

  describe('estimateTokens', () => {
    it('should return combined input and output tokens', () => {
      const result = estimateTokens('Create a React component', 'm');
      expect(result.totalTokens.low).toBe(result.inputTokens.low + result.outputTokens.low);
      expect(result.totalTokens.high).toBe(result.inputTokens.high + result.outputTokens.high);
    });

    it('should use default output size and format when not specified', () => {
      const result = estimateTokens('Hello world');
      expect(result.inputTokens.low).toBeGreaterThan(0);
      expect(result.outputTokens.low).toBeGreaterThan(0);
    });
  });
});
