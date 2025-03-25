import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  ReactElement,
} from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import { createChangeEvent, useMergedRef } from '@utils';
import { useDebounce } from 'use-debounce';

import Overlay from '@inline/Overlay';

// import { StyledToken } from './ListInput';

// import ClearIconUrl from '@/assets/icons/x.svg';

const StyledInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  &:not(:focus) + div {
    display: none;
  }
`;

const Dropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
  background-color: white;
  border: 1px solid var(--bs-gray-300, #d0d0d7);
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 5;

  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;

  option {
    padding: 4px 6px;
    &:hover:not(:disabled) {
      background-color: var(--bs-gray-300, #d0d0d7);
    }

    &[value=''] {
      display: none;
    }
  }

  &:not([data-prevent-filter]) {
    & > option[data-blurred='true']:not(._tw-no-options) {
      display: none;
    }
  }
`;

function SelectInput(
  {
    children,
    className,
    defaultValue,
    multiple,
    onChange,
    style,
    value,
    ...props
  }: ComponentProps<'select'>,
  ref: ForwardedRef<HTMLSelectElement>
): ReactElement {
  const dropdownRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();
  const inputRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();
  const internalRef: MutableRefObject<HTMLSelectElement | null> =
    React.createRef<HTMLSelectElement | null>();

  const [inputValue, setInputValue] = React.useState<string>('');
  const [internalValue, setInternalValue] = React.useState<string>(`${defaultValue ?? ''}`);
  const [preventFilter, setPreventFilter] = React.useState<boolean>(true);

  const [debouncedInputValue] = useDebounce(inputValue, 150);

  function changeOption(option: HTMLOptionElement): void {
    setInternalValue(option.value);
    setInputValue(option.textContent ?? '');
    setPreventFilter(true);

    if (internalRef.current) {
      onChange?.(createChangeEvent(internalRef.current, option.value));
    }
  }

  function handleInputChange({ currentTarget }: ChangeEvent<HTMLInputElement>): void {
    setInputValue(currentTarget.value);
    setPreventFilter(false);
  }

  function handleKeyEvent(event: KeyboardEvent<HTMLInputElement>): void {
    if (dropdownRef.current !== null) {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault();

          const options: NodeListOf<HTMLOptionElement> =
            dropdownRef.current.querySelectorAll<HTMLOptionElement>('option.tw-option');
          const activeIndex: number = Array.from(options).findIndex(
            (elem: HTMLOptionElement) => elem.selected
          );

          const direction: number = event.key === 'ArrowUp' ? -1 : 1;
          const selected: HTMLOptionElement = options.item(
            (activeIndex + direction + options.length) % options.length
          );
          changeOption(selected);
          break;
        case 'Enter':
          event.preventDefault();

          const selected2: HTMLOptionElement | null =
            dropdownRef.current.querySelector<HTMLOptionElement>('option.tw-option[selected]');
          selected2 && changeOption(selected2);
          inputRef.current?.blur();
          break;
      }
    }
  }

  function handleMouseDown({ target }: MouseEvent<HTMLDivElement>): void {
    if (target instanceof HTMLOptionElement) {
      changeOption(target);
    }
  }

  React.useEffect((): void => {
    if (dropdownRef.current !== null) {
      const normalizedInputValue: string = debouncedInputValue.toLowerCase();
      const options: NodeListOf<HTMLOptionElement> =
        dropdownRef.current.querySelectorAll<HTMLOptionElement>('option.tw-option');

      for (let i: number = 0; i < options.length; i++) {
        const option: HTMLOptionElement | null = options.item(i);

        const hidden: boolean =
          !option.textContent?.toLowerCase().includes(normalizedInputValue) &&
          !option.value?.toLowerCase().includes(normalizedInputValue);

        option.setAttribute('data-blurred', hidden ? 'true' : 'false');
      }
    }
  }, [debouncedInputValue]);

  React.useEffect((): void => {
    if (internalRef.current !== null) {
      internalRef.current.value = internalValue;

      const inputValue: string =
        internalRef.current.querySelector(`option[value="${internalValue}"]`)?.textContent ??
        internalRef.current.options[0]?.textContent ??
        '';

      setInputValue(inputValue);
    }

    if (dropdownRef.current !== null) {
      const options: HTMLCollectionOf<HTMLOptionElement> =
        dropdownRef.current.getElementsByTagName('option');

      for (let i: number = 0; i < options.length; i++) {
        const option: HTMLOptionElement | null = options.item(i);
        option?.toggleAttribute('selected', option.value === internalValue);
      }
    }
  }, [internalValue]);

  React.useEffect((): void => {
    setInternalValue(`${value ?? ''}`);
  }, [value]);

  return (
    <Fragment>
      <StyledInput
        className={className}
        onChange={handleInputChange}
        onKeyDown={handleKeyEvent}
        ref={inputRef}
        style={style}
        type="text"
        value={inputValue}
      />

      <Overlay target={inputRef}>
        <Dropdown
          className={className}
          data-prevent-filter={preventFilter || undefined}
          onMouseDown={handleMouseDown}
          ref={dropdownRef}
          style={style}
        >
          <Fragment children={children} />
          <option className="_tw-no-options" disabled>
            No Options
          </option>
        </Dropdown>
      </Overlay>

      <select {...props} children={children} hidden ref={useMergedRef(ref, internalRef)} />
    </Fragment>
  );
}

export default React.forwardRef(SelectInput);
