import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@utils';

function convertMapToURLSearchParams(formData: Map<string, FormType>): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          params.append(key, String(item));
        });
      } else {
        params.append(key, String(value));
      }
    }
  }

  return params;
}

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

function normalizeSelectValue(element: HTMLSelectElement): string | string[] | number | number[] {
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

function normalizeValue(element: HTMLElement): FormType | null {
  if (element instanceof HTMLInputElement) {
    return normalizeInputValue(element);
  } else if (element instanceof HTMLTextAreaElement) {
    return normalizeTextAreaValue(element);
  } else if (element instanceof HTMLSelectElement) {
    return normalizeSelectValue(element);
  }

  return null;
}

function Form({ children, target }: IControllerProps): ReactNode {
  function preSubmit(event: TwSubmitEvent): SubmitEvent {
    const { currentTarget } = event;

    if (currentTarget instanceof HTMLFormElement) {
      event.preventDefault();

      const elements: NodeListOf<HTMLElement> = currentTarget.querySelectorAll(
        'input[name],textarea[name],select[name]'
      );

      function formDataReducer(acc: Map<string, FormType>, element: HTMLElement) {
        const name: string | null = element.getAttribute('name');
        const value: FormType | null = normalizeValue(element);

        if (name !== null && value !== null) {
          acc.set(name, value);
        }

        return acc;
      }

      const formData: Map<string, FormType> = [...elements].reduce(formDataReducer, new Map());
      event.formData = formData;
    }

    return event;
  }

  function postSubmit(event: TwSubmitEvent): void {
    const { currentTarget } = event;

    if (currentTarget instanceof HTMLFormElement) {
      const action: string | null = currentTarget.getAttribute('action');
      const method: string = currentTarget.method ?? 'GET';

      const formData: Map<string, FormType> = event.formData ?? new Map<string, FormType>();

      if (action !== null) {
        switch (method.toLowerCase()) {
          case 'get':
            const urlParams: URLSearchParams = convertMapToURLSearchParams(formData);
            document.location.href = `${action}?${urlParams}`;
            break;
          default:
            const formParams: URLSearchParams = convertMapToURLSearchParams(formData);
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open(method, action, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(formParams.toString());
        }
      }
    }
  }

  React.useEffect(() => {
    const onSubmit: ((event: SubmitEvent) => void) | null = target.onsubmit;

    target.onsubmit = (event: SubmitEvent) => onSubmit?.(preSubmit(event));
    target.addEventListener('submit', postSubmit);

    return () => {
      target.onsubmit = onSubmit;
      target.removeEventListener('submit', postSubmit);
    };
  }, []);

  return <Fragment children={children} />;
}

export default Form;
