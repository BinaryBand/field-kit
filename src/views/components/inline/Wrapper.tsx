import React, { ComponentProps, ComponentType, JSX, ReactNode } from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import Portal from '@/views/components/inline/Portal';

interface IWrapperProps<
  P extends JSX.IntrinsicAttributes,
  C extends keyof JSX.IntrinsicElements | ComponentType<P>,
> {
  component: C;
  container?: HTMLElement | null;
}

type WrapperProps<
  P extends JSX.IntrinsicAttributes,
  C extends keyof JSX.IntrinsicElements | ComponentType<P>,
> = IWrapperProps<P, C> & ComponentProps<C>;

function Wrapper<
  P extends JSX.IntrinsicAttributes,
  C extends keyof JSX.IntrinsicElements | ComponentType<P>,
>({ component, container, ...props }: WrapperProps<P, C>): ReactNode {
  const [shuttle, setShuttle] = React.useState<HTMLDivElement>();

  const StyledComponent = React.useMemo<StyledComponent<ComponentProps<C>, any, any>>(
    () => styled(component as keyof JSX.IntrinsicElements)(container?.style.cssText),
    // () => styled(component as React.ComponentType<P>)(container?.style.cssText),
    [component, container]
  );

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
      <StyledComponent {...props} />
    </Portal>
  );
}

export default Wrapper;
