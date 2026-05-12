import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { LIST_TAG, registerFieldkitElements } from '@/elements/register';

describe('ListInputElement', () => {
  beforeAll(() => {
    registerFieldkitElements();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates list from value attribute JSON', () => {
    const element = document.createElement(LIST_TAG);
    element.setAttribute('value', '["One","Two"]');
    document.body.appendChild(element);

    const tokens = element.shadowRoot?.querySelectorAll('.token');
    expect(tokens?.length).toBe(2);
  });

  it('adds list item on Enter', () => {
    const element = document.createElement(LIST_TAG);
    document.body.appendChild(element);

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'Alpha';

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(element.getAttribute('value')).toBe('["Alpha"]');
  });

  it('removes last item to input on Backspace when empty', () => {
    const element = document.createElement(LIST_TAG);
    element.setAttribute('value', '["One","Two"]');
    document.body.appendChild(element);

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '';

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

    expect(element.getAttribute('value')).toBe('["One"]');
    expect(input.value).toBe('Two');
  });
});
