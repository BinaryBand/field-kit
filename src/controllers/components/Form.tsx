import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@utils';

function normalizeInputValue(element: HTMLInputElement): FormType {
  const type: string =
    element.getAttribute('data-type') ?? element.getAttribute('type') ?? element.type;

  switch (type) {
    case 'checkbox':
    case 'radio':
      return Boolean(element.checked);
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

export function reduceFormData(acc: Map<string, TWFormData>, element: Element): void {
  if (element.hasAttribute('data-tw-array')) {
    const listName: string = element.getAttribute('data-tw-array') ?? 'list';

    const formData: IFormData = new Map();
    const children: Element[] = getChildren(element);
    for (const child of children) {
      reduceFormData(formData, child);
    }

    acc.set(listName, Array.from(formData.values()));
    return;
  }

  if (element.hasAttribute('data-tw-group')) {
    const groupName: string = element.getAttribute('data-tw-group') ?? 'group';
    const formData: IFormData = new Map();
    acc.set(groupName, formData);
    acc = formData;
  }

  const name: string | null = element.getAttribute('name');
  const value: TWFormData | null = normalizeValue(element);
  if (name !== null && value !== null) {
    acc.set(name, value);
  }

  const children: Element[] = getChildren(element);
  for (const child of children) {
    reduceFormData(acc, child);
  }
}

function Form(props: IControllerProps): ReactNode {
  const { children, target } = props;

  function preSubmit(event: TwSubmitEvent): SubmitEvent {
    const { currentTarget } = event;

    if (currentTarget instanceof HTMLFormElement) {
      const formData: IFormData = new Map();
      reduceFormData(formData, currentTarget);
      event.formData = formData;
    }

    return event;
  }

  React.useEffect(() => {
    const onSubmit: ((event: SubmitEvent) => void) | null = target.onsubmit;
    const onSubmitExists: boolean = Boolean(onSubmit);

    if (onSubmitExists) {
      target.onsubmit = (event: SubmitEvent) => onSubmit?.(preSubmit(event));
    } else {
      target.addEventListener('submit', preSubmit);
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
