import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import MyLayout from '../../vue/BaseLayout.vue';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => {
        h(MyLayout);

        // Ensure the custom components load when the page is loaded
        if (typeof document !== 'undefined') {
          document.body.dispatchEvent(new Event('update'));
        }
      },
    });
  },
};
