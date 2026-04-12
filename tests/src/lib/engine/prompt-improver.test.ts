import { IMPROVE_CHECKLIST_HEADER } from '@/common/messages/improve-checklists';
import { improvePrompt, refineImprovementWithMl } from '@/lib/engine/prompt-improver';
import { ratePrompt } from '@/lib/engine/prompt-rater';

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
      expect(result.changes.some((c) => c.includes('please'))).toBe(true);
    });

    it('should remove hedge "I think"', () => {
      const result = improvePrompt('I think we should create a function');
      expect(result.improved).not.toMatch(/\bI think\b/i);
      expect(result.changes.some((c) => c.includes('I think'))).toBe(true);
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
      expect(result.changes.some((c) => c.includes('output format'))).toBe(true);
    });

    it('should not add output format if already present', () => {
      const result = improvePrompt('Create a user list in table format');
      expect(result.changes.some((c) => c.includes('output format'))).toBe(false);
    });

    it('should add length constraint if missing', () => {
      const result = improvePrompt('Create a user authentication system');
      expect(result.changes.some((c) => c.includes('length constraint'))).toBe(true);
    });

    it('should not add length constraint if already present', () => {
      const result = improvePrompt('Create a brief summary of the article');
      expect(result.changes.some((c) => c.includes('length constraint'))).toBe(false);
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
      expect(result.improvedRating.totalScore).toBeGreaterThanOrEqual(
        result.originalRating.totalScore
      );
    });

    it('should capitalize the first letter after cleanup', () => {
      const result = improvePrompt('please create a function');
      expect(result.improved[0]).toMatch(/[A-Z]/);
    });

    it('should use ratingAssembler for scores when provided', () => {
      const assembler = (raw: string) => `PREAMBLE\n\n${raw}`;
      const raw = 'List three benefits.';
      const result = improvePrompt(raw, { ratingAssembler: assembler });
      const expected = ratePrompt(assembler(raw), { suggestionSource: raw.trim() });
      expect(result.originalRating.totalScore).toBe(expected.totalScore);
      expect(result.improvedRating.totalScore).toBeGreaterThanOrEqual(0);
    });

    it('should append SQL checklist when database and table appear', () => {
      const result = improvePrompt(
        'Get first 5 last names from user management table in yolo database'
      );
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('SQL dialect');
      expect(result.changes.some((c) => c.includes('SQL checklist'))).toBe(true);
    });

    it('should append code checklist for implementation prompts', () => {
      const result = improvePrompt('Implement a Python script that parses CSV files');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('language, runtime');
      expect(result.changes.some((c) => c.includes('code checklist'))).toBe(true);
    });

    it('should append analysis checklist for comparison prompts', () => {
      const result = improvePrompt('Compare microservices vs monolith for a small team');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('criteria');
      expect(result.changes.some((c) => c.includes('analysis checklist'))).toBe(true);
    });

    it('should append writing checklist for email drafts', () => {
      const result = improvePrompt('Write a short email announcing the product launch');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('Audience');
      expect(result.changes.some((c) => c.includes('writing checklist'))).toBe(true);
    });

    it('should not append domain checklist when no intent matches', () => {
      const result = improvePrompt('Summarize the quarterly results');
      expect(result.improved).not.toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.changes.some((c) => c.includes('checklist'))).toBe(false);
    });

    it('should append ops checklist for kubernetes prompts', () => {
      const result = improvePrompt('Please scale our docker deployment on kubernetes');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('environment');
      expect(result.changes.some((c) => c.includes('DevOps'))).toBe(true);
    });

    it('should append product checklist for PRD-style prompts', () => {
      const result = improvePrompt('Write acceptance criteria for the login MVP');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('persona');
      expect(result.changes.some((c) => c.includes('product'))).toBe(true);
    });

    it('should append research checklist when sources are requested', () => {
      const result = improvePrompt('Explain quantum error correction with citations from papers');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('depth');
      expect(result.changes.some((c) => c.includes('research checklist'))).toBe(true);
    });

    it('should append legal checklist for compliance-style prompts', () => {
      const result = improvePrompt('Review this NDA for liability clauses');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('jurisdiction');
      expect(result.changes.some((c) => c.includes('legal'))).toBe(true);
    });

    it('should append education checklist for lesson-style prompts', () => {
      const result = improvePrompt('Create a homework worksheet on photosynthesis');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('Learner level');
      expect(result.changes.some((c) => c.includes('teaching'))).toBe(true);
    });

    it('should append dataviz checklist for chart prompts', () => {
      const result = improvePrompt('Design a dashboard chart for monthly churn');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('Accessibility');
      expect(result.changes.some((c) => c.includes('visualization'))).toBe(true);
    });

    it('should append creative checklist for fiction prompts', () => {
      const result = improvePrompt('Brainstorm names for a fantasy novel');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('Genre');
      expect(result.changes.some((c) => c.includes('creative'))).toBe(true);
    });

    it('should append translation checklist when translating', () => {
      const result = improvePrompt('Translate this paragraph into Spanish for a brochure');
      expect(result.improved).toContain(IMPROVE_CHECKLIST_HEADER);
      expect(result.improved).toContain('Source and target');
      expect(result.changes.some((c) => c.includes('translation checklist'))).toBe(true);
    });

    it('should skip ML refinement when VITE_ML_INTENT_ENABLED is not true', async () => {
      const base = improvePrompt('Get first 5 rows from my database table');
      const out = await refineImprovementWithMl(base, base.original, {});
      expect(out.status).toBe('skipped_feature_off');
      expect(out.improvement).toBe(base);
    });
  });
});
