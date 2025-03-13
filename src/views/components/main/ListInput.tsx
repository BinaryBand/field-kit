import React, { ChangeEvent, ComponentProps, ForwardedRef, Fragment, KeyboardEvent, MutableRefObject, ReactElement } from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { createChangeEvent, tryParse, useMergedRef } from "@utils";

export const StyledToken: StyledComponent<ComponentProps<"div">> = styled.div`
  align-items: center;
  border: 1px solid;
  border-radius: 2em;
  display: inline-flex;
  gap: 0.3em;
  padding: 0.1em 0.5em;

  div.icon-button {
    display: flex;
    font-size: 1.25em;
    font-weight: bold;
    line-height: 0;
  }
`;

function ListInput(
  { defaultValue, onChange, onKeyDown, value, ...props }: ComponentProps<"input">,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const internalRef: MutableRefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement | null>(null);

  const [internalValue, setInternalValue] = React.useState<string>("");
  const [list, setList] = React.useState<string[]>(() => {
    return tryParse<string[]>(defaultValue) ?? [`${value}`];
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const newValue: string = event.target.value;
    setInternalValue(newValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter" && internalValue !== "") {
      event.preventDefault();

      const newValue: string[] = [...list, internalValue];
      setInternalValue("");
      setList(newValue);

      if (event.currentTarget !== null) {
        onChange?.(createChangeEvent(event.currentTarget, JSON.stringify(newValue)));
      }
    } else if (event.key === "Backspace" && internalValue === "") {
      event.preventDefault();

      const newValue: string[] = list.slice(0, list.length - 1);
      setInternalValue(list[list.length - 1] ?? "");
      setList(newValue);

      if (event.currentTarget !== null) {
        onChange?.(createChangeEvent(event.currentTarget, JSON.stringify(newValue)));
      }
    }

    onKeyDown?.(event);
  }

  function handleRemove(i: number): void {
    const updatedList: string[] = list.filter((_, j: number) => j !== i);
    setList(updatedList);

    if (internalRef.current !== null) {
      onChange?.(createChangeEvent(internalRef.current, JSON.stringify(updatedList)));
    }
  }

  React.useEffect((): void => {
    if (typeof value === "string") {
      const fullList: string[] = tryParse<string[]>(value) ?? [`${value}`].filter(Boolean);
      setList(fullList);
    } else if (Array.isArray(value)) {
      setList(value);
    }
  }, [value]);

  return (
    <Fragment>
      <Fragment
        children={list.map((item: string, i: number) => (
          <StyledToken className="token" key={i}>
            <small>{item}</small>
            <div className="icon-button" onClick={() => handleRemove(i)} role="button">⮾</div>
          </StyledToken>
        ))}
      />

      <input
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={useMergedRef(ref, internalRef)}
        value={internalValue}
      />
    </Fragment>
  );
}

export default React.forwardRef(ListInput);
