// import React, { Fragment, ReactNode } from 'react';
// import { tryParse } from '@utils';

// function normalizeInputValue(element: HTMLInputElement): string | string[] | number | boolean {
//   const type: string = element.getAttribute('type') ?? element.type;

//   switch (type) {
//     case 'checkbox':
//     case 'radio':
//       return Boolean(element.checked);
//     case 'number':
//       return parseInt(element.value) || 0;
//     case 'list':
//       return tryParse<string[]>(element.value) ?? [];
//     default:
//       return element.value;
//   }
// }

// function normalizeTextAreaValue(element: HTMLTextAreaElement): string {
//   return element.value;
// }

// function normalizeSelectValue(element: HTMLSelectElement): string | string[] | number | number[] {
//   const type: string = element.getAttribute('type') ?? '';

//   const normalizeValue = (val: string) => {
//     switch (type) {
//       case 'number':
//         return parseInt(val) || 0;
//       case 'list':
//         return tryParse<string[]>(val) ?? [];
//       default:
//         return val;
//     }
//   };

//   if (element.multiple) {
//     return Array.from(element.selectedOptions)
//       .map((opt: HTMLOptionElement) => opt.value)
//       .map(normalizeValue) as string[] | number[];
//   }

//   return normalizeValue(element.value);
// }

// function normalizeValue(element: HTMLElement): FormType | null {
//   if (element instanceof HTMLInputElement) {
//     return normalizeInputValue(element);
//   } else if (element instanceof HTMLTextAreaElement) {
//     return normalizeTextAreaValue(element);
//   } else if (element instanceof HTMLSelectElement) {
//     return normalizeSelectValue(element);
//   }

//   return null;
// }

// function reduceFormData(acc: Map<string, FormType>, element: HTMLElement) {
//   if (element.hasAttribute('data-group-name')) {
//     const groupName: string = element.getAttribute('data-group-name')!;

//     acc.set(groupName, 'test');

//     return acc;
//   }

//   const name: string | null = element.getAttribute('name');
//   const value: FormType | null = normalizeValue(element);

//   if (name !== null && value !== null) {
//     acc.set(name, value);
//   }

//   return acc;
// }

// function Form({ children, target }: IControllerProps): ReactNode {
//   function preSubmit(event: TwSubmitEvent): SubmitEvent {
//     const { currentTarget } = event;

//     if (currentTarget instanceof HTMLFormElement) {
//       const elements: NodeListOf<HTMLElement> = currentTarget.querySelectorAll(
//         '[name]:is(input,textarea,select), [data-group-name]'
//       );

//       const formData: Map<string, FormType> = [...elements].reduce(reduceFormData, new Map());
//       event.formData = formData;
//     }

//     return event;
//   }

//   React.useEffect(() => {
//     const onSubmit: ((event: SubmitEvent) => void) | null = target.onsubmit;
//     target.onsubmit = (event: SubmitEvent) => onSubmit?.(preSubmit(event));

//     return () => {
//       target.onsubmit = onSubmit;
//     };
//   }, []);

//   return <Fragment children={children} />;
// }

// export default Form;

import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@utils';

type FormType = string | string[] | number | number[] | boolean;
type IFormData = Map<string, FormType> | FormType[];
type FormData = FormType | IFormData;

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

function normalizeSelectValue(element: HTMLSelectElement): FormData {
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

function normalizeValue(element: Element): FormData | null {
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

function reduceFormData(acc: Map<string, FormData>, element: Element): void {
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
  const value: FormData | null = normalizeValue(element);
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
