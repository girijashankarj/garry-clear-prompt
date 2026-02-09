import { improvePrompt } from '@/lib/engine/prompt-improver';

describe('prompt-improver', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('improvePrompt', () => {
    it('should return empty result for empty text', () => {
      const result = improvePrompt('');
      expect(result.improved).toBe('');
      expect(result.changes).toEqual([]);
    });

    it('should return empty result for whitespace-only text', () => {
      const result = improvePrompt('   ');
      expect(result.improved).toBe('');
      expect(result.changes).toEqual([]);
    });

    it('should preserve original text in the result', () => {
      const input = 'Create a REST API for user management';
      const result = improvePrompt(input);
      expect(result.original).toBe(input);
    });

    it('should remove filler word "please"', () => {
      const result = improvePrompt('Please create a function');
      expect(result.improved).not.toMatch(/\bplease\b/i);
      expect(result.changes.some(c => c.includes('please'))).toBe(true);
    });

    it('should remove hedge "I think"', () => {
      const result = improvePrompt('I think we should create a function');
      expect(result.improved).not.toMatch(/\bI think\b/i);
      expect(result.changes.some(c => c.includes('I think'))).toBe(true);
    });

    it('should remove padding "I want you to"', () => {
      const result = improvePrompt('I want you to create a function');
      expect(result.improved).not.toMatch(/\bI want you to\b/i);
    });

    it('should remove padding "could you"', () => {
      const result = improvePrompt('Could you create a function');
      expect(result.improved).not.toMatch(/\bcould you\b/i);
    });

    it('should add output format if missing', () => {
      const result = improvePrompt('Create a user authentication system');
      expect(result.changes.some(c => c.includes('output format'))).toBe(true);
    });

    it('should not add output format if already present', () => {
      const result = improvePrompt('Create a user list in table format');
      expect(result.changes.some(c => c.includes('output format'))).toBe(false);
    });

    it('should add length constraint if missing', () => {
      const result = improvePrompt('Create a user authentication system');
      expect(result.changes.some(c => c.includes('length constraint'))).toBe(true);
    });

    it('should not add length constraint if already present', () => {
      const result = improvePrompt('Create a brief summary of the article');
      expect(result.changes.some(c => c.includes('length constraint'))).toBe(false);
    });

    it('should return rating for both original and improved', () => {
      const result = improvePrompt('Please create a function');
      expect(result.originalRating).toBeDefined();
      expect(result.improvedRating).toBeDefined();
      expect(result.originalRating.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.improvedRating.totalScore).toBeGreaterThanOrEqual(0);
    });

    it('should generally improve the score', () => {
      const result = improvePrompt('Please kindly I want you to maybe create a function');
      expect(result.improvedRating.totalScore).toBeGreaterThanOrEqual(result.originalRating.totalScore);
    });

    it('should capitalize the first letter after cleanup', () => {
      const result = improvePrompt('please create a function');
      expect(result.improved[0]).toMatch(/[A-Z]/);
    });
  });
});
