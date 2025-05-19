import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  Fragment,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
} from 'react';
import { useDebounce } from 'use-debounce';

import {
  ListInputContainer,
  StyledListInput,
  InputToken,
  HiddenInput,
  StyledOverlay,
} from '@styled/ListInput';

import XIcon from '@/assets/icons/XIcon';

import AppContext from '@providers/AppContext';
import { createChangeEvent, tryParse, useMergedRef } from '@utils';

function ListInput(
  { className, defaultValue, onChange, onKeyDown, style, value, ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const { scrollHeight, scrollWidth, pageWidth, pageHeight } = React.useContext(AppContext);

  const containerRef: MutableRefObject<HTMLDivElement | null> = React.createRef<HTMLDivElement>();
  const internalRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement>();

  const [internalValue, setInternalValue] = React.useState<string>('');
  const [list, setList] = React.useState<string[]>(() => {
    switch (typeof defaultValue) {
      case 'string':
        return tryParse<string[]>(defaultValue) ?? [`${defaultValue}`].filter(Boolean);
      case 'object':
        return Array.isArray(defaultValue) ? defaultValue : [];
      default:
        return [];
    }
  });

  const [debouncedList] = useDebounce(list, 50);

  const [paddingLeft, setPaddingLeft] = React.useState<number>(0);
  const [paddingTop, setPaddingTop] = React.useState<number>(0);

  function clearAll(): void {
    if (onChange !== undefined && internalRef.current !== null) {
      onChange?.(createChangeEvent(internalRef.current, JSON.stringify([])));
    } else {
      setList([]);
      setInternalValue('');
    }
  }

  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setInternalValue(target.value);
  }

  function handleSpecialKey(event: KeyboardEvent<HTMLInputElement>): void {
    let newList: string[] = [...list];

    switch (event.key) {
      case 'Enter':
        setInternalValue('');
        newList.push(internalValue);
        break;
      case 'Backspace':
        setInternalValue(newList.pop() ?? '');
        break;
      default:
        return;
    }

    if (onChange !== undefined && internalRef.current !== null) {
      event.preventDefault();
      onChange(createChangeEvent(internalRef.current, JSON.stringify(newList)));
    } else {
      setList(newList);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (internalValue !== '') {
        handleSpecialKey(event);
      }
    } else if (event.key === 'Backspace' && internalValue === '' && debouncedList.length > 0) {
      handleSpecialKey(event);
    }

    onKeyDown?.(event);
  }

  function handleRemove(i: number): void {
    const updatedList = list.filter((_, j: number) => j !== i);
    if (onChange && internalRef.current) {
      onChange(createChangeEvent(internalRef.current, JSON.stringify(updatedList)));
    } else {
      setList(updatedList);
    }
  }

  React.useEffect((): void => {
    if (containerRef.current && internalRef.current) {
      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();
      const { left: inputLeft, top: inputTop } = internalRef.current.getBoundingClientRect();
      setPaddingLeft(inputLeft - containerLeft);
      setPaddingTop(inputTop - containerTop);
    }
  }, [debouncedList, scrollHeight, scrollWidth, pageWidth, pageHeight]);

  React.useEffect((): void => {
    let newValue: string[];
    switch (typeof value) {
      case 'string':
        newValue = tryParse<string[]>(value) ?? [value].filter(Boolean);
        break;
      case 'object':
        newValue = Array.isArray(value) ? value : [];
        break;
      default:
        newValue = [];
    }

    setList(newValue);
  }, [value]);

  return (
    <Fragment>
      <ListInputContainer className={className} ref={containerRef} style={style}>
        {list.map((item: string, i: number) => (
          <InputToken className="token" key={i}>
            <small>{item}</small>
            <div className="icon-button" onClick={() => handleRemove(i)} role="button">
              <XIcon />
            </div>
          </InputToken>
        ))}

        <HiddenInput readOnly ref={useMergedRef(ref, internalRef)} value={internalValue} />

        <StyledListInput
          {...props}
          className={className}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ ...style, paddingLeft, paddingTop }}
          value={internalValue}
        />
      </ListInputContainer>

      <StyledOverlay target={containerRef}>
        <div className="icon-button" onClick={clearAll} role="button">
          <XIcon />
        </div>
      </StyledOverlay>
    </Fragment>
  );
}

export default React.forwardRef(ListInput);
