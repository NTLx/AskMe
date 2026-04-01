import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 采用相对路径 './' 完美兼顾 Web端 (GitHub Pages 任意子目录) 与 Tauri 桌面端的打包需求
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
