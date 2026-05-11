import MultilineElement from './MultilineElement';

export const MULTILINE_TAG = 'tw-multiline';

export function registerFieldkitElements(): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get(MULTILINE_TAG)) {
    customElements.define(MULTILINE_TAG, MultilineElement);
  }
}
