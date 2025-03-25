import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

var root = path.resolve(__dirname, 'src');
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
});
