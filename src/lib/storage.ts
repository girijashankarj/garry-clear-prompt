import type { BasicPromptInput, AdvancedPromptInput } from '@/types/prompt.types';
import type { StorageResult } from '@/common/interfaces';
import { STORAGE_KEYS } from '@/common/constants';
import { loggerDebug, loggerError } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';
import { ERROR_MESSAGES } from '@/common/messages/error';

const BASIC_DRAFT_KEY = STORAGE_KEYS.BASIC_INPUT;
const ADVANCED_DRAFT_KEY = STORAGE_KEYS.ADVANCED_INPUT;

export function saveBasicDraft(input: BasicPromptInput): StorageResult<void> {
  try {
    localStorage.setItem(BASIC_DRAFT_KEY, JSON.stringify(input));
    loggerDebug(
      DEBUG_MESSAGES.BASIC_DRAFT_SAVED,
      undefined,
      'storage',
      'storage.ts',
      'saveBasicDraft'
    );
    return { success: true };
  } catch {
    loggerError(
      ERROR_MESSAGES.STORAGE_WRITE_FAILED,
      undefined,
      'storage',
      'storage.ts',
      'saveBasicDraft'
    );
    return { success: false, error: ERROR_MESSAGES.STORAGE_WRITE_FAILED };
  }
}

export function loadBasicDraft(): StorageResult<BasicPromptInput> {
  try {
    const raw = localStorage.getItem(BASIC_DRAFT_KEY);
    return raw ? { success: true, data: JSON.parse(raw) as BasicPromptInput } : { success: true };
  } catch {
    return { success: false, error: ERROR_MESSAGES.STORAGE_READ_FAILED };
  }
}

export function clearBasicDraft() {
  localStorage.removeItem(BASIC_DRAFT_KEY);
}

export function saveAdvancedDraft(input: AdvancedPromptInput): StorageResult<void> {
  try {
    localStorage.setItem(ADVANCED_DRAFT_KEY, JSON.stringify(input));
    loggerDebug(
      DEBUG_MESSAGES.ADVANCED_DRAFT_SAVED,
      undefined,
      'storage',
      'storage.ts',
      'saveAdvancedDraft'
    );
    return { success: true };
  } catch {
    loggerError(
      ERROR_MESSAGES.STORAGE_WRITE_FAILED,
      undefined,
      'storage',
      'storage.ts',
      'saveAdvancedDraft'
    );
    return { success: false, error: ERROR_MESSAGES.STORAGE_WRITE_FAILED };
  }
}

export function loadAdvancedDraft(): StorageResult<AdvancedPromptInput> {
  try {
    const raw = localStorage.getItem(ADVANCED_DRAFT_KEY);
    return raw
      ? { success: true, data: JSON.parse(raw) as AdvancedPromptInput }
      : { success: true };
  } catch {
    return { success: false, error: ERROR_MESSAGES.STORAGE_READ_FAILED };
  }
}

export function clearAdvancedDraft() {
  localStorage.removeItem(ADVANCED_DRAFT_KEY);
}

/** Removes every persisted app key (drafts, versions, calibration, LLM, mode, theme). Call `resetToDefaults` from the store after this to restore default mode and theme in storage. */
export function clearAllAppStorage(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage unavailable or blocked
    }
  }
  loggerDebug(
    DEBUG_MESSAGES.APP_STORAGE_CLEARED,
    undefined,
    'storage',
    'storage.ts',
    'clearAllAppStorage'
  );
}
