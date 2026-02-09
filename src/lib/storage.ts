import type { BasicPromptInput, AdvancedPromptInput } from '@/types/prompt.types';

const BASIC_DRAFT_KEY = 'gcp-basic-draft';
const ADVANCED_DRAFT_KEY = 'gcp-advanced-draft';

export function saveBasicDraft(input: BasicPromptInput) {
  try {
    localStorage.setItem(BASIC_DRAFT_KEY, JSON.stringify(input));
  } catch {
    // storage full
  }
}

export function loadBasicDraft(): BasicPromptInput | null {
  try {
    const raw = localStorage.getItem(BASIC_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as BasicPromptInput) : null;
  } catch {
    return null;
  }
}

export function clearBasicDraft() {
  localStorage.removeItem(BASIC_DRAFT_KEY);
}

export function saveAdvancedDraft(input: AdvancedPromptInput) {
  try {
    localStorage.setItem(ADVANCED_DRAFT_KEY, JSON.stringify(input));
  } catch {
    // storage full
  }
}

export function loadAdvancedDraft(): AdvancedPromptInput | null {
  try {
    const raw = localStorage.getItem(ADVANCED_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as AdvancedPromptInput) : null;
  } catch {
    return null;
  }
}

export function clearAdvancedDraft() {
  localStorage.removeItem(ADVANCED_DRAFT_KEY);
}
