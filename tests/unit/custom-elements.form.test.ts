import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { LIST_TAG, MULTILINE_TAG, PIN_TAG, registerFieldkitElements } from '@/elements/register';

describe('Custom elements form integration', () => {
  beforeAll(() => {
    registerFieldkitElements();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('includes tw-multiline, tw-pin, and tw-list values in FormData', () => {
    const form = document.createElement('form');

    const multiline = document.createElement(MULTILINE_TAG);
    multiline.setAttribute('name', 'notes');
    multiline.setAttribute('value', 'hello world');

    const pin = document.createElement(PIN_TAG);
    pin.setAttribute('name', 'otp');
    pin.setAttribute('data-size', '4');
    pin.setAttribute('value', '1234');

    const list = document.createElement(LIST_TAG);
    list.setAttribute('name', 'tags');
    list.setAttribute('value', '["One","Two"]');

    form.append(multiline, pin, list);
    document.body.appendChild(form);

    const payload = new FormData(form);

    expect(payload.get('notes')).toBe('hello world');
    expect(payload.get('otp')).toBe('1234');
    expect(payload.get('tags')).toBe('["One","Two"]');
  });

  it('updates FormData after interactive input', () => {
    const form = document.createElement('form');

    const pin = document.createElement(PIN_TAG);
    pin.setAttribute('name', 'otp');
    pin.setAttribute('data-size', '4');

    const list = document.createElement(LIST_TAG);
    list.setAttribute('name', 'tags');

    form.append(pin, list);
    document.body.appendChild(form);

    const pinFirst = pin.shadowRoot?.querySelectorAll('input')[0] as HTMLInputElement;
    pinFirst.value = '7';
    pinFirst.dispatchEvent(new Event('input', { bubbles: true }));

    const listInput = list.shadowRoot?.querySelector('input') as HTMLInputElement;
    listInput.value = 'Alpha';
    listInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const payload = new FormData(form);

    expect(payload.get('otp')).toBe('7');
    expect(payload.get('tags')).toBe('["Alpha"]');
  });
});
