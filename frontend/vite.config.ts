import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['@tauri-apps/api'],
    },
  },
  define: {
    'import.meta.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'web'),
  },
  server: {
    port: 3000,
  },
});