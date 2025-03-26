import React, { ChangeEvent, ComponentProps, ReactNode, SyntheticEvent } from 'react';
import Wrapper from '@inline/Wrapper';

function InputWrapper<T extends 'input'>(props: OverloadedInputWrapperProps<T>): ReactNode;
function InputWrapper<T extends 'select'>(props: OverloadedInputWrapperProps<T>): ReactNode;
function InputWrapper<T extends 'textarea'>(props: OverloadedInputWrapperProps<T>): ReactNode;
function InputWrapper<T extends 'input' | 'select' | 'textarea'>(
  props: WrapperProps<T>
): ReactNode {
  const [internalValue, setInternalValue] = React.useState<string>(
    `${props.container.value ?? ''}`
  );

  function handleChangeEvent(event: ChangeEvent<HTMLElement>): void {
    if (event.currentTarget instanceof HTMLInputElement) {
      props.container.value = event.currentTarget.value;
      handleEvent(event);
    } else if (event.currentTarget instanceof HTMLTextAreaElement) {
      props.container.value = event.currentTarget.value;
      handleEvent(event);
    } else if (event.currentTarget instanceof HTMLSelectElement) {
      console.log(event.currentTarget.selectedOptions);

      // handleEvent(event);
    }
  }

  function handleEvent({ currentTarget, type, ...event }: SyntheticEvent<HTMLElement>): void {
    const nativeEvent: CustomEvent = new CustomEvent(type, event);
    props.container.dispatchEvent(nativeEvent);
  }

  const nativeChangeMemo = React.useMemo(
    () => (): void => setInternalValue(props.container.value),
    []
  );

  React.useEffect((): (() => void) => {
    props.container.addEventListener('change', nativeChangeMemo);
    return () => props.container.removeEventListener('change', nativeChangeMemo);
  }, [props.container, nativeChangeMemo]);

  const baseProps: ComponentProps<T> = {
    disabled: props.container.disabled,
    value: internalValue,
    onChange: handleChangeEvent,
    onClick: handleEvent,
    onInput: handleEvent,
    onKeyUp: handleEvent,
    onKeyDown: handleEvent,
  } as ComponentProps<T>;

  if (props.container instanceof HTMLSelectElement) {
    const values: string[] = Array.from(props.container.selectedOptions).map(({ value }) => value);

    const selectProps: ComponentProps<'select'> = {
      multiple: props.container.multiple,
      value: values,
    };

    return <Wrapper {...baseProps} {...selectProps} {...props} />;
  }

  const { placeholder, readOnly } = props.container;
  const textProps: ComponentProps<'input' | 'textarea'> = {
    placeholder,
    readOnly,
  };

  if (props.container instanceof HTMLInputElement) {
    const { type } = props.container;
    const inputProps: ComponentProps<'input'> = { type };
    return <Wrapper {...baseProps} {...textProps} {...inputProps} {...props} />;
  }

  return <Wrapper {...baseProps} {...textProps} {...props} />;
}

export default InputWrapper;
