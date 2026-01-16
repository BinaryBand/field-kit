import { DefaultTheme } from 'vitepress';
import { getInputComponents } from './components';


// Generate sidebar configuration for VitePress
export function generateSidebar(): DefaultTheme.Sidebar {
  const inputItems = getInputComponents()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ text: c.name, link: `/inputs/${c.id}` }));

  const rootSidebar = [
      {
        text: 'Overview',
        link: '/',
      },
      {
        text: 'View Components',
        collapsed: false,
        items: [
          { text: 'Calendar', link: '/views/calendar' },
          { text: 'Filter', link: '/views/filter' },
        ],
      },
      {
        text: 'Input Components',
        collapsed: false,
        items: inputItems,
      },
            {
        text: 'Utilities',
        collapsed: false,
        items: [
          { text: 'Form Submission', link: '/utilities/form' },
        ],
      },
    ];

  return {
    '/': rootSidebar,
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
