import { describe, it, expect, beforeEach } from 'vitest';

import { registerFieldkitElements, MULTILINE_TAG } from '@/elements/register';

describe('registerFieldkitElements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers tw-multiline once', () => {
    registerFieldkitElements();
    const ctor = customElements.get(MULTILINE_TAG);
    expect(ctor).toBeDefined();

    // idempotent call
    registerFieldkitElements();
    expect(customElements.get(MULTILINE_TAG)).toBe(ctor);
  });
});
