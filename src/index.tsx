/** @jsxImportSource @emotion/react */
import { ComponentProps, ReactElement, ReactNode } from 'react';
import ReactDOM, { Root } from 'react-dom/client';

import App from '@/App';
import '@/styles/main.scss';

import InputWrapper from '@inline/InputWrapper';

import ImageInput from '@components/ImageInput';
import ListInput from '@components/ListInput';
import PasskeyInput from '@components/PasskeyInput';
import PinInput from '@components/PinInput';
import SelectInput, { SelectOption } from '@components/SelectInput';
import Signature from '@components/Signature';

import Calendar from '@/controllers/components/Calendar';
import Form from '@/controllers/components/Form';
import Multiline from '@/controllers/components/Multiline';
import { FilterGroup, TextFilter } from '@/controllers/components/Filter';

import { assert, createRandomKey } from '@utils';

function getStableKey(htmlElement: HTMLElement): string {
  return htmlElement.id || htmlElement.dataset.stableId || createRandomKey();
}

function classToComponent(children: ReactNode, className: string, element: HTMLElement): ReactNode {
  const key: string = getStableKey(element);

  switch (className.toLowerCase()) {
    case 'tw-select-group':
      assert(element instanceof HTMLSelectElement, 'Element is not a select element');
      return (
        <InputWrapper children={children} component={SelectInput} container={element} key={key} />
      );
    case 'tw-option':
      assert(element instanceof HTMLOptionElement, 'Element is not an option element');
      const { className, textContent, style, value } = element;
      const props: ComponentProps<'option'> = { className, value };
      return <SelectOption children={textContent} css={style.cssText} {...props} key={key} />;
    case 'tw-calendar-month':
      return <Calendar children={children} target={element} key={key} />;
    case 'tw-auto-resize':
      return <Multiline children={children} target={element} key={key} />;
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
    case 'img':
      return <InputWrapper component={ImageInput} container={element} key={key} />;
    case 'list':
      return <InputWrapper component={ListInput} container={element} key={key} />;
    case 'passkey':
      const identifier: string = element.getAttribute('data-identifier') ?? '';
      const userName: string | undefined = element.getAttribute('data-user') ?? undefined;
      const props: ISecurityProps = { identifier, userName };
      return <InputWrapper component={PasskeyInput} container={element} {...props} key={key} />;
    case 'pin':
      const size: number | undefined = Number(element.getAttribute('data-size')) ?? undefined;
      return <InputWrapper component={PinInput} container={element} size={size} key={key} />;
    case 'signature':
      return <InputWrapper component={Signature} container={element} key={key} />;
  }
}

function renderComponents(parent: HTMLElement): ReactNode {
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
    const root: HTMLElement = document.createElement('div');
    const appRoot: Root = ReactDOM.createRoot(root);

    const elements: ReactNode = renderComponents(element);
    const app: ReactElement = <App children={elements} root={root} />;

    appRoot.render(app);
    element.appendChild(root);
  } catch (error) {
    console.error('Error initializing Inline:', error);
  }
}

window.addEventListener('load', (): void => init(document.body));
