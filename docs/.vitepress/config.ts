import path from 'path';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config

const reactSrc: string = path.resolve(__dirname, '../../src');

export default defineConfig({
  title: 'TW Components',
  description: 'Custom HTML components for use in Bulwark Exterminating LLC projects.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Read Me', link: '/readme' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        link: '/readme',
        items: [
          { text: 'Installation', link: '/readme#installation' },
          { text: 'Usage', link: '/readme#usage' },
        ],
      },
      {
        text: 'Components',
        items: [
          {
            text: 'Inputs',
            items: [
              { text: 'Auto Resize', link: '/components/inputs/auto-resize' },
              { text: 'List', link: '/components/inputs/list' },
              { text: 'Passkey', link: '/components/inputs/passkey' },
              { text: 'PIN', link: '/components/inputs/pin' },
              { text: 'Select', link: '/components/inputs/select' },
              { text: 'Signature', link: '/components/inputs/signature' },
            ],
          },
          {
            text: 'Views',
            items: [
              { text: 'Calendar', link: '/components/views/calendar' },
              { text: 'Filter', link: '/components/views/filter' },
            ],
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/BinaryBand/bulwark-client-app' }],
  },
  head: [
    ['link', { rel: 'icon', href: '/vite.svg' }],
    ['link', { rel: 'stylesheet', href: '/style.scss', type: 'text/css' }],
  ],
  vite: {
    resolve: {
      alias: {
        '@': reactSrc,
        '@tools': path.resolve(reactSrc, 'controllers/tools'),
        '@utils': path.resolve(reactSrc, 'controllers/utils'),
        '@providers': path.resolve(reactSrc, 'controllers/providers'),
        '@components': path.resolve(reactSrc, 'views/components/main'),
        '@inline': path.resolve(reactSrc, 'views/components/inline'),
        '@styled': path.resolve(reactSrc, 'views/styled'),
      },
    },
  },
});
