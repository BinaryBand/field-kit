import { describe, it, expect, beforeEach } from 'vitest';

import { registerFieldkitElements, LIST_TAG, MULTILINE_TAG, PIN_TAG } from '@/elements/register';

describe('registerFieldkitElements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers tw-multiline once', () => {
    registerFieldkitElements();
    const ctor = customElements.get(MULTILINE_TAG);
    expect(ctor).toBeDefined();
    expect(customElements.get(PIN_TAG)).toBeDefined();
    expect(customElements.get(LIST_TAG)).toBeDefined();

    // idempotent call
    registerFieldkitElements();
    expect(customElements.get(MULTILINE_TAG)).toBe(ctor);
  });
});
