import {
  addCalibrationRecord,
  getCalibrationRecords,
  clearCalibrationRecords,
  getCalibrationStats,
} from '@/lib/calibration';

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
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: jest.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2, 8)) },
});

describe('calibration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('addCalibrationRecord', () => {
    it('should add a record and return it with id and timestamp', () => {
      const record = addCalibrationRecord({
        promptSnippet: 'test prompt',
        estimatedInput: 100,
        estimatedOutput: 200,
        actualInput: 110,
        actualOutput: 190,
      });
      expect(record.id).toBeDefined();
      expect(record.timestamp).toBeGreaterThan(0);
      expect(record.promptSnippet).toBe('test prompt');
    });

    it('should persist to localStorage', () => {
      addCalibrationRecord({
        promptSnippet: 'test',
        estimatedInput: 100,
        estimatedOutput: 200,
        actualInput: 110,
        actualOutput: 190,
      });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('getCalibrationRecords', () => {
    it('should return empty array when no records exist', () => {
      expect(getCalibrationRecords()).toEqual([]);
    });

    it('should return records after adding them', () => {
      addCalibrationRecord({
        promptSnippet: 'test',
        estimatedInput: 100,
        estimatedOutput: 200,
        actualInput: 110,
        actualOutput: 190,
      });
      const records = getCalibrationRecords();
      expect(records.length).toBe(1);
    });
  });

  describe('clearCalibrationRecords', () => {
    it('should remove all records', () => {
      addCalibrationRecord({
        promptSnippet: 'test',
        estimatedInput: 100,
        estimatedOutput: 200,
        actualInput: 110,
        actualOutput: 190,
      });
      clearCalibrationRecords();
      expect(getCalibrationRecords()).toEqual([]);
    });
  });

  describe('getCalibrationStats', () => {
    it('should return default stats when no records', () => {
      const stats = getCalibrationStats();
      expect(stats.totalRecords).toBe(0);
      expect(stats.avgInputRatio).toBe(1);
      expect(stats.avgOutputRatio).toBe(1);
      expect(stats.inputCorrectionFactor).toBe(1);
      expect(stats.outputCorrectionFactor).toBe(1);
    });

    it('should calculate correct ratios', () => {
      addCalibrationRecord({
        promptSnippet: 'test',
        estimatedInput: 100,
        estimatedOutput: 200,
        actualInput: 120,
        actualOutput: 180,
      });
      const stats = getCalibrationStats();
      expect(stats.totalRecords).toBe(1);
      expect(stats.avgInputRatio).toBe(1.2);
      expect(stats.avgOutputRatio).toBe(0.9);
    });

    it('should handle records with zero estimates gracefully', () => {
      addCalibrationRecord({
        promptSnippet: 'test',
        estimatedInput: 0,
        estimatedOutput: 0,
        actualInput: 100,
        actualOutput: 200,
      });
      const stats = getCalibrationStats();
      expect(stats.totalRecords).toBe(1);
      // Ratios should default to 1 when estimates are 0
      expect(stats.avgInputRatio).toBe(1);
      expect(stats.avgOutputRatio).toBe(1);
    });
  });
});
