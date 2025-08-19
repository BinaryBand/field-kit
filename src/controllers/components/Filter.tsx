import React, { ComponentProps, Context, Fragment, ReactElement, ReactNode } from 'react';
import { useDebounce } from 'use-debounce';
import { createRandomKey } from '@utils';

const FilterContext: Context<IFilterContext> = React.createContext<IFilterContext>(null!);

export function TextFilter({ children, target }: IControllerProps<HTMLInputElement>): ReactNode {
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

  return <Fragment children={children} />;
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
      const takeData: string | undefined = container.dataset.twTake;

      let limit: number;
      if (takeData !== undefined) {
        try {
          limit = parseInt(takeData, 10);
        } catch {
          limit = Infinity;
        }
      }

      const escapedRegex: RegExp[] = Object.values(textFilters)
        .map((text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .map((text: string) => new RegExp(text, 'i'));

      let i: number = 0;
      container.querySelectorAll('.tw-filter-item').forEach((child: Element) => {
        const fillString: string = child.textContent ?? '';
        const isVisible: boolean =
          escapedRegex.every((reg: RegExp) => reg.test(fillString)) && i < limit;

        if (isVisible) {
          i++;
        }

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
