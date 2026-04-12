import { exportAsJson } from '@/lib/exporters/json-exporter';
import { createMockEngineResult } from '../../../mock';

describe('json-exporter', () => {
  describe('exportAsJson', () => {
    const result = createMockEngineResult();

    it('should return valid JSON', () => {
      const json = exportAsJson(result);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include generatedBy field', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.generatedBy).toBe('Garry Clear Prompt');
    });

    it('should include generatedAt timestamp', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.generatedAt).toBeDefined();
      expect(new Date(parsed.generatedAt).getTime()).not.toBeNaN();
    });

    it('should include the prompt', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.prompt).toBe('Create a REST API endpoint for user management.');
    });

    it('should include the meta prompt', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.metaPrompt).toBe('You are an expert backend developer.');
    });

    it('should include rating with score and band', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.rating.totalScore).toBe(72);
      expect(parsed.rating.band).toBe('average');
    });

    it('should include rating dimensions', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.rating.dimensions.clarity.score).toBe(18);
      expect(parsed.rating.dimensions.clarity.max).toBe(25);
    });

    it('should include token estimate', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.tokenEstimate.inputTokens.low).toBe(20);
    });

    it('should include model recommendation', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.modelRecommendation.recommended).toBe('balanced');
    });

    it('should include lint warnings', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.lintWarnings).toHaveLength(1);
      expect(parsed.lintWarnings[0].rule).toBe('no-output-format');
    });

    it('should include suggestions in rating', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.rating.suggestions).toEqual(['Add output format', 'Specify constraints']);
    });

    it('should include section coverage and dimension hints in rating', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.rating.sectionCoverage).toEqual({
        goal: true,
        context: false,
        constraints: false,
        output: false,
      });
      expect(parsed.rating.dimensionHints).toHaveProperty('clarity');
    });

    it('should include nlpSummary', () => {
      const parsed = JSON.parse(exportAsJson(result));
      expect(parsed.nlpSummary).toMatchObject({
        intent: expect.any(String),
        complexity: expect.any(String),
        wordCount: expect.any(Number),
      });
    });
  });
});
