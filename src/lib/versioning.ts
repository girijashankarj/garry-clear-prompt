/**
 * Prompt versioning: save/load/list prompt versions in localStorage.
 */

const STORAGE_KEY = 'gcp-prompt-versions';

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

  // Keep last 50 versions total
  const trimmed = versions.slice(-50);
  saveVersions(trimmed);

  return newVersion;
}

export function deletePromptVersion(id: string): void {
  const versions = loadVersions().filter(v => v.id !== id);
  saveVersions(versions);
}

export function clearPromptVersions(mode?: 'basic' | 'advanced'): void {
  if (mode) {
    const versions = loadVersions().filter(v => v.mode !== mode);
    saveVersions(versions);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}
