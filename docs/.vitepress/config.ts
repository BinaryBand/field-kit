import path from 'path';
import { defineConfig, DefaultTheme } from 'vitepress';
import { generateSidebar } from './utils/sidebar';

// https://vitepress.dev/reference/site-config

const reactSrc: string = path.resolve(__dirname, '../../src');

export default defineConfig({
  title: 'Fieldkit',
  description: 'Custom HTML component library with native form behavior.',,
  base: '/docs/',

  // SEO and meta configuration
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'theme-color', content: '#3c4043' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:title', content: 'Fieldkit Documentation' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Custom HTML component library with native form behavior.',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    // Content Security Policy for XSS protection
    [
      'meta',
      {
        'http-equiv': 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
      }
    ],
    // Additional security headers
    ['meta', { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' }],
    ['meta', { 'http-equiv': 'X-Frame-Options', content: 'DENY' }],
    ['meta', { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }],
  ],

  // Better clean URLs
  cleanUrls: true,

  // Last updated timestamp
  lastUpdated: true,

  themeConfig: {
    siteTitle: 'Fieldkit',
    logo: '/logo.svg',

    nav: [
      { text: 'Components', link: '/' },
    ],

    // Auto-generated sidebar
    sidebar: generateSidebar(),

    // Social links
    socialLinks: [{ icon: 'github', link: 'https://github.com/BinaryBand/field-kit' }],

    // Search configuration
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search components',
                buttonAriaLabel: 'Search components',
              },
            },
          },
        },
      },
    },

    // Footer
    footer: {
      copyright: 'Copyright © 2025 BinaryBand',
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/BinaryBand/field-kit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    // Outline configuration
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    codeTransformers: [
      // Add code group support and better syntax highlighting
    ],
  },

  vite: {
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      sourcemap: false,
      cssCodeSplit: false,
      assetsInlineLimit: 100_000_000,
      chunkSizeWarningLimit: 2_000,
      rollupOptions: {
        output: {
          manualChunks: () => 'app',
        },
      },
    },
    resolve: {
      alias: {
        '@': reactSrc,
        '@tools': path.resolve(reactSrc, 'controllers/tools'),
        '@utils': path.resolve(reactSrc, 'controllers/utils'),
        '@providers': path.resolve(reactSrc, 'controllers/providers'),
        '@controllers': path.resolve(reactSrc, 'controllers/components'),
        '@components': path.resolve(reactSrc, 'views/main'),
        '@inline': path.resolve(reactSrc, 'views/inline'),
        '@styled': path.resolve(reactSrc, 'views/styled'),
      },
    },
    // Better dev experience
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    // SSR configuration
    ssr: {
      noExternal: [
        // Include MUI packages for SSR
        '@emotion/react',
        '@emotion/styled',
        '@emotion/css',
        // VitePress local search highlighting dependency; needs bundling for SSR
        'mark.js',
      ],
    },
  },
});
