import React, { ChangeEvent, ComponentProps, JSX, ReactNode, SyntheticEvent } from 'react';
import Wrapper from '@/views/components/inline/Wrapper';
import { applySelectedOptions, getSelectedOptionValues } from '@tools/inputs';

function InputWrapper<T extends InputTags, P extends JSX.IntrinsicAttributes>(
  props: InputWrapperProps<T, P>
): ReactNode {
  const { container } = props;
  const isInput = container instanceof HTMLInputElement;
  const isSelect = container instanceof HTMLSelectElement;

  const [value, setValue] = React.useState<string>(container?.value ?? '');
  const [checked, setChecked] = React.useState<boolean>(isInput && container.checked);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(() =>
    isSelect ? getSelectedOptionValues(container) : []
  );

  function handleChangeEvent(event: ChangeEvent<NativeInputElement>): void {
    const { currentTarget } = event;
    container.value = currentTarget.value ?? '';

    if (isInput) {
      container.checked = Boolean(event.currentTarget.checked);
    } else if (isSelect && currentTarget instanceof HTMLSelectElement) {
      const values: string[] = getSelectedOptionValues(currentTarget);
      applySelectedOptions(container, values);
    }

    handleEvent(event);
  }

  function handleEvent(event: SyntheticEvent<HTMLElement>): void {
    const eventInit: CustomEventInit = {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      detail: { syntheticEvent: event },
    };

    const nativeEvent: CustomEvent = new CustomEvent(event.type, eventInit);
    container.dispatchEvent(nativeEvent);
  }

  const nativeChangeMemo = React.useMemo(
    () => (): void => {
      setValue(container.value);

      if (isInput) {
        setChecked(container.checked);
      } else if (isSelect) {
        const values: string[] = getSelectedOptionValues(container);
        setSelectedOptions(values);
      }
    },
    [container]
  );

  React.useEffect((): (() => void) => {
    container.addEventListener('change', nativeChangeMemo);
    return () => container.removeEventListener('change', nativeChangeMemo);
  }, [container, nativeChangeMemo]);

  // Props that can be passed to any and all input elements
  const baseProps: ComponentProps<any> = {
    className: container.className,
    disabled: container.disabled,
    onChange: handleChangeEvent,
    onClick: handleEvent,
    onInput: handleEvent,
    onFocus: handleEvent,
    onBlur: handleEvent,
    onKeyUp: handleEvent,
    onKeyDown: handleEvent,
    onKeyPress: handleEvent,
    onMouseDown: handleEvent,
    onMouseUp: handleEvent,
    onMouseOver: handleEvent,
    onMouseOut: handleEvent,
    onMouseMove: handleEvent,
    onMouseEnter: handleEvent,
    onMouseLeave: handleEvent,
  };

  if (isSelect) {
    const selectProps: ComponentProps<'select'> = {
      ...baseProps,
      multiple: container.multiple,
      value: selectedOptions,
    };
    const placeholder: string = container.getAttribute('data-placeholder') ?? '';
    return <Wrapper data-placeholder={placeholder} {...props} {...selectProps} />;
  }

  // Props that can be passed to both input and textarea elements
  const { placeholder, readOnly } = container;

  if (isInput) {
    const inputProps: ComponentProps<'input'> = {
      ...baseProps,
      type: container.type,
      checked,
      placeholder,
      readOnly,
      value,
    };

    return <Wrapper {...props} {...inputProps} />;
  }

  const textProps: ComponentProps<'textarea'> = { ...baseProps, placeholder, readOnly, value };
  return <Wrapper {...props} {...textProps} />;
}

export default InputWrapper;
