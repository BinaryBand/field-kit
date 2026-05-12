import React, { ComponentProps, Context, Fragment, ReactElement, ReactNode } from 'react';
import { useDebounce } from 'use-debounce';
import { createRandomKey } from '@tools/misc';

const FilterContext: Context<IFilterContext> = React.createContext<IFilterContext>(null!);

export function TextFilter({ children, target }: IControllerProps<HTMLInputElement>): ReactNode {
  const { registerFilter, unregisterFilter, updateTextFilter } = React.useContext(FilterContext);

  const key: string = React.useMemo((): string => createRandomKey(), []);
  const [value, setValue] = React.useState<string>(target?.value ?? '');
  const [debouncedValue] = useDebounce(value, 125);

  function handleChange(event: Event): void {
    const inputTarget = event.target as HTMLInputElement;
    setValue(inputTarget?.value ?? '');
  }

  React.useEffect((): void => {
    updateTextFilter(key, debouncedValue);
  }, [key, debouncedValue, updateTextFilter]);

  React.useEffect((): (() => void) => {
    registerFilter(key, debouncedValue);
    return (): void => unregisterFilter(key);
  }, [key, debouncedValue, registerFilter, unregisterFilter]);

  React.useEffect((): (() => void) => {
    if (!target) return () => {};

    target.addEventListener('input', handleChange);
    return () => target.removeEventListener('input', handleChange);
  }, [target]);

  return <Fragment children={children} />;
}

export function FilterGroup({
  container,
  children,
  ...props
}: ComponentProps<'var'> & { container?: HTMLElement | null }): ReactElement {
  const [textFilters, setTextFilters] = React.useState<Record<string, string>>({});

  const registerFilter = React.useCallback((key: string, value: string): void => {
    setTextFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const unregisterFilter = React.useCallback((key: string): void => {
    setTextFilters((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const updateTextFilter = React.useCallback((key: string, value: string): void => {
    setTextFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  React.useEffect((): void => {
    if (!container) return;

    const takeData: string | undefined = container.dataset.twTake;
    let limit: number = Infinity;

    if (takeData !== undefined) {
      try {
        limit = parseInt(takeData, 10);
        if (isNaN(limit)) {
          limit = Infinity;
        }
      } catch {
        limit = Infinity;
      }
    }

    const filterValues = Object.values(textFilters).filter((value) => value.trim() !== '');

    if (filterValues.length === 0) {
      // If no filters, show all items up to limit
      let i = 0;
      container.querySelectorAll('.tw-filter-item').forEach((child: Element) => {
        const isVisible = i < limit;
        if (isVisible) i++;
        child.toggleAttribute('data-tw-blurry', !isVisible);
      });
      return;
    }

    const escapedRegex: RegExp[] = filterValues
      .map((text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .map((text: string) => new RegExp(text, 'i'));

    let visibleCount = 0;
    container.querySelectorAll('.tw-filter-item').forEach((child: Element) => {
      const textContent: string = child.textContent ?? '';
      const matchesAllFilters = escapedRegex.every((regex: RegExp) => regex.test(textContent));
      const isVisible = matchesAllFilters && visibleCount < limit;

      if (isVisible) {
        visibleCount++;
      }

      child.toggleAttribute('data-tw-blurry', !isVisible);
    });
  }, [container, textFilters]);

  // Create TextFilter components for any input[type="filter"] within the container
  const filterInputs = React.useMemo(() => {
    if (!container) return null;

    const inputs = container.querySelectorAll('input[type="filter"]');
    return Array.from(inputs)
      .map((input, index) => {
        if (input instanceof HTMLInputElement) {
          return <TextFilter key={`filter-${index}`} target={input} />;
        }
        return null;
      })
      .filter(Boolean);
  }, [container]);

  return (
    <FilterContext.Provider
      {...props}
      value={{ textFilters, registerFilter, unregisterFilter, updateTextFilter }}
    >
      {filterInputs}
      {children}
    </FilterContext.Provider>
  );
}
