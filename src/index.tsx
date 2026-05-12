/** @jsxImportSource @emotion/react */
import { ReactElement, ReactNode } from 'react';
import ReactDOM, { Root } from 'react-dom/client';

import App from '@/App';
import '@/styles/main.scss';

import InputWrapper from '@/bridge/InputWrapper';

import SelectInput, { GroupedOption } from '@components/SelectInput';
import ListInput from '@components/ListInput';
import PasskeyInput from '@components/PasskeyInput';
import PinInput from '@components/PinInput';
import { SelectOption } from '@/ui/Options';
import Signature from '@components/Signature';
import SimpleInput from '@components/SimpleInput';

import Calendar from '@controllers/Calendar';
import { FilterGroup, TextFilter } from '@controllers/Filter';
import Form from '@controllers/Form';
import Multiline from '@controllers/Multiline';
import MultilineElement from '@/elements/MultilineElement';
import PinInputElement from '@/elements/PinInputElement';
import ListInputElement from '@/elements/ListInputElement';
import { registerFieldkitElements } from '@/elements/register';

import { createRandomKey } from '@tools/misc';

function getStableKey(htmlElement: HTMLElement): string {
  return htmlElement.id || htmlElement.dataset.stableId || createRandomKey();
}

function classToComponent(children: ReactNode, className: string, element: HTMLElement): ReactNode {
  const key: string = getStableKey(element);

  switch (className.toLowerCase()) {
    case 'tw-select-group':
      if (element instanceof HTMLSelectElement) {
        return (
          <InputWrapper children={children} component={SelectInput} container={element} key={key} />
        );
      }
      break;
    case 'tw-option':
      if (element instanceof HTMLOptionElement) {
        const { className, disabled, textContent, value } = element;
        const optionValue = typeof value === 'string' ? value : String(value);
        const group = element.getAttribute('data-group') || undefined;

        // Check if the parent select has tw-select-group class
        const parentSelect = element.closest('select');
        const isGroupedSelect = parentSelect?.classList.contains('tw-select-group');

        // Use GroupedOption if parent is grouped select, otherwise use SelectOption
        if (isGroupedSelect) {
          return (
            <GroupedOption
              children={textContent}
              group={group}
              value={optionValue}
              disabled={disabled}
              className={className}
              key={key}
            />
          );
        } else {
          return (
            <SelectOption
              children={textContent}
              value={optionValue}
              disabled={disabled}
              className={className}
              key={key}
            />
          );
        }
      }
      break;
    case 'tw-calendar-month':
      return <Calendar children={children} target={element} key={key} />;
    case 'tw-auto-resize':
      if (element instanceof HTMLTextAreaElement) {
        return <Multiline children={children} target={element} key={key} />;
      }
      break;
    case 'tw-filter-group':
      return <FilterGroup children={children} container={element} key={key} />;
    case 'tw-form':
      return <Form children={children} target={element} key={key} />;
  }
}

function inputToComponent(element: HTMLInputElement): ReactNode {
  const type: string | null = element.getAttribute('type');
  const key: string = getStableKey(element);

  switch (type?.toLowerCase()) {
    case 'filter':
      return <TextFilter target={element} key={key} />;
    case 'passkey':
      const identifier: string = element.getAttribute('data-identifier') ?? '';
      const userName: string | undefined = element.getAttribute('data-user') ?? undefined;
      const props: ISecurityProps = { identifier, userName };
      return <InputWrapper component={PasskeyInput} container={element} {...props} key={key} />;
    case 'signature':
      return <InputWrapper component={Signature} container={element} key={key} />;
    case 'simple':
      return <InputWrapper component={SimpleInput} container={element} key={key} />;
  }
}

export function renderComponents(parent: HTMLElement): ReactNode {
  let reactElement: ReactNode = null;

  // 1. Recursively process children.
  // `reactElement` might become an array of ReactElements or null.
  if (parent.querySelector('input, [class*="tw-"]') !== null) {
    reactElement = Array.from(parent.children)
      .filter((elem) => elem instanceof HTMLElement)
      .map(renderComponents)
      .filter(Boolean)
      .flat();
  }

  // 2. Process 'tw-' classes on the parent element.
  // If a component is returned, it wraps/replaces the current `reactElement` (which represents children).
  for (const className of Array.from(parent.classList).filter((c) => c.startsWith('tw-'))) {
    const element: ReactNode = classToComponent(reactElement, className, parent);
    element && (reactElement = element);
  }

  // 3. Process the parent element if it's an HTMLInputElement.
  // If an input component is created, it's added alongside previously processed elements/children.
  if (parent instanceof HTMLInputElement) {
    const inputComponent: ReactNode = inputToComponent(parent);

    // If `reactElement` already exists, form an array.
    inputComponent && (reactElement = [reactElement, inputComponent]);
  }

  return reactElement;
}

export default function init(element: HTMLElement = document.body): void {
  try {
    registerFieldkitElements();

    const root: HTMLElement = document.createElement('div');
    const appRoot: Root = ReactDOM.createRoot(root);

    const elements: ReactNode = renderComponents(element);
    const app: ReactElement = <App children={elements} root={root} />;

    appRoot.render(app);
    element.appendChild(root);

    let callback: () => void;
    callback = () => {
      element.removeEventListener('update', callback);
      element.removeChild(root);
      appRoot.unmount();

      setTimeout(() => {
        init(element);
      }, 50);
    };

    element.addEventListener('update', callback);
    console.log('TW Components finished initializing.');
  } catch (error) {
    console.error('Error initializing Inline:', error);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', (): void => {
    registerFieldkitElements();
    init(document.body);
  });
}

// Export all components for external usage
export {
  SelectInput,
  GroupedOption,
  ListInput,
  PasskeyInput,
  PinInput,
  SelectOption,
  Signature,
  SimpleInput,
  Calendar,
  FilterGroup,
  TextFilter,
  Form,
  Multiline,
  MultilineElement,
  PinInputElement,
  ListInputElement,
  registerFieldkitElements,
};
