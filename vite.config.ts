import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsInlineLimit: 0, // Empêche l'inlining des assets
  },
  // Assurer que les assets sont correctement gérés
  publicDir: 'public',
});