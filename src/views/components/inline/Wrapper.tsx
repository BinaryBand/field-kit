import React, { ComponentType, ElementType, ReactNode } from 'react';
import styled from '@emotion/styled';
import Portal from '@inline/Portal';

function Wrapper<C extends ElementType>({
  component,
  container,
  ...rest
}: WrapperProps<C>): ReactNode {
  const [shuttle, setShuttle] = React.useState<HTMLDivElement>();

  const StyledComponent = React.useMemo(() => {
    return styled(component as ComponentType)(container?.style.cssText);
  }, [component, container]);

  React.useEffect((): (() => void) | void => {
    if (!container || !container?.parentElement || typeof document === undefined) {
      return;
    }

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

export default Wrapper;
