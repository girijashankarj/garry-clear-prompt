/**
 * Prompt versioning: save/load/list prompt versions in localStorage.
 */

import { STORAGE_KEYS, MAX_PROMPT_VERSIONS } from '@/common/constants';
import { loggerInfo, loggerDebug } from '@/utils/loggerUtils';
import { INFO_MESSAGES } from '@/common/messages/info';
import { DEBUG_MESSAGES } from '@/common/messages/debug';

const STORAGE_KEY = STORAGE_KEYS.VERSIONS;

export interface PromptVersion {
  id: string;
  version: number;       // 1, 2, 3...
  label: string;         // "v1", "v2"...
  prompt: string;
  metaPrompt: string;
  score: number;
  timestamp: number;
  mode: 'basic' | 'advanced';
}

function loadVersions(): PromptVersion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVersions(versions: PromptVersion[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
}

export function getPromptVersions(mode?: 'basic' | 'advanced'): PromptVersion[] {
  const all = loadVersions();
  if (mode) return all.filter(v => v.mode === mode);
  return all;
}

export function savePromptVersion(
  prompt: string,
  metaPrompt: string,
  score: number,
  mode: 'basic' | 'advanced'
): PromptVersion {
  const versions = loadVersions();
  const modeVersions = versions.filter(v => v.mode === mode);
  const nextVersion = modeVersions.length > 0
    ? Math.max(...modeVersions.map(v => v.version)) + 1
    : 1;

  const newVersion: PromptVersion = {
    id: crypto.randomUUID(),
    version: nextVersion,
    label: `v${nextVersion}`,
    prompt,
    metaPrompt,
    score,
    timestamp: Date.now(),
    mode,
  };

  versions.push(newVersion);

  // Keep last MAX_PROMPT_VERSIONS versions total
  const trimmed = versions.slice(-MAX_PROMPT_VERSIONS);
  saveVersions(trimmed);

  loggerInfo(INFO_MESSAGES.VERSION_SAVED, { version: nextVersion, mode }, 'versioning', 'versioning.ts', 'savePromptVersion');
  return newVersion;
}

export function deletePromptVersion(id: string): void {
  const versions = loadVersions().filter(v => v.id !== id);
  saveVersions(versions);
  loggerDebug(DEBUG_MESSAGES.VERSION_DELETED, { id }, 'versioning', 'versioning.ts', 'deletePromptVersion');
}

export function clearPromptVersions(mode?: 'basic' | 'advanced'): void {
  if (mode) {
    const versions = loadVersions().filter(v => v.mode !== mode);
    saveVersions(versions);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
