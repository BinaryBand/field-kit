import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  MutableRefObject,
  ReactElement,
  ReactNode,
} from 'react';
import { useDebounce } from 'use-debounce';

import { InputToken, StyledListInput, HiddenInput, StyledOverlay } from '@/views/styled/ListInput';
import { SelectInputContainer } from '@/views/styled/SelectInput';
import Dropdown from '@/views/styled/Dropdown';

import CaretDownIcon from '@/assets/native/CaretDownIcon';
import XIcon from '@/assets/native/XIcon';

import AppContext from '@providers/AppContext';
import SelectInputContext from '@providers/SelectInputContext';

import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';
import { tryParse } from '@tools/misc';

function normalizedInputValue(value?: string | number | readonly string[]): string[] {
  switch (typeof value) {
    case 'string':
    case 'number':
      return tryParse<string[]>(value) ?? [`${value}`];
    case 'object':
      return Array.isArray(value) ? value : [];
    default:
      return [];
  }
}

export function SelectOption({
  children,
  group,
  value,
  ...props
}: ComponentProps<'option'> & { group?: string }): ReactElement {
  const { addOption } = React.useContext(SelectInputContext);

  React.useEffect((): void => {
    if (value !== undefined && typeof value === 'string') {
      addOption(value, children ?? value);
    }
  }, [value, children]);

  return <option {...props} children={children} data-group={group} value={value} />;
}

function SelectInput(
  {
    children,
    className,
    'data-placeholder': placeholder,
    defaultValue,
    multiple,
    onChange,
    onKeyDown,
    style,
    value,
    ...props
  }: SelectInputProps,
  ref: ForwardedRef<HTMLSelectElement>
): ReactElement {
  const { pageWidth, pageHeight } = React.useContext(AppContext);

  const containerRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();
  const dropdownRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();
  const inputRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();
  const internalRef: MutableRefObject<HTMLSelectElement | null> =
    React.createRef<HTMLSelectElement | null>();
  const placeholderRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();

  const [internalValue, setInternalValue] = React.useState<string>('');
  const [list, setList] = React.useState<string[]>((): string[] =>
    normalizedInputValue(defaultValue)
  );

  const [debouncedInputValue] = useDebounce(internalValue, 125);
  const [debouncedList] = useDebounce(list, 50);

  const [focused, setFocused] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Record<string, ReactNode>>({});
  const [paddingLeft, setPaddingLeft] = React.useState<number>(0);
  const [paddingTop, setPaddingTop] = React.useState<number>(0);

  const _placeholder: string | undefined = React.useMemo(() => {
    return list.length === 0 ? placeholder : undefined;
  }, [placeholder, list]);

  const activeLabel: string | undefined = React.useMemo((): string | undefined => {
    const activeLabel: unknown = options[debouncedList[0]] ?? debouncedList[0];
    return typeof activeLabel === 'string' ? activeLabel : undefined;
  }, [debouncedList, options]);

  const triggerUpdate = React.useCallback(
    (value: string[]): void => {
      if (onChange && internalRef.current !== null) {
        onChange(createChangeEvent(internalRef.current, value));
      } else {
        setList(value);
      }
    },
    [onChange, internalRef]
  );

  function addOption(key: string, value: ReactNode): void {
    setOptions((prev: Record<string, ReactNode>) => ({ ...prev, [key]: value }));
  }

  function clearAll(): void {
    triggerUpdate([]);
  }

  function handleFocus(): void {
    setFocused(true);
  }

  function handleBlur(): void {
    setFocused(false);
  }

  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setInternalValue(target.value);
  }

  function handleMouseDown({ target }: MouseEvent): void {
    if (target instanceof HTMLOptionElement && !target.disabled) {
      const { value } = target;

      let updatedList: string[];
      if (!multiple) {
        updatedList = [value];
      } else if (!debouncedList.includes(value)) {
        updatedList = [...debouncedList, value];
      } else {
        updatedList = debouncedList.filter((item: string) => item !== value);
      }

      triggerUpdate(updatedList);
    }
  }

  function handleRemove(index: number): void {
    const updatedList: string[] = debouncedList.filter((_, i: number) => i !== index);
    triggerUpdate(updatedList);
  }

  function resize(): void {
    if (containerRef.current !== null && placeholderRef.current !== null) {
      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();
      const { left: inputLeft, top: inputTop } = placeholderRef.current.getBoundingClientRect();
      setPaddingLeft(inputLeft - containerLeft);
      setPaddingTop(inputTop - containerTop);
    }
  }

  React.useEffect((): void => {
    dropdownRef.current?.querySelectorAll('option').forEach((option: HTMLOptionElement) => {
      option.selected = debouncedList.includes(option.value);
    });
  }, [debouncedList]);

  React.useEffect(resize, [debouncedList, pageWidth, pageHeight, debouncedInputValue]);

  React.useEffect((): void => {
    const newValue: string[] = normalizedInputValue(value);
    setList(newValue);
  }, [value]);

  React.useEffect((): void => {
    if (dropdownRef.current !== null) {
      const normalizedInputValue: string = debouncedInputValue.toLowerCase();
      const options: NodeListOf<HTMLOptionElement> =
        dropdownRef.current.querySelectorAll<HTMLOptionElement>('option');

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
    for (const opt of dropdownRef.current?.getElementsByTagName('option') ?? []) {
      opt.setAttribute('data-blurred', 'false');
    }

    if (!multiple) {
      setInternalValue(activeLabel ?? '');
    } else if (multiple) {
      setInternalValue('');
    }
  }, [focused, debouncedList, multiple, options]);

  return (
    <SelectInputContext.Provider value={{ options, addOption }}>
      <SelectInputContainer
        className={className}
        data-multiple={Boolean(multiple)}
        ref={containerRef}
        style={style}
      >
        {list?.map?.((item: string, i: number) => (
          <InputToken className="token" key={i} onClick={() => handleRemove(i)} role="button">
            <small>{options[item] ?? item}</small>
            <XIcon />
          </InputToken>
        ))}

        <HiddenInput readOnly ref={placeholderRef} value={internalValue} />

        <StyledListInput
          className={className}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={_placeholder}
          ref={inputRef}
          style={{ ...style, paddingLeft, paddingTop }}
          value={internalValue}
        />
      </SelectInputContainer>

      <StyledOverlay target={containerRef}>
        <CaretDownIcon aria-expanded={focused || undefined} />
        {multiple && (
          <div className="icon-button" onClick={clearAll} role="button">
            <XIcon />
          </div>
        )}

        <Dropdown
          className={className}
          hidden={!focused}
          onMouseDown={handleMouseDown}
          ref={dropdownRef}
          style={{ ...style, display: 'flex', flexDirection: 'column' }}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectOption) {
              return React.cloneElement(child, {
                'aria-disabled': child.props.disabled ? 'true' : 'false',
              });
            }
            return child;
          })}
          <option className="_tw-no-options" disabled>
            No Options
          </option>
        </Dropdown>
      </StyledOverlay>

      <select
        {...props}
        children={children}
        hidden
        multiple
        ref={useMergedRef(ref, internalRef)}
        value={list}
      />
    </SelectInputContext.Provider>
  );
}

export default React.forwardRef(SelectInput);
