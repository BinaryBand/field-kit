import { ChangeEvent, SyntheticEvent } from 'react';

export function createNativeEvent<T extends HTMLElement = HTMLElement>(
  type: string,
  target: T,
  bubbles: boolean = true,
  cancelable: boolean = true
): Event {
  const event = new Event(type, { bubbles, cancelable });
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

function createChangeEvent<T extends HTMLInputElement, V>(
  target: HTMLInputElement,
  value: V
): ChangeEvent<T>;
function createChangeEvent<T extends HTMLTextAreaElement>(
  target: T,
  value?: string
): ChangeEvent<T>;
function createChangeEvent<T extends HTMLSelectElement>(target: T, value?: string): ChangeEvent<T>;
function createChangeEvent<T extends HTMLElement & { value: V }, V>(
  target: T,
  value?: V
): ChangeEvent<T> {
  const virtualTarget: T = Object.assign({}, target, {
    value: value ?? target.value,
  });
  const nativeEvent: Event = createNativeEvent('change', virtualTarget);
  const syntheticEvent: SyntheticEvent<T> = createSyntheticEvent(nativeEvent);
  return syntheticEvent as ChangeEvent<T>;
}

export { createChangeEvent };
