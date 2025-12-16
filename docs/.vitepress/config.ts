import path from 'path';
import { defineConfig, DefaultTheme } from 'vitepress';
import { generateSidebar } from './utils/sidebar';

// https://vitepress.dev/reference/site-config

const reactSrc: string = path.resolve(__dirname, '../../src');

export default defineConfig({
  title: 'TW Components',
  description: 'Custom HTML components for use in Bulwark Exterminating LLC projects.',
  base: '/docs/',

  // SEO and meta configuration
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'theme-color', content: '#3c4043' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:title', content: 'TW Components Documentation' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Custom HTML components for Bulwark Exterminating LLC projects',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  // Better clean URLs
  cleanUrls: true,

  // Last updated timestamp
  lastUpdated: true,

  // Sitemap generation
  sitemap: {
    hostname: 'https://binaryband.github.io/bulwark-client-app',
  },

  themeConfig: {
    siteTitle: 'TW Components',
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/' },
      { text: 'Live Demo', link: '/demo' },
    ],

    // Auto-generated sidebar
    sidebar: generateSidebar(),

    // Social links
    socialLinks: [{ icon: 'github', link: 'https://github.com/BinaryBand/bulwark-client-app' }],

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
      copyright: 'Copyright © 2025 Bulwark Exterminating LLC',
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/BinaryBand/bulwark-client-app/edit/main/docs/:path',
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
  },
});
