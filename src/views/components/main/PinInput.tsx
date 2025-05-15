import React, {
  ClipboardEvent,
  ComponentProps,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  ReactElement,
  RefObject,
} from 'react';
import styled from '@emotion/styled';
import { createChangeEvent } from '@/controllers/utils';

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

interface IPinInputProps {
  size?: number;
}

type PinInputProps = Omit<ComponentProps<'input'>, 'type'> & IPinInputProps;

function PinInput(
  { defaultValue, onChange, onKeyDown, placeholder, size = 6, value, ...props }: PinInputProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const initialized: MutableRefObject<boolean> = React.useRef<boolean>(false);

  const containerRef: RefObject<HTMLSpanElement> = React.useRef<HTMLSpanElement | null>(null);
  const internalRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement | null>(null);

  const [activeIndex, _setActiveIndex] = React.useState<number>(0);
  const [digits, setDigits] = React.useState<(number | undefined)[]>(() =>
    valueToDigits(defaultValue, size)
  );

  const isEmpty: boolean = React.useMemo(
    () => digits.every((digit?: number) => digit === undefined),
    [digits]
  );

  const _placeholder: string | undefined = React.useMemo(
    () => (isEmpty && placeholder) || undefined,
    [isEmpty, placeholder]
  );

  function setActiveIndex(index: number): void {
    const activeIndex: number = Math.max(0, Math.min(size - 1, index));
    _setActiveIndex(activeIndex);
  }

  function setDigit(digit?: number): void {
    if (activeIndex >= 0 && activeIndex < size) {
      digits[activeIndex] = digit;

      if (internalRef.current && onChange) {
        const value: string = digits.map((d) => d ?? '_').join('');
        onChange?.(createChangeEvent(internalRef.current, value));
      } else {
        setDigits([...digits]);
      }
    }
  }

  function handleClick(event: MouseEvent<HTMLInputElement>): void {
    const { currentTarget } = event;
    const datasetIndex: string | undefined = currentTarget.dataset.index;
    const index: number = isValidInteger(datasetIndex) ? Number(datasetIndex) : 0;
    setActiveIndex(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const { currentTarget, key } = event;
    const datasetIndex: string | undefined = currentTarget.dataset.index;
    const index: number = isValidInteger(datasetIndex) ? Number(datasetIndex) : 0;

    switch (key) {
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        setDigit();
        setActiveIndex(index - 1);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        setActiveIndex(index - 1);
        return;
      case 'ArrowRight':
      case 'Tab':
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

  function handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pasteData: string = event.clipboardData.getData('text') ?? '';

    let _activeIndex: number = activeIndex;
    const _digits: (number | undefined)[] = [...digits];

    for (let i: number = _activeIndex; i < pasteData.length && _activeIndex < size; i++) {
      const digit: string = pasteData[i];
      if (isValidDigit(digit)) {
        _digits[_activeIndex] = Number(digit);
        _activeIndex++;
      }
    }

    setActiveIndex(_activeIndex);

    if (internalRef.current && onChange) {
      const value: string = _digits.map((d) => d ?? '_').join('');
      onChange?.(createChangeEvent(internalRef.current, value));
    } else {
      setDigits(_digits);
    }
  }

  React.useEffect((): void => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    const query: string = `input[data-index="${activeIndex}"]`;
    const nextTarget: HTMLInputElement | null =
      containerRef.current?.querySelector<HTMLInputElement>(query) ?? null;

    if (nextTarget) {
      nextTarget.focus();
      nextTarget.select();
    }
  }, [activeIndex]);

  React.useEffect((): void => {
    if (value !== undefined) {
      const digits: (number | undefined)[] = valueToDigits(value, size);
      setDigits(digits);
    }
  }, [value]);

  return (
    <PinInputContainer ref={containerRef}>
      {digits
        .map((digit?: number) => `${digit ?? ''}`)
        .map((digit: string, i: number) => (
          <input
            {...props}
            data-index={i}
            key={i}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={_placeholder?.[i % _placeholder.length]}
            readOnly
            ref={activeIndex === i ? ref : undefined}
            // type="password"
            value={digit}
          />
        ))}

      <input ref={internalRef} {...props} hidden readOnly />
    </PinInputContainer>
  );
}

export default React.forwardRef(PinInput);
