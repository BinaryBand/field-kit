// import React, {
//   ChangeEvent,
//   ComponentProps,
//   ForwardedRef,
//   Fragment,
//   KeyboardEvent,
//   MouseEvent,
//   MutableRefObject,
//   ReactElement,
// } from 'react';
// import styled, { StyledComponent } from '@emotion/styled';
// import { createChangeEvent, useMergedRef } from '@utils';
// import { useDebounce } from 'use-debounce';

// import Overlay from '@inline/Overlay';

// const StyledInput: StyledComponent<ComponentProps<'input'>> = styled.input`
//   &:not(:focus) + div {
//     display: none;
//   }
// `;

// const Dropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
//   background-color: white;
//   border: 1px solid var(--bs-gray-300, #d0d0d7);
//   overflow-x: hidden;
//   overflow-y: scroll;
//   z-index: 5;

//   position: absolute;
//   left: 0;
//   top: 100%;
//   width: 100%;

//   option {
//     padding: 4px 6px;
//     &:hover:not(:disabled) {
//       background-color: var(--bs-gray-300, #d0d0d7);
//     }

//     &[value=''] {
//       display: none;
//     }
//   }

//   &:not([data-prevent-filter]) {
//     & > option[data-blurred='true']:not(._tw-no-options) {
//       display: none;
//     }
//   }
// `;

// function SelectInput(
//   {
//     children,
//     className,
//     defaultValue,
//     multiple,
//     onChange,
//     style,
//     value,
//     ...props
//   }: ComponentProps<'select'>,
//   ref: ForwardedRef<HTMLSelectElement>
// ): ReactElement {
//   const dropdownRef: MutableRefObject<HTMLDivElement | null> =
//     React.createRef<HTMLDivElement | null>();
// const inputRef: MutableRefObject<HTMLInputElement | null> =
//   React.createRef<HTMLInputElement | null>();
//   const internalRef: MutableRefObject<HTMLSelectElement | null> =
//     React.createRef<HTMLSelectElement | null>();

//   const [inputValue, setInputValue] = React.useState<string>('');
//   const [internalValue, setInternalValue] = React.useState<string>(`${defaultValue ?? ''}`);
//   const [preventFilter, setPreventFilter] = React.useState<boolean>(true);

//   const [debouncedInputValue] = useDebounce(inputValue, 150);

//   function changeOption(option: HTMLOptionElement): void {
//     setInternalValue(option.value);
//     setInputValue(option.textContent ?? '');
//     setPreventFilter(true);

//     if (internalRef.current) {
//       onChange?.(createChangeEvent(internalRef.current, option.value));
//     }
//   }

//   function handleInputChange({ currentTarget }: ChangeEvent<HTMLInputElement>): void {
//     setInputValue(currentTarget.value);
//     setPreventFilter(false);
//   }

//   function handleKeyEvent(event: KeyboardEvent<HTMLInputElement>): void {
//     if (dropdownRef.current !== null) {
//       switch (event.key) {
//         case 'ArrowUp':
//         case 'ArrowDown':
//           event.preventDefault();

//           const options: NodeListOf<HTMLOptionElement> =
//             dropdownRef.current.querySelectorAll<HTMLOptionElement>('option.tw-option');
//           const activeIndex: number = Array.from(options).findIndex(
//             (elem: HTMLOptionElement) => elem.selected
//           );

//           const direction: number = event.key === 'ArrowUp' ? -1 : 1;
//           const selected: HTMLOptionElement = options.item(
//             (activeIndex + direction + options.length) % options.length
//           );
//           changeOption(selected);
//           break;
//         case 'Enter':
//           event.preventDefault();

//           const selected2: HTMLOptionElement | null =
//             dropdownRef.current.querySelector<HTMLOptionElement>('option.tw-option[selected]');
//           selected2 && changeOption(selected2);
//           inputRef.current?.blur();
//           break;
//       }
//     }
//   }

//   function handleMouseDown({ target }: MouseEvent<HTMLDivElement>): void {
//     if (target instanceof HTMLOptionElement) {
//       changeOption(target);
//     }
//   }

//   React.useEffect((): void => {
//     if (dropdownRef.current !== null) {
//       const normalizedInputValue: string = debouncedInputValue.toLowerCase();
//       const options: NodeListOf<HTMLOptionElement> =
//         dropdownRef.current.querySelectorAll<HTMLOptionElement>('option.tw-option');

//       for (let i: number = 0; i < options.length; i++) {
//         const option: HTMLOptionElement | null = options.item(i);

//         const hidden: boolean =
//           !option.textContent?.toLowerCase().includes(normalizedInputValue) &&
//           !option.value?.toLowerCase().includes(normalizedInputValue);

//         option.setAttribute('data-blurred', hidden ? 'true' : 'false');
//       }
//     }
//   }, [debouncedInputValue]);

//   React.useEffect((): void => {
//     if (internalRef.current !== null) {
//       internalRef.current.value = internalValue;

//       const inputValue: string =
//         internalRef.current.querySelector(`option[value="${internalValue}"]`)?.textContent ??
//         internalRef.current.options[0]?.textContent ??
//         '';

//       setInputValue(inputValue);
//     }

//     if (dropdownRef.current !== null) {
//       const options: HTMLCollectionOf<HTMLOptionElement> =
//         dropdownRef.current.getElementsByTagName('option');

//       for (let i: number = 0; i < options.length; i++) {
//         const option: HTMLOptionElement | null = options.item(i);
//         option?.toggleAttribute('selected', option.value === internalValue);
//       }
//     }
//   }, [internalValue]);

