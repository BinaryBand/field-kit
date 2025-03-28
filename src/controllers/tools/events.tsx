import { ChangeEvent, SyntheticEvent } from 'react';
import { applySelectedOptions, tryParse } from '@utils';

export function createNativeEvent<T extends HTMLElement = HTMLElement>(
  type: string,
  target: T,
  bubbles: boolean = true,
  cancelable: boolean = true
): Event {
  const event: Event = new Event(type, { bubbles, cancelable });
  Object.defineProperty(event, 'target', { writable: false, value: target });
  return event;
}

export function createSyntheticEvent<T extends Element, E extends Event = Event>(
  nativeEvent: E
): SyntheticEvent<T, E> {
  let isDefaultPrevented: boolean = false;
  let isPropagationStopped: boolean = false;

  function preventDefault(): void {
    isDefaultPrevented = true;
    nativeEvent.preventDefault();
  }

  function stopPropagation(): void {
    isPropagationStopped = true;
    nativeEvent.stopPropagation();
  }

  return {
    nativeEvent,
    currentTarget: (nativeEvent.currentTarget ?? nativeEvent.target) as EventTarget & T,
    target: (nativeEvent.target ?? nativeEvent.currentTarget) as EventTarget & T,
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    defaultPrevented: nativeEvent.defaultPrevented,
    eventPhase: nativeEvent.eventPhase,
    isTrusted: nativeEvent.isTrusted,
    preventDefault,
    isDefaultPrevented: () => isDefaultPrevented,
    stopPropagation,
    isPropagationStopped: () => isPropagationStopped,
    persist: () => {},
    timeStamp: nativeEvent.timeStamp,
    type: nativeEvent.type,
  };
}

function createChangeEvent<T extends GenericInputElement, V extends boolean | string | string[]>(
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

  const nativeEvent: Event = createNativeEvent('change', target);
  const syntheticEvent: SyntheticEvent<T> = createSyntheticEvent(nativeEvent);
  return syntheticEvent as ChangeEvent<T>;
}

export { createChangeEvent };
