import React, { Fragment, ReactNode } from 'react';
import Portal from '@inline/Portal';

function isInteger(value: string | null): boolean {
  if (value === null) {
    return false;
  }

  return /^\-?\d+$/.test(value);
}

function Calendar({ children, element }: IControllerProps): ReactNode {
  const observer: MutationObserver = React.useMemo(
    () => new MutationObserver(observerCallback),
    []
  );

  const [yearAttribute, setYearAttribute] = React.useState(element.getAttribute('data-tw-year'));
  const [monthAttribute, setMonthAttribute] = React.useState(element.getAttribute('data-tw-month'));

  const { blankDays, totalDays } = React.useMemo(() => {
    const currentDate: Date = new Date(Date.now());
    const year: number = isInteger(yearAttribute)
      ? parseInt(yearAttribute!)
      : currentDate.getFullYear();
    const month: number = isInteger(monthAttribute)
      ? parseInt(monthAttribute!) - 1
      : currentDate.getMonth();

    const targetDate: Date = new Date(year, month, 1);
    const blankDays: number = targetDate.getDay();
    const totalDays: number = new Date(year, month + 1, 0).getDate();

    return { blankDays, totalDays };
  }, [yearAttribute, monthAttribute]);

  function observerCallback(mutations: MutationRecord[]): void {
    mutations.forEach((mut: MutationRecord): void => {
      if (mut.type === 'attributes') {
        element.dispatchEvent(new Event('attributes'));
      }
    });
  }

  function updateAttributes(): void {
    setYearAttribute(element.getAttribute('data-tw-year'));
    setMonthAttribute(element.getAttribute('data-tw-month'));
  }

  React.useEffect((): (() => void) => {
    element.addEventListener('attributes', updateAttributes);
    observer.observe(element, { attributes: true });

    return () => {
      element.removeEventListener('attributes', updateAttributes);
      observer.disconnect();
    };
  }, [element]);

  React.useEffect(() => {
    element.setAttribute('data-tw-blank-days', blankDays.toString());
    element.setAttribute('data-tw-total-days', totalDays.toString());
  }, [blankDays, totalDays]);

  if (element instanceof HTMLTableRowElement) {
    return (
      <Portal container={element}>
        {[...new Array(31)].map((_, i: number) => (
          <td className="_tw-calendar-day-placeholder" data-tw-day={i + 1} key={i} />
        ))}

        <Fragment children={children} />
      </Portal>
    );
  }
}

export default Calendar;
