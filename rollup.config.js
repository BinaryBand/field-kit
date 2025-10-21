import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { dts } from 'rollup-plugin-dts';

const isDevelopment = process.env.NODE_ENV === 'development';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      json(),
      resolve({ preferBuiltins: true }),
      // Only minify in production
      !isDevelopment &&
        terser({
          compress: { drop_console: !isDevelopment },
          format: { comments: false },
        }),
      typescript({
        declaration: false,
        declarationMap: false,
        outDir: 'dist',
        sourceMap: true,
      }),
      typescriptPaths(),
    ].filter(Boolean),
    external: [
      // Mark Node.js built-ins as external
      'crypto',
      'fs',
      'path',
      'process',
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: './src',
          paths: {
            '@/*': ['*'],
          },
        },
      }),
    ],
  },
];
