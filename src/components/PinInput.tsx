import React, {
  ChangeEvent,
  ClipboardEvent,
  ComponentProps,
  FocusEvent,
  ForwardedRef,
  KeyboardEvent,
  ReactElement,
  RefObject,
} from 'react';
import styled from '@emotion/styled';
import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';
export interface PinInputProps extends ComponentProps<'input'> {
  size?: number;
  autoFocus?: boolean;
}

const PinInputContainer = styled.span`
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
  const containerRef: RefObject<HTMLSpanElement | null> = React.useRef<HTMLSpanElement>(null);
  const internalRef: RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const [pinValue, setPinValue] = React.useState<(number | undefined)[]>(() =>
    valueToDigits(defaultValue, size)
  );

  const refs: RefObject<HTMLInputElement | null>[] = React.useRef(
    Array.from({ length: size }, () => React.createRef<HTMLInputElement>())
  ).current;

  const placeholder: string = props.placeholder ?? '0'.repeat(size);

  function focusOn(index: number): void {
    refs[Math.max(0, Math.min(size - 1, index))]?.current?.focus();
  }

  function commitValue(next: (number | undefined)[]): void {
    if (internalRef.current && onChange) {
      const str = next.map((d) => d ?? ' ').join('');
      onChange(createChangeEvent(internalRef.current, str));
    } else {
      setPinValue([...next]);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { currentTarget } = event;
    const index = Number(currentTarget.dataset.index);
    const newDigit = currentTarget.value[0];

    if (!newDigit) {
      const next = pinValue.map((d, i) => (i === index ? undefined : d));
      setPinValue(next);
    } else if (isValidDigit(newDigit)) {
      const next = pinValue.map((d, i) => (i === index ? Number(newDigit) : d));
      setPinValue(next);
      focusOn(index + 1);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const index = Number(event.currentTarget.dataset.index);

    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        pinValue[index] = undefined;
        commitValue(pinValue);
        focusOn(index - 1);
        return;
      case 'Delete':
        event.preventDefault();
        pinValue[index] = undefined;
        commitValue(pinValue);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        focusOn(index - 1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        focusOn(index + 1);
        return;
    }

    if (isValidDigit(event.key)) {
      event.preventDefault();
      pinValue[index] = Number(event.key);
      commitValue(pinValue);
      focusOn(index + 1);
    }

    onKeyDown?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    event.currentTarget.select();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();
    const startIndex = Number(event.currentTarget.dataset.index);
    const dataToPaste = event.clipboardData.getData('text') ?? '';
    const next: (number | undefined)[] = [...pinValue];

    let j = startIndex;
    for (let i = 0; i < dataToPaste.length && j < size; i++) {
      if (isValidInteger(dataToPaste[i])) {
        next[j++] = Number(dataToPaste[i]);
      }
    }

    commitValue(next);
    focusOn(j);
  }

  React.useEffect((): void => {
    if (value !== undefined) {
      setPinValue(valueToDigits(value, size));
    }
  }, [value]);

  return (
    <PinInputContainer data-testid="pin-input" ref={containerRef}>
      {pinValue
        .map((digit?: number) => `${digit ?? ''}`)
        .map((digit: string, i: number) => (
          <input
            {...props}
            autoFocus={autoFocus && i === 0}
            data-index={i}
            key={i}
            maxLength={1}
            onChange={handleInputChange}
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
