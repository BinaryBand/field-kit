import MultilineElement from './MultilineElement';
import PinInputElement from './PinInputElement';
import ListInputElement from './ListInputElement';

export const MULTILINE_TAG = 'tw-multiline';
export const PIN_TAG = 'tw-pin';
export const LIST_TAG = 'tw-list';

export function registerFieldkitElements(): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get(MULTILINE_TAG)) {
    customElements.define(MULTILINE_TAG, MultilineElement);
  }

  if (!customElements.get(PIN_TAG)) {
    customElements.define(PIN_TAG, PinInputElement);
  }

  if (!customElements.get(LIST_TAG)) {
    customElements.define(LIST_TAG, ListInputElement);
  }
}
