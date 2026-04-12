import { analyzePromptNlp } from '@/lib/engine/nlp-analyzer';

describe('nlp-analyzer', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('analyzePromptNlp', () => {
    it('should return default values for empty text', () => {
      const result = analyzePromptNlp('');
      expect(result.intent).toBe('unknown');
      expect(result.complexity).toBe('simple');
      expect(result.wordCount).toBe(0);
      expect(result.sentenceCount).toBe(0);
      expect(result.topNouns).toEqual([]);
      expect(result.topVerbs).toEqual([]);
    });

    it('should return default values for whitespace-only text', () => {
      const result = analyzePromptNlp('   ');
      expect(result.intent).toBe('unknown');
      expect(result.complexity).toBe('simple');
    });

    it('should detect question intent', () => {
      const result = analyzePromptNlp('What is TypeScript? How does it work?');
      expect(result.intent).toBe('question');
      expect(result.questionCount).toBe(2);
    });

    it('should detect instruction intent for imperative prompts', () => {
      const result = analyzePromptNlp('Create a React component that displays user data');
      expect(result.intent).toBe('instruction');
    });

    it('should detect comparison intent', () => {
      const result = analyzePromptNlp('Compare React versus Angular in terms of performance');
      expect(result.intent).toBe('comparison');
    });

    it('should detect description intent', () => {
      const result = analyzePromptNlp('This is an overview about machine learning');
      expect(result.intent).toBe('description');
    });

    it('should count words correctly', () => {
      const result = analyzePromptNlp('one two three four five');
      expect(result.wordCount).toBe(5);
    });

    it('should detect lists', () => {
      const result = analyzePromptNlp('Follow these steps:\n- Step one\n- Step two\n- Step three');
      expect(result.hasList).toBe(true);
    });

    it('should detect numbered lists', () => {
      const result = analyzePromptNlp('Instructions:\n1. First thing\n2. Second thing');
      expect(result.hasList).toBe(true);
    });

    it('should not detect lists in plain text', () => {
      const result = analyzePromptNlp('Create a simple function');
      expect(result.hasList).toBe(false);
    });

    it('should detect conditional language', () => {
      const result = analyzePromptNlp(
        'If the user is logged in, show the dashboard. Unless they are admin, hide settings.'
      );
      expect(result.hasConditional).toBe(true);
    });

    it('should detect negation', () => {
      const result = analyzePromptNlp('Do not include any external dependencies. Never use eval.');
      expect(result.hasNegation).toBe(true);
    });

    it('should compute readability grade', () => {
      const result = analyzePromptNlp(
        'Create a function that calculates the sum of all numbers in an array.'
      );
      expect(result.readabilityGrade).toBeGreaterThanOrEqual(0);
    });

    it('should classify simple complexity for short prompts', () => {
      const result = analyzePromptNlp('Create a button');
      expect(result.complexity).toBe('simple');
    });

    it('should classify moderate or complex for long prompts', () => {
      const result = analyzePromptNlp(
        'Design a comprehensive microservices architecture for an e-commerce platform. ' +
          'Include service boundaries and data flow. If the system is under heavy load, ' +
          'implement circuit breakers. Consider the following:\n- API gateway\n- Auth service\n' +
          '- Product catalog\n- Order management\n- Payment processing. ' +
          'What about scaling? How should we handle failures?'
      );
      expect(['moderate', 'complex']).toContain(result.complexity);
    });

    it('should return top nouns and verbs as arrays', () => {
      const result = analyzePromptNlp(
        'Create a user management system with authentication and authorization.'
      );
      expect(Array.isArray(result.topNouns)).toBe(true);
      expect(Array.isArray(result.topVerbs)).toBe(true);
    });

    it('should limit topNouns and topVerbs to 5', () => {
      const result = analyzePromptNlp(
        'The developer built the server, database, API, router, controller, middleware, service, and model.'
      );
      expect(result.topNouns.length).toBeLessThanOrEqual(5);
      expect(result.topVerbs.length).toBeLessThanOrEqual(5);
    });

    it('should have all required fields in the result', () => {
      const result = analyzePromptNlp('Create a REST API');
      expect(result).toHaveProperty('intent');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('sentenceCount');
      expect(result).toHaveProperty('wordCount');
      expect(result).toHaveProperty('avgWordsPerSentence');
      expect(result).toHaveProperty('questionCount');
      expect(result).toHaveProperty('verbCount');
      expect(result).toHaveProperty('nounCount');
      expect(result).toHaveProperty('adjectiveCount');
      expect(result).toHaveProperty('topNouns');
      expect(result).toHaveProperty('topVerbs');
      expect(result).toHaveProperty('hasList');
      expect(result).toHaveProperty('hasConditional');
      expect(result).toHaveProperty('hasNegation');
      expect(result).toHaveProperty('readabilityGrade');
    });
  });
});
