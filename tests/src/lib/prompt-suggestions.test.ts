import { findSimilarPrompts } from '@/lib/prompt-suggestions';
import * as versioning from '@/lib/versioning';

// Mock the versioning module
jest.mock('@/lib/versioning');

const mockGetPromptVersions = versioning.getPromptVersions as jest.MockedFunction<typeof versioning.getPromptVersions>;

describe('prompt-suggestions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findSimilarPrompts', () => {
    it('should return empty array for empty text', () => {
      expect(findSimilarPrompts('')).toEqual([]);
    });

    it('should return empty array for whitespace-only text', () => {
      expect(findSimilarPrompts('   ')).toEqual([]);
    });

    it('should return empty array when no versions exist', () => {
      mockGetPromptVersions.mockReturnValue([]);
      expect(findSimilarPrompts('create a REST API')).toEqual([]);
    });

    it('should find similar prompts based on keyword matching', () => {
      mockGetPromptVersions.mockReturnValue([
        {
          id: '1',
          version: 1,
          label: 'v1',
          prompt: 'Create a REST API for user authentication with JWT tokens',
          metaPrompt: '',
          score: 80,
          timestamp: Date.now(),
          mode: 'basic',
        },
        {
          id: '2',
          version: 2,
          label: 'v2',
          prompt: 'Design a mobile app interface with React Native',
          metaPrompt: '',
          score: 75,
          timestamp: Date.now(),
          mode: 'basic',
        },
      ]);

      const results = findSimilarPrompts('Create a REST API for user management');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchedKeywords.length).toBeGreaterThan(0);
    });

    it('should not suggest the exact same text', () => {
      const text = 'Create a REST API for user management';
      mockGetPromptVersions.mockReturnValue([
        {
          id: '1',
          version: 1,
          label: 'v1',
          prompt: text,
          metaPrompt: '',
          score: 80,
          timestamp: Date.now(),
          mode: 'basic',
        },
      ]);

      const results = findSimilarPrompts(text);
      expect(results.length).toBe(0);
    });

    it('should sort results by similarity descending', () => {
      mockGetPromptVersions.mockReturnValue([
        {
          id: '1',
          version: 1,
          label: 'v1',
          prompt: 'Create REST API authentication JWT tokens validation',
          metaPrompt: '',
          score: 80,
          timestamp: Date.now(),
          mode: 'basic',
        },
        {
          id: '2',
          version: 2,
          label: 'v2',
          prompt: 'Create REST API endpoints for complete user management',
          metaPrompt: '',
          score: 75,
          timestamp: Date.now(),
          mode: 'basic',
        },
      ]);

      const results = findSimilarPrompts('Create REST API user management');
      if (results.length >= 2) {
        expect(results[0].similarity).toBeGreaterThanOrEqual(results[1].similarity);
      }
    });

    it('should limit results to maxResults', () => {
      mockGetPromptVersions.mockReturnValue(
        Array.from({ length: 20 }, (_, i) => ({
          id: `${i}`,
          version: i + 1,
          label: `v${i + 1}`,
          prompt: `Create a REST API for feature ${i} with authentication`,
          metaPrompt: '',
          score: 70 + i,
          timestamp: Date.now(),
          mode: 'basic' as const,
        }))
      );

      const results = findSimilarPrompts('Create REST API authentication', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should filter by mode when specified', () => {
      mockGetPromptVersions.mockReturnValue([
        {
          id: '1',
          version: 1,
          label: 'v1',
          prompt: 'Create a REST API for user management',
          metaPrompt: '',
          score: 80,
          timestamp: Date.now(),
          mode: 'basic',
        },
      ]);

      findSimilarPrompts('Create REST API', 5, 'advanced');
      expect(mockGetPromptVersions).toHaveBeenCalledWith('advanced');
    });

    it('should include similarity score between 0 and 1', () => {
      mockGetPromptVersions.mockReturnValue([
        {
          id: '1',
          version: 1,
          label: 'v1',
          prompt: 'Create REST API user authentication tokens',
          metaPrompt: '',
          score: 80,
          timestamp: Date.now(),
          mode: 'basic',
        },
      ]);

      const results = findSimilarPrompts('Create REST API user management');
      for (const r of results) {
        expect(r.similarity).toBeGreaterThan(0);
        expect(r.similarity).toBeLessThanOrEqual(1);
      }
    });
  });
});
