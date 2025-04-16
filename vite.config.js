import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src/lib'),
      '@layers': resolve(__dirname, 'src/layers'),
      '@utils': resolve(__dirname, 'src/lib/utils'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@core': resolve(__dirname, 'src/core'),
    },
  },
});
