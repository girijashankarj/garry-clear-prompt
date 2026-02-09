import {
  getTestSuites,
  createTestSuite,
  addTestCase,
  removeTestCase,
  deleteTestSuite,
  exportTestSuiteAsJson,
} from '@/lib/test-cases';

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

describe('test-cases', () => {
  beforeEach(() => {
    localStorageMock.clear();
    uuidCounter = 0;
    jest.clearAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTestSuite', () => {
    it('should create a suite with correct fields', () => {
      const suite = createTestSuite('My Suite', 'Test prompt snippet');
      expect(suite.id).toBeDefined();
      expect(suite.name).toBe('My Suite');
      expect(suite.promptSnippet).toBe('Test prompt snippet');
      expect(suite.cases).toEqual([]);
      expect(suite.createdAt).toBeGreaterThan(0);
    });

    it('should truncate prompt snippet to 100 chars', () => {
      const longPrompt = 'a'.repeat(200);
      const suite = createTestSuite('Suite', longPrompt);
      expect(suite.promptSnippet.length).toBe(100);
    });
  });

  describe('getTestSuites', () => {
    it('should return empty array when no suites', () => {
      expect(getTestSuites()).toEqual([]);
    });

    it('should return created suites', () => {
      createTestSuite('Suite 1', 'prompt');
      createTestSuite('Suite 2', 'prompt');
      expect(getTestSuites().length).toBe(2);
    });
  });

  describe('addTestCase', () => {
    it('should add a test case to a suite', () => {
      const suite = createTestSuite('Suite', 'prompt');
      const tc = addTestCase(suite.id, 'input', 'expected output', 'notes');
      expect(tc).toBeDefined();
      expect(tc!.input).toBe('input');
      expect(tc!.expectedOutput).toBe('expected output');
      expect(tc!.notes).toBe('notes');
    });

    it('should return null for non-existent suite', () => {
      const tc = addTestCase('non-existent', 'input', 'expected');
      expect(tc).toBeNull();
    });

    it('should enforce max test cases per suite', () => {
      const suite = createTestSuite('Suite', 'prompt');
      for (let i = 0; i < 10; i++) {
        addTestCase(suite.id, `input ${i}`, `expected ${i}`);
      }
      const overflow = addTestCase(suite.id, 'overflow', 'overflow');
      expect(overflow).toBeNull();
    });
  });

  describe('removeTestCase', () => {
    it('should remove a specific test case', () => {
      const suite = createTestSuite('Suite', 'prompt');
      const tc = addTestCase(suite.id, 'input', 'expected');
      addTestCase(suite.id, 'input2', 'expected2');
      removeTestCase(suite.id, tc!.id);
      const suites = getTestSuites();
      const updated = suites.find(s => s.id === suite.id);
      expect(updated!.cases.length).toBe(1);
      expect(updated!.cases[0].input).toBe('input2');
    });

    it('should handle non-existent suite gracefully', () => {
      expect(() => removeTestCase('non-existent', 'case-id')).not.toThrow();
    });
  });

  describe('deleteTestSuite', () => {
    it('should delete a suite by id', () => {
      const suite = createTestSuite('Suite', 'prompt');
      createTestSuite('Suite 2', 'prompt');
      deleteTestSuite(suite.id);
      expect(getTestSuites().length).toBe(1);
    });
  });

  describe('exportTestSuiteAsJson', () => {
    it('should return valid JSON', () => {
      const suite = createTestSuite('Export Suite', 'prompt');
      addTestCase(suite.id, 'input', 'expected');
      const suites = getTestSuites();
      const updatedSuite = suites.find(s => s.id === suite.id)!;
      const json = exportTestSuiteAsJson(updatedSuite);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include suite name and cases', () => {
      const suite = createTestSuite('Export Suite', 'prompt');
      addTestCase(suite.id, 'test input', 'test expected');
      const suites = getTestSuites();
      const updatedSuite = suites.find(s => s.id === suite.id)!;
      const parsed = JSON.parse(exportTestSuiteAsJson(updatedSuite));
      expect(parsed.name).toBe('Export Suite');
      expect(parsed.cases).toHaveLength(1);
    });
  });
});
