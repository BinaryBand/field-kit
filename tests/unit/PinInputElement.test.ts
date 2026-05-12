import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { PIN_TAG, registerFieldkitElements } from '@/elements/register';

describe('PinInputElement', () => {
  beforeAll(() => {
    registerFieldkitElements();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders inputs based on data-size', () => {
    const element = document.createElement(PIN_TAG);
    element.setAttribute('data-size', '4');
    document.body.appendChild(element);

    const inputs = element.shadowRoot?.querySelectorAll('input');
    expect(inputs?.length).toBe(4);
  });

  it('updates value on digit input', () => {
    const element = document.createElement(PIN_TAG);
    element.setAttribute('data-size', '4');
    document.body.appendChild(element);

    const input = element.shadowRoot?.querySelectorAll('input')[0] as HTMLInputElement;
    input.value = '7';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(element.getAttribute('value')).toBe('7');
  });

  it('pastes digits across fields', () => {
    const element = document.createElement(PIN_TAG);
    element.setAttribute('data-size', '4');
    document.body.appendChild(element);

    const input = element.shadowRoot?.querySelectorAll('input')[1] as HTMLInputElement;

    const paste = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(paste, 'clipboardData', {
      value: {
        getData: () => '89',
      },
    });

    input.dispatchEvent(paste);

    expect(element.getAttribute('value')).toBe('89');
  });
});
