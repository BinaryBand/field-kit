import React, {
  ChangeEvent,
  ClipboardEvent,
  ComponentProps,
  FocusEvent,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefObject,
} from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';

export interface PinInputProps extends ComponentProps<'input'> {
  size?: number;
  autoFocus?: boolean;
}

const PinInputContainer: StyledComponent<ComponentProps<'span'>> = styled.span`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin: 0 auto;

  input {
    min-width: 0;
    padding: 10px 8px;
    text-align: center;
  }
`;

function isValidDigit(digit: unknown): boolean {
  if (typeof digit !== 'string') return false;
  return /^\d$/.test(digit);
}

function isValidInteger(integer: unknown): boolean {
  if (typeof integer !== 'string') return false;
  return /^\d+$/.test(integer);
}

function valueToDigits(
  value: string | number | readonly string[] = '',
  size: number
): (number | undefined)[] {
  const outValue: (number | undefined)[] = Array(size).fill(undefined);
  switch (typeof value) {
    case 'number':
    case 'string':
      for (let i: number = 0; i < size; i++) {
        const curr: string = `${value}`[i];
        outValue[i] = isValidDigit(curr) ? Number(curr) : undefined;
      }
      return outValue;
    case 'object':
      if (Array.isArray(value) && value.every(isValidDigit)) {
        return value.map(Number);
      }
  }

  return Array(size).fill(undefined);
}

function PinInput(
  {
    autoFocus = false,
    defaultValue,
    onChange,
    onKeyDown,
    size = 6,
    value,
    ...props
  }: PinInputProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const containerRef: RefObject<HTMLSpanElement> = React.useRef<HTMLSpanElement | null>(null);
  const internalRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement | null>(null);

  const [activeIndex, _setActiveIndex] = React.useState<number>(0);
  const [hasInteracted, setHasInteracted] = React.useState<boolean>(false);
  const [pinValue, setPinValue] = React.useState<(number | undefined)[]>(() =>
    valueToDigits(defaultValue, size)
  );

  const refs: RefObject<HTMLInputElement>[] = React.useRef(
    Array.from({ length: size }, () => React.createRef<HTMLInputElement>())
  ).current;

  const placeholder: string = props.placeholder ?? '0'.repeat(size);

  function focusOn(index: number): void {
    const targetRef: RefObject<HTMLInputElement> = refs[index];
    if (targetRef?.current) {
      targetRef.current.focus();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { currentTarget } = event;
    const { index } = currentTarget.dataset;

    const newDigit: string = currentTarget.value[0];

    if (!newDigit) {
      // Clear the current digit and keep the focus
      const newValue = pinValue.map((d, i) => (i === Number(index) ? undefined : d));
      setPinValue(newValue);
    } else if (isValidDigit(newDigit)) {
      const newValue = pinValue.map((d, i) => (i === Number(index) ? Number(newDigit) : d));
      setPinValue(newValue);
      if (Number(index) < size - 1) {
        focusOn(Number(index) + 1);
      }
    }
  }

  function setActiveIndex(index: number): void {
    const activeIndex: number = Math.max(0, Math.min(size - 1, index));
    _setActiveIndex(activeIndex);
  }

  function setDigit(digit?: number): void {
    if (activeIndex >= 0 && activeIndex < size) {
      pinValue[activeIndex] = digit;

      if (internalRef.current && onChange) {
        const value: string = pinValue.map((d) => d ?? ' ').join('');
        onChange?.(createChangeEvent(internalRef.current, value));
      } else {
        setPinValue([...pinValue]);
      }
    }
  }

  function handleClick(event: MouseEvent<HTMLInputElement>): void {
    const { currentTarget } = event;
    const datasetIndex: string | undefined = currentTarget.dataset.index;
    const index: number = isValidInteger(datasetIndex) ? Number(datasetIndex) : 0;
    setHasInteracted(true);
    setActiveIndex(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const { currentTarget, key } = event;
    const datasetIndex: string | undefined = currentTarget.dataset.index;
    const index: number = isValidInteger(datasetIndex) ? Number(datasetIndex) : 0;

    switch (key) {
      case 'Backspace':
        event.preventDefault();
        setDigit();
        setActiveIndex(index - 1);
        return;
      case 'Delete':
        event.preventDefault();
        setDigit();
        return;
      case 'ArrowLeft':
        event.preventDefault();
        setActiveIndex(index - 1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        setActiveIndex(index + 1);
        return;
    }

    if (isValidDigit(key)) {
      event.preventDefault();
      const digit: number = Number(key);
      setDigit(digit);
      setActiveIndex(index + 1);
    }

    onKeyDown?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    const { currentTarget } = event;
    const datasetIndex: string | undefined = currentTarget.dataset.index;
    const index: number = isValidInteger(datasetIndex) ? Number(datasetIndex) : 0;
    setHasInteracted(true);
    setActiveIndex(index);
  }

  function handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    const dataToPaste: string = event.clipboardData.getData('text') ?? '';
    const _pinValue: (number | undefined)[] = [...pinValue];

    let j: number = activeIndex;
    for (let i: number = 0; i < dataToPaste.length && j < size; i++) {
      const digit: string = dataToPaste[i];
      if (isValidInteger(digit)) {
        _pinValue[j] = Number(digit);
        j++;
      }
    }

    setActiveIndex(j);

    if (internalRef.current && onChange) {
      const value: string = _pinValue.map((d) => d ?? '_').join('');
      onChange?.(createChangeEvent(internalRef.current, value));
    } else {
      setPinValue(_pinValue);
    }
  }

  React.useEffect((): void => {
    // Only auto-focus if autoFocus is enabled or user has already interacted with the component
    if (!autoFocus && !hasInteracted) {
      return;
    }

    const query: string = `input[data-index="${activeIndex}"]`;
    const nextTarget: HTMLInputElement | null =
      containerRef.current?.querySelector<HTMLInputElement>(query) ?? null;

    if (nextTarget !== null) {
      nextTarget.focus();
      nextTarget.select();
    }
  }, [activeIndex, autoFocus, hasInteracted]);

  React.useEffect((): void => {
    if (value !== undefined) {
      const digits: (number | undefined)[] = valueToDigits(value, size);
      setPinValue(digits);
    }
  }, [value]);

  return (
    <PinInputContainer data-testid="pin-input" ref={containerRef}>
      {pinValue
        .map((digit?: number) => `${digit ?? ''}`)
        .map((digit: string, i: number) => (
          <input
            {...props}
            data-index={i}
            key={i}
            maxLength={1}
            onChange={handleInputChange}
            onClick={handleClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder[i]}
            readOnly
            ref={refs[i]}
            value={digit}
          />
        ))}

      <input ref={useMergedRef(ref, internalRef)} {...props} hidden readOnly />
    </PinInputContainer>
  );
}

export default React.forwardRef(PinInput);
