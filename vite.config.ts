import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const repoName = 'Vibe_MosaicGame_TS-React-Vite_Cursor-Composer-2-5';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss()],
}));
