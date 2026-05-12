import React, { ChangeEvent, ComponentProps, JSX, SyntheticEvent } from 'react';
import Wrapper from '@/bridge/Wrapper';

import { applySelectedOptions, getSelectedOptionValues } from '@tools/inputs';
import { assert } from '@tools/misc';

function InputWrapper<T extends InputTags, P extends JSX.IntrinsicAttributes>(
  props: InputWrapperProps<T, P>
): JSX.Element | null {
  const { container } = props;
  if (!container) return null;

  const isInput = container instanceof HTMLInputElement;
  const isSelect = container instanceof HTMLSelectElement;

  const [value, setValue] = React.useState<string>(container?.value ?? '');
  const [checked, setChecked] = React.useState<boolean>(isInput && container.checked);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(() =>
    isSelect ? getSelectedOptionValues(container) : []
  );

  function dispatchNativeEvent(type: string, detail: Record<string, any> = {}): void {
    const eventInit: CustomEventInit = { bubbles: true, cancelable: true, detail };
    const nativeEvent = new CustomEvent(type, eventInit);
    container.dispatchEvent(nativeEvent);
  }

  function handleEvent({ type }: SyntheticEvent): void {
    dispatchNativeEvent(type, {
      value: container.value,
      checked: isInput ? Boolean(container.checked) : undefined,
      type,
    });
  }

  function handleChangeEvent(event: ChangeEvent<NativeInputElement>): void {
    const current = event.currentTarget;
    container.value = current.value ?? '';

    if (isInput) {
      assert(current instanceof HTMLInputElement);
      container.checked = Boolean(current.checked);
    } else if (isSelect) {
      assert(current instanceof HTMLSelectElement);
      const values: string[] = getSelectedOptionValues(current);
      applySelectedOptions(container, values);
    }

    dispatchNativeEvent(event.type, {
      value: container.value,
      checked: isInput ? Boolean(container.checked) : undefined,
      selectedOptions: isSelect ? getSelectedOptionValues(container) : undefined,
    });
  }

  React.useLayoutEffect((): (() => void) => {
    const onNativeChange = (): void => {
      setValue(container.value);
      if (isInput) {
        setChecked(Boolean(container.checked));
      } else if (isSelect) {
        const selectedOptions: string[] = getSelectedOptionValues(container);
        setSelectedOptions(selectedOptions);
      }
    };

    container.addEventListener('change', onNativeChange);
    return () => container.removeEventListener('change', onNativeChange);
  }, [container]);

  const baseProps = {
    id: container.id,
    'data-tw-proxy': 'true',
    className: container.className,
    disabled: container.disabled,
    required: container.required,
    tabIndex: container.tabIndex,
    // event handlers
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
  const expandedBaseProps = { ...baseProps, placeholder, readOnly };

  if (isInput) {
    const inputProps: ComponentProps<'input'> = {
      ...expandedBaseProps,
      type: container.type || 'text',
      checked,
      value,
    };

    return <Wrapper {...props} {...inputProps} />;
  }

  const textProps: ComponentProps<'textarea'> = { ...baseProps, value };
  return <Wrapper {...props} {...textProps} />;
}

export default InputWrapper;
