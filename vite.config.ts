import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

const root: string = path.resolve(__dirname, 'src');

export default defineConfig(({ command }) => ({
  root: __dirname,
  publicDir: false,
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': root,
      '@components': path.resolve(root, 'views/main'),
      '@controllers': path.resolve(root, 'controllers/components'),
      '@providers': path.resolve(root, 'controllers/providers'),
      '@tools': path.resolve(root, 'controllers/tools'),
    },
  },
  build: {
    lib: {
      entry: { main: path.resolve(__dirname, 'src/index.tsx') },
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
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
  },
}));
