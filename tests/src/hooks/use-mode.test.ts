import { renderHook, act } from '@testing-library/react';
import { useMode } from '@/hooks/use-mode';

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

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useMode', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should default to basic mode', () => {
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe('basic');
  });

  it('should allow switching to advanced mode', () => {
    const { result } = renderHook(() => useMode());
    act(() => {
      result.current.setMode('advanced');
    });
    expect(result.current.mode).toBe('advanced');
  });

  it('should allow switching back to basic mode', () => {
    const { result } = renderHook(() => useMode());
    act(() => {
      result.current.setMode('advanced');
    });
    act(() => {
      result.current.setMode('basic');
    });
    expect(result.current.mode).toBe('basic');
  });

  it('should read mode from localStorage if present', () => {
    localStorageMock.setItem('gcp-mode', JSON.stringify('advanced'));
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe('advanced');
  });
});
