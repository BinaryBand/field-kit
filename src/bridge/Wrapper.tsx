import React, { ComponentType, ElementType, JSX } from 'react';
import styled from '@emotion/styled';
import Portal from '@/bridge/Portal';

function Wrapper<C extends ElementType>({
  component,
  container,
  ...rest
}: WrapperProps<C>): JSX.Element | null {
  if (!container) return null;

  const [shuttle, setShuttle] = React.useState<HTMLDivElement | null>(null);

  const StyledComponent = React.useMemo(() => {
    return styled(component as ComponentType)(container?.style.cssText);
  }, [component, container]);

  React.useLayoutEffect((): (() => void) | void => {
    if (!container?.parentElement || typeof document === 'undefined') return;

    const shuttle: HTMLDivElement = document.createElement('div');
    shuttle.className = '_tw-wrapper';
    container.parentElement.insertBefore(shuttle, container);
    setShuttle(shuttle);

    return (): void => {
      shuttle.remove();
      setShuttle(null);
    };
  }, [container]);

  return (
    <Portal container={shuttle}>
      <StyledComponent {...rest} />
    </Portal>
  );
}

export default Wrapper;
