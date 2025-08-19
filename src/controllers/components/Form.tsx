import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@utils';

function normalizeInputValue(element: HTMLInputElement): FormType {
  const type: string =
    element.getAttribute('data-type') ?? element.getAttribute('type') ?? element.type;

  switch (type) {
    case 'checkbox':
      return Boolean(element.checked);
    case 'radio':
      return element.value;
    case 'number':
      return parseInt(element.value) || 0;
    case 'list':
      return tryParse<string[]>(element.value) ?? [];
    default:
      return element.value;
  }
}

function normalizeTextAreaValue(element: HTMLTextAreaElement): string {
  return element.value;
}

function normalizeSelectValue(element: HTMLSelectElement): TWFormData {
  const type: string = element.getAttribute('data-type') || element.getAttribute('type') || '';

  const normalizeValue = (val: string) => {
    switch (type) {
      case 'number':
        return parseInt(val) || 0;
      case 'list':
        return tryParse<string[]>(val) ?? [];
      default:
        return val;
    }
  };

  if (element.multiple) {
    return Array.from(element.selectedOptions)
      .map((opt: HTMLOptionElement) => opt.value)
      .map(normalizeValue) as string[] | number[];
  }

  return normalizeValue(element.value);
}

function normalizeValue(element: Element): TWFormData | null {
  if (element instanceof HTMLInputElement) {
    return normalizeInputValue(element);
  } else if (element instanceof HTMLTextAreaElement) {
    return normalizeTextAreaValue(element);
  } else if (element instanceof HTMLSelectElement) {
    return normalizeSelectValue(element);
  }

  return null;
}

function getChildren(element: Element): Element[] {
  return Array.from(element.children).filter((e) => e instanceof Element);
}

export function reduceFormData(acc: Record<string, TWFormData>, element: Element): void {
  // 1. Process Group/Array first
  if (element.hasAttribute('data-tw-group')) {
    const groupName: string = element.getAttribute('data-tw-group') ?? 'group';
    const formData: IFormData = {};
    acc[groupName] = formData;

    // Recursively process children and store in the new group object
    const children: Element[] = getChildren(element);
    for (const child of children) {
      reduceFormData(formData, child);
    }
    return; // Exit here to prevent processing children again
  }

  if (element.hasAttribute('data-tw-array')) {
    const listName: string = element.getAttribute('data-tw-array') ?? 'list';
    const formData: IFormData = {};

    const children: Element[] = getChildren(element);
    for (const child of children) {
      reduceFormData(formData, child);
    }
    acc[listName] = Array.from(Object.values(formData));
    return; // Exit here to prevent processing children again
  }

  // 2. Process individual element only if it has a name
  const name: string | null = element.getAttribute('name');
  if (name !== null) {
    const value: TWFormData | null = normalizeValue(element);

    // Special handling for unchecked radio buttons.
    // This logic ensures that only the checked radio button is considered.
    // If the name already exists, and the current element is an unchecked radio, skip it.
    if (element instanceof HTMLInputElement && element.type === 'radio' && !element.checked) {
      if (acc[name] !== undefined) {
        return;
      }
    }

    if (value !== null) {
      acc[name] = value;
    }
  }

  // 3. Continue recursion for children without custom attributes
  const children: Element[] = getChildren(element);
  for (const child of children) {
    // Pass the same accumulator down for non-group/array elements
    reduceFormData(acc, child);
  }
}

function Form(props: IControllerProps): ReactNode {
  const { children, target } = props;

  function preSubmit(event: TwSubmitEvent): SubmitEvent {
    const { currentTarget } = event;

    if (currentTarget instanceof HTMLFormElement) {
      const formData: IFormData = {};
      reduceFormData(formData, currentTarget);
      event.formData = formData;
    }

    return event;
  }

  async function handleSubmit(event: TwSubmitEvent): Promise<TwSubmitEvent> {
    event.preventDefault();

    const { currentTarget, formData } = event;

    if (currentTarget instanceof HTMLFormElement) {
      const response = await fetch(currentTarget.action, {
        method: currentTarget.method,
        headers: { 'Content-Type': 'application/json' },
        body: formData ? JSON.stringify(formData) : undefined,
      });

      if (response.type === 'opaqueredirect') {
        window.location.href = response.url;
      } else if (response.type === 'basic' || response.type === 'cors') {
        window.location.href = response.url;
      } else {
        window.location.reload();
      }
    }

    return event;
  }

  React.useEffect(() => {
    const onSubmit: ((event: SubmitEvent) => void) | null = target.onsubmit;
    const onSubmitExists: boolean = Boolean(onSubmit);

    if (onSubmitExists) {
      target.onsubmit = (event: SubmitEvent) => onSubmit?.(preSubmit(event));
    } else {
      target.addEventListener('submit', (event: SubmitEvent) => {
        event = preSubmit(event);
        handleSubmit(event);
      });
    }

    return () => {
      if (onSubmitExists) {
        target.onsubmit = onSubmit;
      } else {
        target.removeEventListener('submit', preSubmit);
      }
    };
  }, [target]);

  return <Fragment children={children} />;
}

export default Form;
