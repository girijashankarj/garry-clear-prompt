import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: process.env.GITHUB_PAGES === 'true' ? '/garry-clear-prompt/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __DEV__: mode !== 'production',
      __LOG_LEVEL__: JSON.stringify(process.env.VITE_LOG_LEVEL || ''),
      'process.env.VITE_ML_INTENT_ENABLED': JSON.stringify(env.VITE_ML_INTENT_ENABLED ?? ''),
    },
  };
});
