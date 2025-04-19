// vite.lib.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.js'),
      name: 'Phyloxonium',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@utils': resolve(__dirname, 'src/lib/utils'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@core': resolve(__dirname, 'src/core'),
      '@layers': resolve(__dirname, 'src/layers'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});