import { lazy, Suspense, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { INFO_MESSAGES } from '@/common/messages/info';
import { WARN_MESSAGES } from '@/common/messages/warn';
import { clearAllAppStorage } from '@/lib/storage';
import { setMode, toggleTheme, resetToDefaults } from '@/store/promptSlice';
import type { RootState, AppDispatch } from '@/store';

const BasicMode = lazy(() => import('@/components/basic-mode/BasicMode'));
const AdvancedMode = lazy(() => import('@/components/advanced-mode/AdvancedMode'));

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.prompt.mode);
  const theme = useSelector((state: RootState) => state.prompt.theme);
  const [modeMountKey, setModeMountKey] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleModeChange = useCallback(
    (newMode: 'basic' | 'advanced') => {
      dispatch(setMode(newMode));
    },
    [dispatch]
  );

  const handleResetApp = useCallback(() => {
    if (!window.confirm(WARN_MESSAGES.RESET_APP_CONFIRM)) {
      return;
    }
    clearAllAppStorage();
    dispatch(resetToDefaults());
    setModeMountKey((k) => k + 1);
    toast.success(INFO_MESSAGES.APP_RESET);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-pattern">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        theme={theme}
        onThemeToggle={handleToggleTheme}
        onResetApp={handleResetApp}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-5">
        <Suspense fallback={<LoadingSkeleton />}>
          <div key={`${mode}-${modeMountKey}`} className="animate-in fade-in duration-300">
            {mode === 'basic' ? <BasicMode /> : <AdvancedMode />}
          </div>
        </Suspense>
      </main>

      <Footer />

      <Toaster position="bottom-right" theme={theme} richColors />
    </div>
  );
}
