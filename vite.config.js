import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
//   root: './',
//   publicDir: 'public',
  base: '/birthday_problem/', // Use relative paths for GitHub Pages
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    sourcemap: true // Enable source maps for easier debugging
  },
  server: {
    open: 'index.html',
    port: 5173
  }
});
