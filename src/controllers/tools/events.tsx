import { ChangeEvent } from 'react';
import { applySelectedOptions } from './inputs';
import { tryParse } from './misc';

export function createNativeEvent<T extends HTMLElement = HTMLElement>(
  type: string,
  target: T,
  bubbles = true,
  cancelable = true
): Event {
  const event = new Event(type, { bubbles, cancelable });
  Object.defineProperty(event, 'target', { writable: false, value: target });
  return event;
}

function createChangeEvent<T extends NativeInputElement, V extends boolean | string | string[]>(
  target: T,
  value?: V
): ChangeEvent<T> {
  if (target instanceof HTMLInputElement) {
    target.checked = Boolean(value) ?? target.checked ?? false;
    target.value = `${value ?? target.value ?? ''}`;
  } else if (target instanceof HTMLTextAreaElement) {
    target.value = `${value ?? target.value ?? ''}`;
  } else if (target instanceof HTMLSelectElement) {
    const values: string[] = Array.isArray(value) ? value : (tryParse(value) ?? []);
    applySelectedOptions(target, values);
  }

  const nativeEvent = createNativeEvent('change', target);
  return { currentTarget: target, target, type: 'change', nativeEvent } as unknown as ChangeEvent<T>;
}

export { createChangeEvent };
