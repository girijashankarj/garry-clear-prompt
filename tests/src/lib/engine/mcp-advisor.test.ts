import { suggestMcpTools, shouldUseMcp } from '@/lib/engine/mcp-advisor';

describe('mcp-advisor', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('suggestMcpTools', () => {
    it('should return empty array for empty text', () => {
      expect(suggestMcpTools('')).toEqual([]);
    });

    it('should return empty array for whitespace-only text', () => {
      expect(suggestMcpTools('   ')).toEqual([]);
    });

    it('should suggest Postgres for database-related prompts', () => {
      const result = suggestMcpTools('Query the database to find all users');
      const names = result.map(s => s.name);
      expect(names).toContain('Postgres');
    });

    it('should suggest Playwright for browser/UI test prompts', () => {
      const result = suggestMcpTools('Write an e2e browser test for the login page');
      const names = result.map(s => s.name);
      expect(names).toContain('Playwright');
    });

    it('should suggest Figma for design-related prompts', () => {
      const result = suggestMcpTools('Extract design tokens from the Figma component library');
      const names = result.map(s => s.name);
      expect(names).toContain('Figma');
    });

    it('should suggest GitHub for repo-related prompts', () => {
      const result = suggestMcpTools('Review the pull request and check the git branch');
      const names = result.map(s => s.name);
      expect(names).toContain('GitHub');
    });

    it('should suggest Filesystem for file operations', () => {
      const result = suggestMcpTools('Read the config file from the project directory');
      const names = result.map(s => s.name);
      expect(names).toContain('Filesystem');
    });

    it('should return no suggestions for generic reasoning prompts', () => {
      const result = suggestMcpTools('Explain the concept of recursion');
      expect(result.length).toBe(0);
    });

    it('should mark tools with 2+ keyword matches as recommended', () => {
      const result = suggestMcpTools('Run a SQL query on the postgres database to get user table schema');
      const postgres = result.find(s => s.name === 'Postgres');
      expect(postgres?.recommended).toBe(true);
    });

    it('should sort recommended tools first', () => {
      const result = suggestMcpTools('Query the postgres database and test the browser UI');
      if (result.length >= 2) {
        const firstRecommended = result[0].recommended;
        const lastRecommended = result[result.length - 1].recommended;
        // If any are recommended, they should come first
        if (result.some(s => s.recommended) && result.some(s => !s.recommended)) {
          expect(firstRecommended).toBe(true);
          expect(lastRecommended).toBe(false);
        }
      }
    });

    it('should include proper fields on each suggestion', () => {
      const result = suggestMcpTools('Query the database');
      for (const s of result) {
        expect(s).toHaveProperty('name');
        expect(s).toHaveProperty('description');
        expect(s).toHaveProperty('permission');
        expect(s).toHaveProperty('safeEnvironments');
        expect(s).toHaveProperty('riskNote');
        expect(s).toHaveProperty('recommended');
      }
    });
  });

  describe('shouldUseMcp', () => {
    it('should return false for reasoning-only prompts', () => {
      expect(shouldUseMcp('Explain the difference between REST and GraphQL')).toBe(false);
    });

    it('should return true for data-action prompts', () => {
      expect(shouldUseMcp('Fetch the user data from the API and write it to a file')).toBe(true);
    });

    it('should return false for prompts that have both reasoning and data keywords', () => {
      // Has both reasoning ("explain") and data ("query") keywords
      const result = shouldUseMcp('Explain this SQL query');
      expect(result).toBe(false);
    });

    it('should return false for purely planning prompts', () => {
      expect(shouldUseMcp('Plan a migration strategy for the database')).toBe(false);
    });
  });
});
