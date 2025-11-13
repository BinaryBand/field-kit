import React, { ChangeEvent, ComponentProps, ForwardedRef, ReactElement, ReactNode } from 'react';
import { useDebounce } from 'use-debounce';

import { InputToken, StyledListInput, HiddenInput, StyledOverlay } from '@/views/styled/ListInput';
import { SelectInputContainer } from '@/views/styled/SelectInput';
import { GroupedInputContainer } from '@/views/styled/GroupedInput';
import Dropdown from '@/views/styled/Dropdown';

import CaretDownIcon from '@/assets/native/CaretDownIcon';
import XIcon from '@/assets/native/XIcon';

import AppContext from '@providers/AppContext';
import GroupedInputContext from '@providers/GroupedInputContext';

import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';
import { tryParse } from '@tools/misc';

const normalizeValue = (value?: string | number | readonly string[]): string[] =>
  Array.isArray(value) ? value : (tryParse<string[]>(value) ?? (value != null ? [`${value}`] : []));

export function GroupedOption({
  children,
  group,
  value,
  ...props
}: ComponentProps<'option'> & { group?: string }): ReactElement {
  const { addOption } = React.useContext(GroupedInputContext);

  React.useEffect((): void => {
    if (value !== undefined && typeof value === 'string') {
      addOption(value, children ?? value, group);
    }
  }, [value, children, group]);

  return <option {...props} children={children} data-group={group} hidden value={value} />;
}

