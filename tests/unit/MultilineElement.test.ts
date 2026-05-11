import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

import MultilineElement from '@/elements/MultilineElement';
import { MULTILINE_TAG, registerFieldkitElements } from '@/elements/register';

describe('MultilineElement', () => {
  beforeAll(() => {
    registerFieldkitElements();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('syncs value attribute to internal textarea', () => {
    const element = document.createElement(MULTILINE_TAG) as MultilineElement;
    element.setAttribute('value', 'hello');
    document.body.appendChild(element);

    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea?.value).toBe('hello');
  });

  it('updates value attribute on user input', () => {
    const element = document.createElement(MULTILINE_TAG) as MultilineElement;
    document.body.appendChild(element);

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'typed value';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    expect(element.getAttribute('value')).toBe('typed value');
  });

  it('sets custom validity when required and empty', () => {
    const element = document.createElement(MULTILINE_TAG) as MultilineElement;
    element.setAttribute('required', '');
    document.body.appendChild(element);

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.checkValidity()).toBe(false);

    element.setAttribute('value', 'ok');
    expect(textarea.checkValidity()).toBe(true);
  });
});
