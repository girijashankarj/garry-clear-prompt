import {
  saveBasicDraft,
  loadBasicDraft,
  clearBasicDraft,
  saveAdvancedDraft,
  loadAdvancedDraft,
  clearAdvancedDraft,
  clearAllAppStorage,
} from '@/lib/storage';
import { STORAGE_KEYS } from '@/common/constants';
import { createMockBasicInput, createMockAdvancedInput } from '../../mock';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('basic draft', () => {
    it('should save and load a basic draft', () => {
      const input = createMockBasicInput({ goal: 'Test goal' });
      const saveResult = saveBasicDraft(input);
      expect(saveResult.success).toBe(true);

      const loaded = loadBasicDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toEqual(input);
    });

    it('should return success with no data when no draft exists', () => {
      const loaded = loadBasicDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toBeUndefined();
    });

    it('should clear the basic draft', () => {
      const input = createMockBasicInput();
      saveBasicDraft(input);
      clearBasicDraft();
      const loaded = loadBasicDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toBeUndefined();
    });
  });

  describe('advanced draft', () => {
    it('should save and load an advanced draft', () => {
      const input = createMockAdvancedInput({ prompt: 'Test prompt' });
      const saveResult = saveAdvancedDraft(input);
      expect(saveResult.success).toBe(true);

      const loaded = loadAdvancedDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toEqual(input);
    });

    it('should return success with no data when no draft exists', () => {
      const loaded = loadAdvancedDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toBeUndefined();
    });

    it('should clear the advanced draft', () => {
      const input = createMockAdvancedInput();
      saveAdvancedDraft(input);
      clearAdvancedDraft();
      const loaded = loadAdvancedDraft();
      expect(loaded.success).toBe(true);
      expect(loaded.data).toBeUndefined();
    });
  });

  describe('clearAllAppStorage', () => {
    it('should remove every STORAGE_KEYS entry', () => {
      for (const key of Object.values(STORAGE_KEYS)) {
        localStorageMock.setItem(key, '"x"');
      }
      clearAllAppStorage();
      for (const key of Object.values(STORAGE_KEYS)) {
        expect(localStorageMock.getItem(key)).toBeNull();
      }
    });
  });
});