function GroupContainer({
  group,
  groupIndex,
  groupOptions,
  list,
  multiple,
}: {
  group: string;
  groupIndex: number;
  groupOptions: { value: string; label: ReactNode }[];
  list: string[];
  multiple?: boolean;
}): ReactElement {
  return (
    <div className="group-container" data-group={group}>
      {groupIndex > 0 && <hr className="group-separator" />}

      <div className="group-content">
        <div className="group-label">{group}</div>

        <div className="group-options">
          {groupOptions.map(({ value, label }) => {
            const isSelected: boolean = list.includes(value);

            return (
              <InputToken
                key={value}
                className="option-toggle"
                data-option-value={value}
                data-multiple={multiple}
                data-active={isSelected}
              >
                <i className="bi bi-check" hidden={!isSelected}></i>
                <small>{label}</small>
              </InputToken>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GroupedInput(
  {
    className,
    'data-placeholder': placeholder,
    defaultValue,
    multiple,
    onChange,
    onKeyDown,
    style,
    value,
    ...props
  }: SelectInputProps,
  ref: ForwardedRef<HTMLSelectElement>
): ReactElement {
  const { pageWidth, pageHeight } = React.useContext(AppContext);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const internalRef = React.useRef<HTMLSelectElement>(null);
  const placeholderRef = React.useRef<HTMLInputElement>(null);

  const [internalValue, setInternalValue] = React.useState<string>('');
  const [list, setList] = React.useState<string[]>(() => normalizeValue(defaultValue));

  const [debouncedInputValue] = useDebounce(internalValue, 125);
  const [debouncedList] = useDebounce(list, 50);

  const [focused, setFocused] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Record<string, Record<string, ReactNode>>>({});
  const [paddingLeft, setPaddingLeft] = React.useState<number>(0);
  const [paddingTop, setPaddingTop] = React.useState<number>(0);

  const _placeholder: string | undefined = React.useMemo(() => {
    return list.length === 0 ? placeholder : undefined;
  }, [placeholder, list]);

  const groups: string[] = React.useMemo(() => {
    const groupSet = new Set<string>();
    Object.values(options).forEach((groupRecord) => {
      Object.keys(groupRecord).forEach((group) => groupSet.add(group));
    });
    return Array.from(groupSet);
  }, [options]);

  const activeLabel: string | undefined = React.useMemo((): string | undefined => {
    const activeLabel: unknown = options[debouncedList[0]] ?? debouncedList[0];
    return typeof activeLabel === 'string' ? activeLabel : undefined;
  }, [debouncedList, options]);

  const triggerUpdate = React.useCallback(
    (value: string[]): void => {
      if (onChange && internalRef.current !== null) {
        onChange(createChangeEvent(internalRef.current, value));
      } else {
        setList(value);
      }
    },
    [onChange, internalRef]
  );

  function addOption(key: string, value: ReactNode, group?: string): void {
    setOptions((prev: Record<string, Record<string, ReactNode>>) => ({
      ...prev,
      [key]: group ? { ...prev[key], [group]: value } : { ...prev[key], _ungrouped: value },
    }));
  }

  const clearAll = () => triggerUpdate([]);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) =>
    setInternalValue(target.value);

  function handleMouseDown(event: React.MouseEvent): void {
    const { target } = event;

    if (
      target instanceof HTMLElement &&
      target.dataset.optionValue &&
      !target.hasAttribute('disabled')
    ) {
      event.preventDefault();

      const { optionValue } = target.dataset;

      let updatedList: string[];
      if (!multiple) {
        updatedList = [optionValue];
      } else if (!debouncedList.includes(optionValue)) {
        updatedList = [...debouncedList, optionValue];
      } else {
        updatedList = debouncedList.filter((item: string) => item !== optionValue);
      }

      triggerUpdate(updatedList);
    }
  }

  function handleRemove(index: number): void {
    const updatedList: string[] = debouncedList.filter((_, i: number) => i !== index);
    triggerUpdate(updatedList);
  }

  function resize(): void {
    if (containerRef.current !== null && placeholderRef.current !== null) {
      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();
      const { left: inputLeft, top: inputTop } = placeholderRef.current.getBoundingClientRect();
      setPaddingLeft(inputLeft - containerLeft);
      setPaddingTop(inputTop - containerTop);
    }
  }

  React.useEffect(resize, [debouncedList, pageWidth, pageHeight, debouncedInputValue]);
  React.useEffect(() => setList(normalizeValue(value)), [value]);

  React.useEffect(() => {
    const searchValue = debouncedInputValue.toLowerCase();
    dropdownRef.current?.querySelectorAll<HTMLElement>('[data-option-value]').forEach((el) => {
      const isHidden =
        searchValue &&
        !el.textContent?.toLowerCase().includes(searchValue) &&
        !el.dataset.optionValue?.toLowerCase().includes(searchValue);
      el.setAttribute('data-blurred', isHidden ? 'true' : 'false');
    });
  }, [debouncedInputValue]);

  React.useEffect(() => {
    dropdownRef.current
      ?.querySelectorAll('[data-option-value]')
      .forEach((el) => el.setAttribute('data-blurred', 'false'));
    setInternalValue(multiple ? '' : (activeLabel ?? ''));
  }, [focused, debouncedList, multiple, options, activeLabel]);

  return (
    <GroupedInputContext.Provider value={{ options, addOption }}>
      <SelectInputContainer
        className={className}
        data-multiple={multiple || undefined}
        ref={containerRef}
        style={style}
      >
        {list.map((item, i) => {
          const label = Object.values(options[item] || {})[0] ?? item;
          return (
            <InputToken className="token" key={i} onClick={() => handleRemove(i)} role="button">
              <small>{label}</small>
              <XIcon />
            </InputToken>
          );
        })}

        <HiddenInput readOnly ref={placeholderRef} value={internalValue} />

        <StyledListInput
          className={className}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={_placeholder}
          ref={inputRef}
          style={{ ...style, paddingLeft, paddingTop }}
          value={internalValue}
        />
      </SelectInputContainer>

      <StyledOverlay target={containerRef}>
        <CaretDownIcon aria-expanded={focused || undefined} />
        {multiple && (
          <div className="icon-button" onClick={clearAll} role="button">
            <XIcon />
          </div>
        )}

        <Dropdown
          className={className}
          hidden={!focused}
          onMouseDown={handleMouseDown}
          ref={dropdownRef}
          style={{ ...style, display: 'flex', flexDirection: 'column' }}
        >
          {(() => {
            const searchValue = debouncedInputValue.toLowerCase();

            const filterOptions = (opts: { value: string; label: ReactNode }[]) =>
              searchValue
                ? opts.filter(({ value, label }) => {
                    const labelText = String(label);
                    return (
                      labelText.toLowerCase().includes(searchValue) ||
                      value.toLowerCase().includes(searchValue)
                    );
                  })
                : opts;

            const ungroupedOptions = filterOptions(
              Object.entries(options)
                .filter(([_, groupRecord]) => '_ungrouped' in groupRecord)
                .map(([value, groupRecord]) => ({ value, label: groupRecord['_ungrouped'] }))
            );

            const visibleGroups = groups
              .filter((group) => group !== '_ungrouped')
              .map((group, index) => {
                const groupOptions = filterOptions(
                  Object.entries(options)
                    .filter(([_, groupRecord]) => group in groupRecord)
                    .map(([value, groupRecord]) => ({ value, label: groupRecord[group] }))
                );

                return groupOptions.length > 0 ? (
                  <GroupContainer
                    key={group}
                    group={group}
                    groupIndex={index + (ungroupedOptions.length > 0 ? 1 : 0)}
                    groupOptions={groupOptions}
                    list={debouncedList}
                    multiple={multiple}
                  />
                ) : null;
              })
              .filter(Boolean);

            if (ungroupedOptions.length <= 0 && visibleGroups.length <= 0) {
              return (
                <option className="_tw-no-options" disabled>
                  No Options
                </option>
              );
            }

            return (
              <GroupedInputContainer>
                {ungroupedOptions.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                    data-option-value={value}
                    data-selected={debouncedList.includes(value)}
                    aria-disabled={false}
                  >
                    {label}
                  </option>
                ))}
                {visibleGroups}
                {ungroupedOptions.length > 0 && visibleGroups.length > 0 && <hr />}
              </GroupedInputContainer>
            );
          })()}

          {/* Hidden original options for form submission */}
          {React.Children.map(props.children, (child) => {
            if (React.isValidElement(child) && child.type === GroupedOption) {
              return React.cloneElement(child, {
                'aria-disabled': Boolean(child.props.disabled),
                'hidden': true,
              });
            }
            return child;
          })}
        </Dropdown>
      </StyledOverlay>

      <select {...props} hidden multiple ref={useMergedRef(ref, internalRef)} value={list} />
    </GroupedInputContext.Provider>
  );
}

export default React.forwardRef(GroupedInput);
