import {
  getPromptVersions,
  savePromptVersion,
  deletePromptVersion,
  clearPromptVersions,
} from '@/lib/versioning';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: jest.fn(() => `uuid-${++uuidCounter}`) },
});

describe('versioning', () => {
  beforeEach(() => {
    localStorageMock.clear();
    uuidCounter = 0;
    jest.clearAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('savePromptVersion', () => {
    it('should save a version and return it with metadata', () => {
      const v = savePromptVersion('test prompt', 'meta', 85, 'basic');
      expect(v.id).toBeDefined();
      expect(v.version).toBe(1);
      expect(v.label).toBe('v1');
      expect(v.prompt).toBe('test prompt');
      expect(v.metaPrompt).toBe('meta');
      expect(v.score).toBe(85);
      expect(v.mode).toBe('basic');
      expect(v.timestamp).toBeGreaterThan(0);
    });

    it('should auto-increment version numbers per mode', () => {
      savePromptVersion('v1', '', 70, 'basic');
      const v2 = savePromptVersion('v2', '', 80, 'basic');
      expect(v2.version).toBe(2);
      expect(v2.label).toBe('v2');
    });

    it('should track versions independently per mode', () => {
      savePromptVersion('basic v1', '', 70, 'basic');
      const adv1 = savePromptVersion('adv v1', '', 80, 'advanced');
      expect(adv1.version).toBe(1);
    });
  });

  describe('getPromptVersions', () => {
    it('should return empty array when no versions', () => {
      expect(getPromptVersions()).toEqual([]);
    });

    it('should return all versions when no mode filter', () => {
      savePromptVersion('basic', '', 70, 'basic');
      savePromptVersion('advanced', '', 80, 'advanced');
      expect(getPromptVersions().length).toBe(2);
    });

    it('should filter by mode', () => {
      savePromptVersion('basic', '', 70, 'basic');
      savePromptVersion('advanced', '', 80, 'advanced');
      expect(getPromptVersions('basic').length).toBe(1);
      expect(getPromptVersions('advanced').length).toBe(1);
    });
  });

  describe('deletePromptVersion', () => {
    it('should remove a specific version by id', () => {
      const v = savePromptVersion('to delete', '', 70, 'basic');
      savePromptVersion('to keep', '', 80, 'basic');
      deletePromptVersion(v.id);
      const remaining = getPromptVersions();
      expect(remaining.length).toBe(1);
      expect(remaining[0].prompt).toBe('to keep');
    });

    it('should handle deleting non-existent id gracefully', () => {
      savePromptVersion('test', '', 70, 'basic');
      deletePromptVersion('non-existent-id');
      expect(getPromptVersions().length).toBe(1);
    });
  });

  describe('clearPromptVersions', () => {
    it('should clear all versions when no mode specified', () => {
      savePromptVersion('basic', '', 70, 'basic');
      savePromptVersion('advanced', '', 80, 'advanced');
      clearPromptVersions();
      expect(getPromptVersions()).toEqual([]);
    });

    it('should clear only versions for the specified mode', () => {
      savePromptVersion('basic', '', 70, 'basic');
      savePromptVersion('advanced', '', 80, 'advanced');
      clearPromptVersions('basic');
      const remaining = getPromptVersions();
      expect(remaining.length).toBe(1);
      expect(remaining[0].mode).toBe('advanced');
    });
  });
});
