import React, { ComponentProps, Context, ReactElement, ReactNode } from 'react';
import { useDebounce } from 'use-debounce';
import { createRandomKey } from '@utils';

interface IFilterContext {
  textFilters: Record<string, string>;
  registerFilter: (key: string, value: string) => void;
  unregisterFilter: (key: string) => void;
  updateTextFilter: (key: string, value: string) => void;
}

const FilterContext: Context<IFilterContext> = React.createContext<IFilterContext>(null!);

export function TextFilter({ target }: { target?: HTMLInputElement | null }): ReactNode {
  const { registerFilter, unregisterFilter, updateTextFilter } = React.useContext(FilterContext);

  const key: string = React.useMemo((): string => createRandomKey(), []);
  const [value, setValue] = React.useState<string>(target?.value ?? '');
  const [debouncedValue] = useDebounce(value, 125);

  function handleChange(): void {
    setValue(target?.value ?? '');
  }

  React.useEffect((): void => {
    updateTextFilter(key, debouncedValue);
  }, [debouncedValue]);

  React.useEffect((): (() => void) => {
    registerFilter(key, debouncedValue);
    return (): void => unregisterFilter(key);
  }, [key]);

  React.useEffect((): (() => void) => {
    target?.addEventListener('input', handleChange);
    return () => target?.removeEventListener('input', handleChange);
  }, [target]);

  return null;
}

export function FilterGroup({
  container,
  ...props
}: ComponentProps<'var'> & { container?: HTMLElement | null }): ReactElement {
  const [textFilters, setTextFilters] = React.useState<Record<string, string>>({});

  function registerFilter(key: string, value: string): void {
    setTextFilters((prev) => ({ ...prev, [key]: value }));
  }

  function unregisterFilter(key: string): void {
    setTextFilters((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }

  function updateTextFilter(key: string, value: string): void {
    setTextFilters((prev) => ({ ...prev, [key]: value }));
  }

  React.useEffect((): void => {
    if (container !== null && container !== undefined) {
      const escapedFragments: RegExp[] = Object.values(textFilters)
        .map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .map((text) => new RegExp(text, 'i'));

      container.querySelectorAll('.tw-filter-item').forEach((child: Element) => {
        const fillString: string = child.textContent ?? '';
        const isVisible: boolean = escapedFragments.every((reg: RegExp) => reg.test(fillString));
        child.toggleAttribute('data-tw-blurry', !isVisible);
      });
    }
  }, [textFilters]);

  return (
    <FilterContext.Provider
      {...props}
      value={{ textFilters, registerFilter, unregisterFilter, updateTextFilter }}
    />
  );
}
