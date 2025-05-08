import React, { Fragment, ReactNode } from 'react';
import Portal from '@inline/Portal';

function isInteger(value: string | null): boolean {
  if (value === null) {
    return false;
  }

  return /^\-?\d+$/.test(value);
}

function Calendar({ children, target }: IControllerProps): ReactNode {
  const observer: MutationObserver = React.useMemo(
    () => new MutationObserver(observerCallback),
    []
  );

  const [yearAttribute, setYearAttribute] = React.useState(target.getAttribute('data-tw-year'));
  const [monthAttribute, setMonthAttribute] = React.useState(target.getAttribute('data-tw-month'));

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
        target.dispatchEvent(new Event('attributes'));
      }
    });
  }

  function updateAttributes(): void {
    setYearAttribute(target.getAttribute('data-tw-year'));
    setMonthAttribute(target.getAttribute('data-tw-month'));
  }

  React.useEffect((): (() => void) => {
    target.addEventListener('attributes', updateAttributes);
    observer.observe(target, { attributes: true });

    return () => {
      target.removeEventListener('attributes', updateAttributes);
      observer.disconnect();
    };
  }, [target]);

  React.useEffect(() => {
    target.setAttribute('data-tw-blank-days', blankDays.toString());
    target.setAttribute('data-tw-total-days', totalDays.toString());
  }, [blankDays, totalDays]);

  if (target instanceof HTMLTableRowElement) {
    return (
      <Portal container={target}>
        {[...new Array(31)].map((_, i: number) => (
          <td className="_tw-calendar-day-placeholder" data-tw-day={i + 1} key={i} />
        ))}

        <Fragment children={children} />
      </Portal>
    );
  }
}

export default Calendar;