//   React.useEffect((): void => {
//     setInternalValue(`${value ?? ''}`);
//   }, [value]);

//   return (
//     <Fragment>
//       <StyledInput
//         className={className}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyEvent}
//         ref={inputRef}
//         style={style}
//         type="text"
//         value={inputValue}
//       />

//       <Overlay target={inputRef}>
//         <Dropdown
//           className={className}
//           data-prevent-filter={preventFilter || undefined}
//           onMouseDown={handleMouseDown}
//           ref={dropdownRef}
//           style={style}
//         >
//           <Fragment children={children} />
//           <option className="_tw-no-options" disabled>
//             No Options
//           </option>
//         </Dropdown>
//       </Overlay>

//       <select {...props} children={children} hidden ref={useMergedRef(ref, internalRef)} />
//     </Fragment>
//   );
// }

// export default React.forwardRef(SelectInput);

import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  Fragment,
  MouseEvent,
  MutableRefObject,
  ReactElement,
} from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import { createChangeEvent, tryParse, useMergedRef } from '@utils';

import AppContext from '@providers/AppContext';
import ClearIconUrl from '@/assets/icons/x.svg';
import Overlay from '@inline/Overlay';

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

const Dropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
  background-color: white;
  border: 1px solid var(--bs-gray-300, #d0d0d7);
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 5;

  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;

  option {
    padding: 4px 6px;
    &:hover:not(:disabled) {
      background-color: var(--bs-gray-300, #d0d0d7);
    }

    &[value=''] {
      display: none;
    }
  }

  &:not([data-prevent-filter]) {
    & > option[data-blurred='true']:not(._tw-no-options) {
      display: none;
    }
  }
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
  z-index: 5;

  &._tw-placeholder-token {
    pointer-events: none;
    visibility: hidden;
  }

  div.icon-button {
    height: 100%;
    display: flex;
    font-size: 1.25em;
    font-weight: bold;
    line-height: 0;
  }
`;

function normalizedInputValue(value?: string | number | readonly string[]): string[] {
  switch (typeof value) {
    case 'string':
    case 'number':
      return tryParse<string[]>(value) ?? [`${value}`];
    case 'object':
      return Array.isArray(value) ? value : [];
    default:
      return [];
  }
}

function ListInput(
  {
    children,
    className,
    defaultValue,
    onChange,
    onKeyDown,
    style,
    value,
    ...props
  }: ComponentProps<'select'>,
  ref: ForwardedRef<HTMLSelectElement>
): ReactElement {
  const { scrollHeight, scrollWidth, pageWidth, pageHeight } = React.useContext(AppContext);

  const containerRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();
  const inputRef: MutableRefObject<HTMLInputElement | null> =
    React.createRef<HTMLInputElement | null>();
  const internalRef: MutableRefObject<HTMLSelectElement | null> =
    React.createRef<HTMLSelectElement | null>();

  const [internalValue, setInternalValue] = React.useState<string>('');
  const [list, setList] = React.useState<string[]>((): string[] =>
    normalizedInputValue(defaultValue)
  );

  const [paddingLeft, setPaddingLeft] = React.useState<number>(0);
  const [paddingTop, setPaddingTop] = React.useState<number>(0);

  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    const newValue: string = target.value;
    setInternalValue(newValue);
  }

  function handleMouseDown(event: MouseEvent): void {
    if (event.target instanceof HTMLOptionElement && internalRef.current !== null) {
      const value: string = event.target.value ?? '';

      let updatedList: string[] = [...list];
      if (!updatedList.includes(value)) {
        updatedList = [...list, value];
      } else {
        updatedList = updatedList.filter((item: string) => item !== value);
      }

      // value

      internalRef.current.querySelector(`option[value="${value}"]`)?.toggleAttribute('selected');

      // internalRef.current.querySelectorAll('option').forEach((option: HTMLOptionElement) => {
      //   option.selected = updatedList.includes(
      //     option.value ? option.value : (option.textContent ?? '')
      //   );
      // });

      const changeEvent: ChangeEvent<HTMLSelectElement> = createChangeEvent(
        internalRef.current,
        updatedList
      );

      onChange?.(changeEvent);
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
  }, [list, scrollHeight, scrollWidth, pageWidth, pageHeight]);

  React.useEffect((): void => {
    const newValue: string[] = normalizedInputValue(value);
    setList(newValue);
  }, [value]);

  return (
    <>
      <ListInputContainer className={className} ref={containerRef} style={style}>
        {list?.map?.((item: string, i: number) => (
          <StyledToken className="token" key={i}>
            <small>{item}</small>
            {/* <div className="icon-button" onClick={() => handleRemove(i)} role="button">
              <img src={ClearIconUrl} />
            </div> */}
          </StyledToken>
        ))}

        <StyledInput readOnly value={internalValue} />

        <StyledReference
          // {...props}
          className={className}
          onChange={handleChange}
          ref={inputRef}
          style={{ ...style, paddingLeft, paddingTop }}
          value={internalValue}
        />
      </ListInputContainer>

      <Overlay target={inputRef}>
        <Dropdown
          className={className}
          // data-prevent-filter={preventFilter || undefined}
          onMouseDown={handleMouseDown}
          // ref={dropdownRef}
          style={style}
        >
          <Fragment children={children} />
          <option className="_tw-no-options" disabled>
            No Options
          </option>
        </Dropdown>
      </Overlay>

      <div style={{ height: '300px' }} />

      <select {...props} children={children} ref={useMergedRef(ref, internalRef)} value={list} />
    </>
  );
}

export default React.forwardRef(ListInput);
