import React, { Fragment, ReactNode } from 'react';
import { tryParse } from '@tools/misc';

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
    const arrayItems: TWFormData[] = [];

    const children: Element[] = getChildren(element);
    for (const child of children) {
      // Check if child is a container (has children or has data-tw-* attributes)
      const childHasChildren = getChildren(child).length > 0;
      const isContainer = childHasChildren || 
                         child.hasAttribute('data-tw-group') || 
                         child.hasAttribute('data-tw-array');
      
      if (isContainer || !child.hasAttribute('name')) {
        // Process as a container - create object for its children
        const itemData: IFormData = {};
        reduceFormData(itemData, child);
        
        // Only add if there's data
        const values = Object.values(itemData);
        if (values.length === 1) {
          arrayItems.push(values[0]);
        } else if (values.length > 1) {
          arrayItems.push(itemData);
        }
      } else {
        // Direct input element - add its value directly
        const value = normalizeValue(child);
        if (value !== null) {
          arrayItems.push(value);
        }
      }
    }
    
    acc[listName] = arrayItems as TWFormData;
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

  function validateRequired(form: HTMLFormElement): { valid: boolean; invalid: HTMLElement[] } {
    const requiredElements: NodeListOf<HTMLElement> = form.querySelectorAll('[required]');
    const invalidFields: HTMLElement[] = [];

    requiredElements.forEach((el) => {
      let valid = true;
      if (el instanceof HTMLInputElement) {
        switch (el.type) {
          case 'checkbox':
            valid = el.checked;
            break;
          case 'radio':
            if (!form.querySelector(`input[name="${el.name}"]:checked`)) {
              valid = false;
            }
            break;
          default:
            valid = el.value.trim().length > 0;
        }
      } else if (el instanceof HTMLTextAreaElement) {
        valid = el.value.trim().length > 0;
      } else if (el instanceof HTMLSelectElement) {
        if (el.multiple) {
          valid = Array.from(el.selectedOptions).length > 0;
        } else {
          valid = el.value.trim().length > 0;
        }
      }
      if (!valid) invalidFields.push(el);
    });

    // Clear previous markers
    form
      .querySelectorAll('[data-tw-invalid]')
      .forEach((el) => el.removeAttribute('data-tw-invalid'));

    if (invalidFields.length) {
      invalidFields.forEach((el) => el.setAttribute('data-tw-invalid', 'true'));
      const invalidEvent = new CustomEvent('twinvalid', {
        bubbles: true,
        cancelable: true,
        detail: { invalidFields },
      });
      form.dispatchEvent(invalidEvent);
      invalidFields[0].focus();
    }

    return { valid: invalidFields.length === 0, invalid: invalidFields };
  }

  function preSubmit(event: TwSubmitEvent): SubmitEvent {
    const { currentTarget } = event;

    if (currentTarget instanceof HTMLFormElement) {
      // Validate BEFORE constructing form data so invalid attempts don't expose data
      const { valid } = validateRequired(currentTarget);
      if (!valid) {
        // Prevent further propagation / handlers
        event.preventDefault();
        // Stop other listeners (like a user-assigned onsubmit after ours)
        // @ts-ignore - stopImmediatePropagation exists on Event
        event.stopImmediatePropagation?.();
        return event; // Do not build formData
      }
      const formData: IFormData = {};
      reduceFormData(formData, currentTarget);
      event.formData = formData;
    }

    return event;
  }

  function formDataToUrlParams(data: IFormData): URLSearchParams {
    const params = new URLSearchParams();

    function addParam(key: string, value: TWFormData): void {
      if (Array.isArray(value)) {
        // Handle arrays by adding multiple parameters with the same name
        value.forEach((item) => {
          if (typeof item === 'object' && item !== null) {
            params.append(key, JSON.stringify(item));
          } else {
            params.append(key, String(item));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Handle objects by JSON stringifying them
        params.append(key, JSON.stringify(value));
      } else {
        // Handle primitive types
        params.append(key, String(value));
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      addParam(key, value);
    });

    return params;
  }

  async function handleSubmit(event: TwSubmitEvent): Promise<TwSubmitEvent> {
    event.preventDefault();

    const { currentTarget, formData } = event;

    if (currentTarget instanceof HTMLFormElement) {
      // At this point required validation already passed in preSubmit
      const method = currentTarget.method.toUpperCase();
      const action = currentTarget.action;

      let response: Response;

      if (method === 'GET' && formData) {
        // For GET requests, append form data to URL as search parameters
        const url = new URL(action);
        const params = formDataToUrlParams(formData);

        // Merge with existing search parameters
        params.forEach((value, key) => {
          url.searchParams.append(key, value);
        });

        response = await fetch(url.toString(), {
          method: 'GET',
        });
      } else {
        // For POST and other methods, send data in body
        response = await fetch(action, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: formData ? JSON.stringify(formData) : undefined,
        });
      }

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
