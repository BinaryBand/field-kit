import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  Fragment,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
} from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import { useDebounce } from 'use-debounce';

import Overlay from '@inline/Overlay';
import AppContext from '@providers/AppContext';
import ClearIconUrl from '@/assets/icons/x.svg';
import { createChangeEvent, tryParse, useMergedRef } from '@utils';

export const ListInputContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  background: none;
  border: transparent;
  padding: 1px 2px;

  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  gap: 0.25em;
`;

export const StyledInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  pointer-events: none;
  visibility: hidden;
`;

const StyledReference: StyledComponent<ComponentProps<'input'>> = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  padding-left: ${(props) => props.style?.paddingLeft ?? 0}px !important;
  padding-top: ${(props) => props.style?.paddingTop ?? 0}px !important;
  margin: 0 !important;
`;

export const StyledToken: StyledComponent<ComponentProps<'div'>> = styled.div`
  align-items: center;
  border: 1px solid;
  border-radius: 12px;
  display: flex;
  gap: 0.3em;
  padding: 0.1em 0.5em;
  position: relative;
  z-index: 3;

  &._tw-placeholder-token {
    pointer-events: none;
    visibility: hidden;
  }
`;

const StyledOverlay: StyledComponent<OverlayProps> = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;

  gap: 0.5em;
  padding-right: 0.5em;
`;

function ListInput(
  { className, defaultValue, onChange, onKeyDown, style, value, ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const { scrollHeight, scrollWidth, pageWidth, pageHeight } = React.useContext(AppContext);

  const containerRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();
  const internalRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();

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
    if (event.key === 'Enter' && internalValue !== '') {
      handleSpecialKey(event);
    } else if (event.key === 'Backspace' && internalValue === '' && debouncedList.length > 0) {
      handleSpecialKey(event);
    }

    onKeyDown?.(event);
  }

  function handleRemove(i: number): void {
    const updatedList: string[] = debouncedList.filter((_, j: number) => j !== i);
    if (onChange !== undefined && internalRef.current !== null) {
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
          <StyledToken className="token" key={i}>
            <small>{item}</small>
            <div className="icon-button" onClick={() => handleRemove(i)} role="button">
              <img src={ClearIconUrl} />
            </div>
          </StyledToken>
        ))}

        <StyledInput readOnly ref={useMergedRef(ref, internalRef)} value={internalValue} />

        <StyledReference
          {...props}
          className={className}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ ...style, paddingLeft, paddingTop }}
          value={internalValue}
        />
      </ListInputContainer>

      <StyledOverlay target={containerRef}>
        <img onClick={clearAll} role="button" src={ClearIconUrl} />
      </StyledOverlay>
    </Fragment>
  );
}

export default React.forwardRef(ListInput);
