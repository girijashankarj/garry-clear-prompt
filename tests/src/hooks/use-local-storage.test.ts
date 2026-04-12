import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/use-local-storage';

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

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored value');
  });

  it('should update value and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => {
      result.current[1]('new value');
    });
    expect(result.current[0]).toBe('new value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
  });

  it('should accept a function updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
  });

  it('should handle object values', () => {
    const obj = { name: 'test', count: 42 };
    const { result } = renderHook(() => useLocalStorage('test-obj', obj));
    expect(result.current[0]).toEqual(obj);
  });

  it('should return initial value when localStorage throws on read', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('fail');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle localStorage setItem failure gracefully', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('full');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    // Should not throw
    act(() => {
      result.current[1]('new value');
    });
    // The state still updates even if storage fails
    expect(result.current[0]).toBe('new value');
  });
});
