import { useState, useEffect, useCallback } from 'react';
import type { StorageResult } from '@/common/interfaces';
import { loggerWarn } from '@/utils/loggerUtils';
import { ERROR_MESSAGES } from '@/common/messages/error';

export type SetStorageValue<T> = (value: T | ((prev: T) => T)) => void;

function readFromStorage<T>(key: string, initialValue: T): { value: T; status: StorageResult<T> } {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item) as T;
      return { value: parsed, status: { success: true, data: parsed } };
    }
    return { value: initialValue, status: { success: true, data: initialValue } };
  } catch (err) {
    const message = err instanceof Error ? err.message : ERROR_MESSAGES.STORAGE_READ_FAILED;
    loggerWarn(
      ERROR_MESSAGES.STORAGE_READ_FAILED,
      { key, error: message },
      'hooks',
      'use-local-storage.ts',
      'useLocalStorage'
    );
    return { value: initialValue, status: { success: false, error: message } };
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetStorageValue<T>, StorageResult<T>] {
  const [storageStatus, setStorageStatus] = useState<StorageResult<T>>(
    () => readFromStorage(key, initialValue).status
  );
  const [storedValue, setStoredValue] = useState<T>(() => readFromStorage(key, initialValue).value);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
          setStorageStatus({ success: true, data: nextValue });
        } catch (err) {
          const message = err instanceof Error ? err.message : ERROR_MESSAGES.STORAGE_WRITE_FAILED;
          loggerWarn(
            ERROR_MESSAGES.STORAGE_WRITE_FAILED,
            { key, error: message },
            'hooks',
            'use-local-storage.ts',
            'useLocalStorage'
          );
          setStorageStatus({ success: false, data: nextValue, error: message });
        }
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // cross-tab parse errors are non-critical
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, storageStatus];
}
