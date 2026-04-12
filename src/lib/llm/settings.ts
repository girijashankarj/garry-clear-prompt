/**
 * LLM settings persistence in localStorage.
 *
 * WARNING: API keys are stored in localStorage in plain text.
 * This is acceptable for a local-first tool but credentials
 * should never be synced, committed, or exposed.
 */

import type { LlmSettings, LlmRunResult } from '@/types/prompt.types';
import { STORAGE_KEYS } from '@/common/constants';
import { loggerDebug } from '@/utils/loggerUtils';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

const SETTINGS_KEY = STORAGE_KEYS.LLM_SETTINGS;
const HISTORY_KEY = STORAGE_KEYS.LLM_HISTORY;

const DEFAULT_SETTINGS: LlmSettings = {
  provider: 'openai',
  modelId: 'gpt-4o-mini',
  credentials: {},
  maxTokens: 2048,
  temperature: 0.7,
};

export function loadLlmSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLlmSettings(settings: LlmSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  loggerDebug(
    DEBUG_MESSAGES.LLM_SETTINGS_SAVED,
    { provider: settings.provider, modelId: settings.modelId },
    'llm',
    'settings.ts',
    'saveLlmSettings'
  );
}

export function loadRunHistory(): LlmRunResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRunToHistory(result: LlmRunResult): void {
  const history = loadRunHistory();
  history.push(result);
  // Keep last 50 runs
  const trimmed = history.slice(-50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function clearRunHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getTotalSpend(): number {
  const history = loadRunHistory();
  return history.reduce((sum, r) => sum + r.estimatedCost, 0);
}
