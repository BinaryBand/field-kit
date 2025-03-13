import React, { ChangeEvent, ComponentProps, ForwardedRef, Fragment, MouseEvent, MutableRefObject, ReactElement } from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { createChangeEvent, useMergedRef } from "@utils";

const Dropdown: StyledComponent<ComponentProps<"div">> = styled.div`
  overflow-y: scroll;
  padding: 4px;
  position: absolute;
  z-index: 5;
  option {
    padding: 4px 6px;
    &:hover {
      background-color: var(--bs-gray-300, #d0d0d7);
    }
  }
`;

function SelectInput({ children, className, defaultValue, onChange, style, value, ...props }: ComponentProps<"select">, ref: ForwardedRef<HTMLSelectElement>): ReactElement {
  const inputRef: MutableRefObject<HTMLInputElement | null> = React.createRef<HTMLInputElement | null>();
  const internalRef: MutableRefObject<HTMLSelectElement | null> = React.createRef<HTMLSelectElement | null>();

  const [inputValue, setInputValue] = React.useState<string>('');
  const [internalValue, setInternalValue] = React.useState<string>(`${defaultValue ?? ""}`);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const [preventBlur, setPreventBlur] = React.useState<boolean>(false);

  const handleBlur = React.useCallback(() => setMenuOpen(preventBlur), [preventBlur]);
  const handleFocus = React.useCallback(() => setMenuOpen(true), []);
  const handleMouseDown = React.useCallback(() => setPreventBlur(true), []);

  function handleInputChange({ currentTarget }: ChangeEvent<HTMLInputElement>): void {
    setInputValue(currentTarget.value);
  }

  function handleSelect({ target }: MouseEvent<HTMLElement>): void {
    if (target instanceof HTMLOptionElement && internalRef.current !== null) {
      setInternalValue(target.value || target.textContent || '');

      if (internalRef.current) {
        onChange?.(createChangeEvent(internalRef.current, target.value));
      }
    }

    setPreventBlur(false);
  }

  React.useEffect((): void => {
    if (internalRef.current !== null) {
      internalRef.current.value = internalValue;
      setMenuOpen(false);

      let inputValue: string | null = internalRef.current.querySelector(`option[value="${internalValue}"]`)?.textContent ?? null;
      inputValue ??= internalRef.current.options[0]?.textContent ?? null;
      setInputValue(inputValue ?? '');
    }
  }, [internalValue]);

  React.useEffect((): void => {
    setInternalValue(`${value ?? ""}`);
  }, [value]);

  return (
    <Fragment>
      <input className={className} onChange={handleInputChange} onBlur={handleBlur} onFocus={handleFocus} ref={inputRef} style={style} type="text" value={inputValue} />
      <Dropdown children={children} className={className} hidden={!menuOpen} onClick={handleSelect} onMouseDown={handleMouseDown} style={style} />
      <select {...props} children={children} hidden ref={useMergedRef(ref, internalRef)} />
    </Fragment>
  );
}

export default React.forwardRef(SelectInput);