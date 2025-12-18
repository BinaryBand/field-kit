import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import BaseLayout from '../../vue/BaseLayout.vue';
import '../../vue/BaseLayout.vue'; // Import for side effects (styles and setup script)

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => {
        // Render BaseLayout for initialization and styles
        return h(BaseLayout);
      },
    });
  },
  enhanceApp({ app, router }) {
    // Initialize components on initial load
    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.dispatchEvent(new Event('update'));
      });

      // Re-initialize components after each route change (SPA navigation)
      if (router) {
        router.onAfterRouteChanged = () => {
          // Small delay to ensure DOM is updated
          setTimeout(() => {
            document.body.dispatchEvent(new Event('update'));
          }, 100);
        };
      }
    }
  },
};
