import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppMode, ThemeMode } from '@/types/prompt.types';
import { STORAGE_KEYS } from '@/common/constants';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

interface PromptState {
  mode: AppMode;
  theme: ThemeMode;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

const initialState: PromptState = {
  mode: loadFromStorage<AppMode>(STORAGE_KEYS.MODE, 'basic'),
  theme: loadFromStorage<ThemeMode>(STORAGE_KEYS.THEME, 'dark'),
};

export const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<AppMode>) => {
      state.mode = action.payload;
      saveToStorage(STORAGE_KEYS.MODE, action.payload);
      loggerDebug(
        DEBUG_MESSAGES.MODE_SWITCHED,
        { mode: action.payload },
        'store',
        'promptSlice.ts',
        'setMode'
      );
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      saveToStorage(STORAGE_KEYS.THEME, action.payload);
      loggerDebug(
        DEBUG_MESSAGES.THEME_SET,
        { theme: action.payload },
        'store',
        'promptSlice.ts',
        'setTheme'
      );
    },
    toggleTheme: (state) => {
      const newTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      saveToStorage(STORAGE_KEYS.THEME, newTheme);
      loggerDebug(
        DEBUG_MESSAGES.THEME_TOGGLED,
        { theme: newTheme },
        'store',
        'promptSlice.ts',
        'toggleTheme'
      );
    },
    resetToDefaults: (state) => {
      state.mode = 'basic';
      state.theme = 'dark';
      saveToStorage(STORAGE_KEYS.MODE, 'basic');
      saveToStorage(STORAGE_KEYS.THEME, 'dark');
      loggerDebug(
        DEBUG_MESSAGES.APP_RESET_TO_DEFAULTS,
        undefined,
        'store',
        'promptSlice.ts',
        'resetToDefaults'
      );
    },
  },
});

export const { setMode, setTheme, toggleTheme, resetToDefaults } = promptSlice.actions;
export default promptSlice.reducer;
