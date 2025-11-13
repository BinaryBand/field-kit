import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  MutableRefObject,
  ReactElement,
} from 'react';

import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';
import SpookyText from '../stylish/SpookyText';

function SimpleInput(
  { defaultValue = '', onChange, value, ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const internalRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();

  const [internalValue, setInternalValue] = React.useState<
    string | number | readonly string[] | undefined
  >(defaultValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (internalRef.current && onChange) {
      onChange(createChangeEvent(internalRef.current, event.target.value));
    } else {
      setInternalValue(event.target.value);
    }
  }

  React.useEffect((): void => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <>
      <input
        {...props}
        onChange={handleChange}
        ref={useMergedRef(ref, internalRef)}
        value={internalValue}
      />
      <SpookyText>Boo! I'm floating...</SpookyText>
    </>
  );
}

export default React.forwardRef(SimpleInput);
