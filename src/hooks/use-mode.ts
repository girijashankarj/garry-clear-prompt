import { useLocalStorage } from './use-local-storage';
import type { AppMode } from '@/types/prompt.types';

export function useMode() {
  const [mode, setMode] = useLocalStorage<AppMode>('gcp-mode', 'basic');
  return { mode, setMode } as const;
}
