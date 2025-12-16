import { DefaultTheme } from 'vitepress';

/**
 * Generate sidebar configuration for VitePress
 * This function creates a dynamic sidebar structure that can be easily extended
 * when new components are added to the project.
 */
export function generateSidebar(): DefaultTheme.Sidebar {
  return {
    '/components/': [
      {
        text: 'Components Overview',
        link: '/components/',
      },
      {
        text: 'Input Components',
        collapsed: false,
        items: [
          { text: 'Auto-Resize Textarea', link: '/components/inputs/auto-resize' },
          { text: 'List Input', link: '/components/inputs/list' },
          { text: 'Passkey Input', link: '/components/inputs/passkey' },
          { text: 'PIN Input', link: '/components/inputs/pin' },
          { text: 'Select Input', link: '/components/inputs/select' },
          { text: 'Signature Input', link: '/components/inputs/signature' },
        ],
      },
      {
        text: 'View Components',
        collapsed: false,
        items: [
          { text: 'Calendar', link: '/components/views/calendar' },
          { text: 'Filter', link: '/components/views/filter' },
        ],
      },
      {
        text: 'Utilities',
        collapsed: false,
        items: [
          { text: 'Ripple Effect', link: '/components/utilities/ripple' },
        ],
      },
    ],
  };
}

/**
 * Helper function to add a new component to the sidebar
 * This makes it easy to programmatically add new components
 */
export function addComponentToSidebar(
  componentName: string,
  componentPath: string,
  category: 'inputs' | 'views' = 'inputs'
): void {
  // This function can be extended to automatically update the sidebar
  // when new components are added to the project
  console.log(`Adding ${componentName} to ${category} at ${componentPath}`);
}
