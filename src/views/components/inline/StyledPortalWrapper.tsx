import React, { ComponentProps, ElementType, ReactNode } from 'react';
import styled from '@emotion/styled';
import Portal from '@inline/Portal';

interface IWrapperOwnProps<C extends ElementType> {
  component: C;
  container?: HTMLElement | null;
}

type StyledPortalWrapperProps<C extends ElementType> = IWrapperOwnProps<C> &
  Omit<ComponentProps<C>, keyof IWrapperOwnProps<C>>;

function StyledPortalWrapper<C extends ElementType>({
  component,
  container,
  ...rest
}: StyledPortalWrapperProps<C>): ReactNode {
  const [shuttle, setShuttle] = React.useState<HTMLDivElement>();

  const StyledComponent = React.useMemo(() => {
    return styled(component as any)(container?.style.cssText);
  }, [component, container]);

  React.useEffect((): (() => void) => {
    if (!container || !container?.parentElement) return () => undefined;

    const shuttle: HTMLDivElement = document.createElement('div');
    shuttle.classList.add('_tw-wrapper');
    container.parentElement.insertBefore(shuttle, container);
    setShuttle(shuttle);

    return (): void => {
      shuttle.remove();
      setShuttle(undefined);
    };
  }, [container]);

  return (
    <Portal container={shuttle}>
      <StyledComponent {...rest} />
    </Portal>
  );
}

export default StyledPortalWrapper;
