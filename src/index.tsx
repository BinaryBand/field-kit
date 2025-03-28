/** @jsxImportSource @emotion/react */
import { ReactElement, ReactNode } from 'react';
import ReactDOM, { Root } from 'react-dom/client';

import App from '@/App';
import '@/styles/main.scss';

import InputWrapper from '@inline/InputWrapper';

import ImageInput from '@components/ImageInput';
import ListInput from '@components/ListInput';
import SelectInput, { SelectOption } from '@components/SelectInput';
import Signature from '@components/Signature';

import { FilterGroup, TextFilter } from '@/controllers/components/Filter';

import Calendar from '@/controllers/components/Calendar';
import Multiline from '@/controllers/components/Multiline';

import { createRandomKey } from '@utils';

function classToComponent(children: ReactNode, className: string, element: HTMLElement): ReactNode {
  const key: string = `${className}_${createRandomKey()}`;

  switch (className.toLowerCase()) {
    case 'tw-select-group':
      return (
        <InputWrapper
          children={children}
          component={SelectInput}
          container={element as HTMLSelectElement}
          key={key}
        />
      );
    case 'tw-option':
      const { className, textContent, style, value } = element as HTMLOptionElement;
      return (
        <SelectOption
          children={textContent}
          className={className}
          css={style.cssText}
          key={key}
          value={value}
        />
      );
    case 'tw-calendar-month':
      return <Calendar children={children} element={element} key={key} />;
    case 'tw-auto-resize':
      return <Multiline children={children} element={element} key={key} />;

    case 'tw-filter-group':
      return <FilterGroup children={children} container={element} key={key} />;
    case 'tw-text-filter':
      return <TextFilter target={element as HTMLInputElement} key={key} />;

    default:
      return null;
  }
}

function inputToComponent(element: HTMLInputElement): ReactNode {
  const type: string | null = element.getAttribute('type');
  const key: string = `${type || 'input'}_${createRandomKey()}`;

  switch (type?.toLowerCase()) {
    case 'img':
      return <InputWrapper component={ImageInput} container={element} key={key} />;
    case 'list':
      return <InputWrapper component={ListInput} container={element} key={key} />;
    case 'signature':
      return <InputWrapper component={Signature} container={element} key={key} />;
    default:
      return null;
  }
}

function renderComponents(parent: HTMLElement): ReactNode {
  let reactElement: ReactNode = null;
  if (parent.querySelector('input, [class*="tw-"]') !== null) {
    reactElement = Array.from(parent.children)
      .filter((elem) => elem instanceof HTMLElement)
      .map(renderComponents)
      .filter(Boolean)
      .flat();
  }

  for (const className of Array.from(parent.classList).filter((c) => c.startsWith('tw-'))) {
    const element: ReactNode = classToComponent(reactElement, className, parent);
    element && (reactElement = element);
  }

  if (parent instanceof HTMLInputElement) {
    const inputComponent: ReactNode = inputToComponent(parent);
    inputComponent && (reactElement = [reactElement, inputComponent]);
  }

  return reactElement;
}

export default function init(element: HTMLElement = document.body): void {
  const root: HTMLElement = document.createElement('div');
  const appRoot: Root = ReactDOM.createRoot(root);

  const elements: ReactNode = renderComponents(element);
  const app: ReactElement = <App children={elements} root={root} />;

  appRoot.render(app);
  element.appendChild(root);
}

window.addEventListener('load', (): void => init(document.body));
