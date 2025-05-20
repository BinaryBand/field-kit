import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import path from 'path';

const root: string = path.resolve(__dirname, 'src');

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': root,
      '@tools': path.resolve(root, 'controllers/tools'),
      '@utils': path.resolve(root, 'controllers/utils'),
      '@providers': path.resolve(root, 'controllers/providers'),
      '@components': path.resolve(root, 'views/components/main'),
      '@inline': path.resolve(root, 'views/components/inline'),
      '@styled': path.resolve(root, 'views/styled'),
    },
  },
  build: {
    lib: {
      entry: { main: path.resolve(root, 'index.tsx') },
      name: 'tw-client',
      formats: ['umd'],
      fileName: (format) => `main.${format}.js`,
    },
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
});
