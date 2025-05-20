import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@utils';

function normalizeInputValue(element: HTMLInputElement): string | string[] | number | boolean {
  const type: string = element.getAttribute('type') ?? element.type;

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
  const type: string = element.getAttribute('type') ?? '';

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
  if (element.hasAttribute('data-tw-list')) {
    const listName: string = element.getAttribute('data-tw-list') ?? 'list';

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
    target.onsubmit = (event: SubmitEvent) => onSubmit?.(preSubmit(event));

    return () => {
      target.onsubmit = onSubmit;
    };
  }, []);

  return <Fragment children={children} />;
}

export default Form;
