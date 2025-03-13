import React, { ComponentProps, ReactNode } from "react";
import styled, { StyledComponent } from "@emotion/styled";
import Portal from "@inline/Portal";

function Wrapper<T extends keyof HTMLElementTagNameMap>(props: OverloadedWrapperProps<T>): ReactNode;
function Wrapper<T extends keyof HTMLElementTagNameMap>({ component, container, ...props }: WrapperProps<T>): ReactNode {
  const Component: StyledComponent<ComponentProps<T>> = React.useMemo(() => styled(component)(container.style.cssText), []);
  const { className } = React.useMemo(() => container, []);

  const [shuttle, setShuttle] = React.useState<HTMLDivElement>();

  React.useEffect((): (() => void) => {
    if (!container || !container?.parentElement) return () => undefined;

    const shuttle: HTMLDivElement = document.createElement("div");
    shuttle.classList.add("_tw-satellite");
    container.parentElement.insertBefore(shuttle, container);
    setShuttle(shuttle);

    return (): void => {
      shuttle.remove();
      setShuttle(undefined);
    };
  }, [container]);

  return (
    <Portal container={shuttle}>
      <Component {...props as ComponentProps<T>} className={className} theme={undefined} />
    </Portal>
  );
}

export default Wrapper;