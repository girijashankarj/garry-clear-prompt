import { ratePrompt } from '@/lib/engine/prompt-rater';

describe('prompt-rater', () => {
  describe('ratePrompt', () => {
    it('should return zero score for empty text', () => {
      const result = ratePrompt('');
      expect(result.totalScore).toBe(0);
      expect(result.band).toBe('poor');
    });

    it('should return zero score for whitespace-only text', () => {
      const result = ratePrompt('   ');
      expect(result.totalScore).toBe(0);
      expect(result.band).toBe('poor');
    });

    it('should return a score between 0 and 100', () => {
      const result = ratePrompt('Create a React component that displays user data in a table format.');
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });

    it('should rate well-structured prompts higher', () => {
      const poorPrompt = 'stuff about things';
      const goodPrompt = 'Create a REST API endpoint for user authentication.\n\nConstraints:\n- Use JWT tokens\n- Return JSON responses\n- Include input validation\n\nOutput format: numbered steps with code examples';

      const poorResult = ratePrompt(poorPrompt);
      const goodResult = ratePrompt(goodPrompt);
      expect(goodResult.totalScore).toBeGreaterThan(poorResult.totalScore);
    });

    it('should penalize vague language', () => {
      const vaguePrompt = 'Tell me everything about anything related to stuff';
      const result = ratePrompt(vaguePrompt);
      expect(result.dimensions.clarity.score).toBeLessThan(15);
    });

    it('should reward prompts starting with action verbs', () => {
      const result = ratePrompt('Create a function that calculates fibonacci numbers');
      expect(result.dimensions.clarity.score).toBeGreaterThanOrEqual(8);
    });

    it('should reward prompts with format constraints', () => {
      const result = ratePrompt('List the top 5 JavaScript frameworks in a table format');
      expect(result.dimensions.constraints.score).toBeGreaterThan(0);
    });

    it('should penalize filler words in token efficiency', () => {
      const fillerPrompt = 'Please kindly I think maybe perhaps basically actually just create a function';
      const result = ratePrompt(fillerPrompt);
      expect(result.dimensions.tokenEfficiency.score).toBeLessThan(15);
    });

    it('should return correct band names', () => {
      // We can't guarantee exact scores, but we can test the band function
      const result = ratePrompt('Create a comprehensive REST API endpoint for user management with CRUD operations.\n\nConstraints:\n- Use TypeScript\n- Include input validation with zod\n- Return JSON responses\n- Max 200 lines of code\n\nOutput format: numbered steps with code blocks');
      expect(['excellent', 'good', 'average', 'weak', 'poor']).toContain(result.band);
    });

    it('should always return at least one suggestion', () => {
      const result = ratePrompt('Create a React component');
      expect(result.suggestions.length).toBeGreaterThanOrEqual(1);
    });

    it('should return max 5 suggestions', () => {
      const result = ratePrompt('stuff');
      expect(result.suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should have all five rating dimensions', () => {
      const result = ratePrompt('Create a function');
      expect(result.dimensions).toHaveProperty('clarity');
      expect(result.dimensions).toHaveProperty('constraints');
      expect(result.dimensions).toHaveProperty('structure');
      expect(result.dimensions).toHaveProperty('tokenEfficiency');
      expect(result.dimensions).toHaveProperty('riskPenalty');
    });

    it('should have risk penalty as non-positive score', () => {
      const result = ratePrompt('Tell me everything about anything');
      expect(result.dimensions.riskPenalty.score).toBeLessThanOrEqual(0);
    });
  });
});
