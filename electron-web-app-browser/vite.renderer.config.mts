import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
    root: path.join(import.meta.dirname, "src"),
    base: './', // ⚠️ Crucial for packaged/production relative path loading
    build: {
      outDir: '../.vite/renderer/main_window', // Should match your name structure
    },
});