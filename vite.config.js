import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/birthday_problem/', // Use relative paths for GitHub Pages
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    sourcemap: true, // Enable source maps for easier debugging
    chunkSizeWarningLimit: 1600, // Increase chunk size warning limit
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      format: {
        comments: false, // Remove comments
      },
      compress: {
        drop_console: true, // Remove console logs in production
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Auto-split vendor chunks by package
          if (id.includes('node_modules')) {
            return id.toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .replace('@', 'vendor_'); // for scoped packages like @vue
          }
        }
      }
    }
  },
  server: {
    open: 'index.html',
    port: 5173
  }
});
